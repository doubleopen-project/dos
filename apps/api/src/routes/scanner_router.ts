// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { JobStatus } from "bull";
import { ApiScope, Package, ScannerJob } from "database";
import log from "loglevel";
import { deleteFile, getPresignedPutUrl, objectExistsCheck } from "s3-helpers";
import { scannerAPI } from "validation-helpers";
import { timeout } from "../helpers/constants";
import { CustomError } from "../helpers/custom_error";
import * as dbOperations from "../helpers/db_operations";
import * as dbQueries from "../helpers/db_queries";
import { getErrorCodeAndMessage } from "../helpers/error_handling";
import { processPackageAndSendToScanner } from "../helpers/new_job_process";
import { parsePurl } from "../helpers/purl_helpers";
import { s3Client } from "../helpers/s3client";
import { stateMap } from "../helpers/state_helpers";
import {
    authenticateDosApiToken,
    requireApiScope,
} from "../middlewares/auth_api_token";
import { authzPermission } from "../middlewares/authz_permission";
import QueueService from "../services/queue";

const scannerRouter = zodiosRouter(scannerAPI);

const workQueue = QueueService.getInstance();

const jobStateMap: Map<string, string> = new Map();

const logLevel: log.LogLevelDesc =
    (process.env.LOG_LEVEL as log.LogLevelDesc) || "info"; // trace/debug/info/warn/error/silent

log.setLevel(logLevel);

// Get health status of the API
scannerRouter.get("/health", async (req, res) => {
    res.status(200).json({ message: "DOS API running" });
});

// Get scan results for package with purl
scannerRouter.post(
    "/scan-results",
    authenticateDosApiToken,
    requireApiScope(ApiScope.SCAN_DATA),
    async (req, res) => {
        const reqPackages =
            "packages" in req.body
                ? req.body.packages
                : "purls" in req.body
                  ? req.body.purls.map((purl) => ({
                        purl: purl,
                        declaredLicenseExpressionSPDX: null,
                    }))
                  : [];
        const reqPurls =
            "purls" in req.body
                ? req.body.purls
                : reqPackages.map((pkg) => pkg.purl);

        try {
            console.log(
                "Searching for results for package with purl(s): " +
                    reqPurls.join(", "),
            );

            const packages = await dbQueries.findPackagesByPurls(reqPurls);

            if (packages.length === 0) {
                console.log("No results found");
                res.status(200).json({
                    purls: [],
                    state: {
                        status: "no-results",
                        jobId: null,
                    },
                    results: null,
                });
            } else {
                const scannedPackages = [];
                const pendingJobs: ScannerJob[] = [];
                const inDbNoJobsNotScannedPkgIds: number[] = [];
                const inDbNotScannedPkgIds: number[] = [];
                const purls = [];
                // create shallow copy of the purls array
                const notInDbPurls = [...reqPurls];

                for (const pkg of packages) {
                    if (pkg.scanStatus === "scanned") scannedPackages.push(pkg);
                    else if (pkg.scanStatus === "pending") {
                        const scannerJob =
                            await dbQueries.findScannerJobByPackageId(pkg.id);
                        if (scannerJob) pendingJobs.push(scannerJob);
                        else inDbNoJobsNotScannedPkgIds.push(pkg.id);

                        inDbNotScannedPkgIds.push(pkg.id);
                    } else {
                        inDbNoJobsNotScannedPkgIds.push(pkg.id);
                        inDbNotScannedPkgIds.push(pkg.id);
                    }
                    // Removing purls that were found in the database from the notInDbPurls array
                    notInDbPurls.splice(notInDbPurls.indexOf(pkg.purl), 1);
                    purls.push(pkg.purl);
                    // Save declared license for the package if it hasn't been saved yet
                    if (!pkg.declaredLicenseSPDX && "packages" in req.body) {
                        const declaredLicense = req.body.packages.find(
                            (elem) => elem.purl === pkg.purl,
                        )?.declaredLicenseExpressionSPDX;

                        if (declaredLicense) {
                            await dbQueries.updatePackage({
                                id: pkg.id,
                                data: {
                                    declaredLicenseSPDX: declaredLicense,
                                },
                            });
                        }
                    }
                }

                /*
                 * Collect the ids for new packages in case there are any timeout issues that
                 * require re-scanning files that timed out, so that all the packages can be
                 * set to pending state.
                 */
                const newPackageIds: number[] = [];

                if (scannedPackages.length > 0) {
                    console.log("Found scan results");
                    // The results will be the same for all packages, so we can just get the results for the first one
                    const results = await dbOperations.getScanResults(
                        scannedPackages[0].purl,
                    );

                    if (scannedPackages.length < reqPackages.length) {
                        // If all of the packages are not scanned, we need to copy the results to the other packages
                        console.log(
                            "Bookmarking results for purls that are not in the database yet",
                        );
                        const copyPackageIds = inDbNotScannedPkgIds;

                        for (const purl of notInDbPurls) {
                            const parsedPurl = parsePurl(purl);
                            const newPackage = await dbQueries.createPackage({
                                type: parsedPurl.type,
                                namespace: parsedPurl.namespace,
                                name: parsedPurl.name,
                                version: parsedPurl.version,
                                qualifiers: parsedPurl.qualifiers,
                                subpath: parsedPurl.subpath,
                                scanStatus: "notScanned",
                                declaredLicenseSPDX: reqPackages.find(
                                    (elem) => elem.purl === purl,
                                )?.declaredLicenseExpressionSPDX,
                            });

                            newPackageIds.push(newPackage.id);

                            if (newPackage.purl !== purl) {
                                dbQueries.deletePackage(newPackage.id);
                                await dbQueries.createSystemIssue({
                                    message:
                                        "Generated purl does not match the requested purl",
                                    severity: "MODERATE",
                                    errorCode: "PURL_MISMATCH",
                                    errorType: "ScannerRouterError",
                                    info: JSON.stringify({
                                        requestedPurl: purl,
                                        generatedPurl: newPackage.purl,
                                    }),
                                });
                                throw new CustomError(
                                    "Internal server error. Generated purl does not match the requested purl",
                                    500,
                                );
                            }
                            purls.push(newPackage.purl);
                            copyPackageIds.push(newPackage.id);
                        }

                        console.time(
                            "Copying FileTrees to " +
                                copyPackageIds.length +
                                " packages took",
                        );
                        await dbOperations.copyDataToNewPackages(
                            scannedPackages[0].id,
                            copyPackageIds,
                        );
                        console.timeEnd(
                            "Copying FileTrees to " +
                                copyPackageIds.length +
                                " packages took",
                        );

                        // Updating scan status for the packages that were copied
                        await dbQueries.updateManyPackagesScanStatuses(
                            copyPackageIds,
                            "scanned",
                        );

                        if (pendingJobs.length > 0) {
                            // If there are pending ScannerJobs for the packages, we need to update their state
                            await dbQueries.updateManyScannerJobStates(
                                pendingJobs.map((job) => job.id),
                                "completed",
                            );
                            // There actually shouldn't be any pending jobs in this case, so creating a system issue so this can be reviewed if needed
                            // Not throwing an error, as this is more of an error in the logic somewhere, and doesn't prevent from performing this operation
                            await dbQueries.createSystemIssue({
                                message:
                                    "Found pending ScannerJobs even though source has already been scanned.",
                                severity: "LOW",
                                errorCode: "PENDING_JOBS_FOR_SCANNED_SOURCE",
                                errorType: "ScannerRouterError",
                                info: JSON.stringify({
                                    pendingJobs: pendingJobs,
                                }),
                            });
                        }
                    }

                    // Look for timeout scan issues that used a lower timeout than the current one
                    const scanIssues =
                        await dbQueries.findTimeoutScanIssuesByPackageIdAndTimeout(
                            scannedPackages[0].id,
                            timeout,
                        );

                    // Re-scan files that timed out
                    if (scanIssues.length > 0) {
                        const filesToScan: { hash: string; path: string }[] =
                            [];
                        for (const issue of scanIssues) {
                            const ft =
                                await dbQueries.findFileTreeByHashAndPackageId(
                                    issue.fileSha256,
                                    scannedPackages[0].id,
                                );

                            if (ft) {
                                filesToScan.push({
                                    hash: issue.fileSha256,
                                    path: ft.path,
                                });
                            }
                        }

                        const rescanScannerJobIds: string[] = [];

                        const parentJob = await dbQueries.createScannerJob({
                            state: "created",
                            packageId: scannedPackages[0].id,
                        });

                        rescanScannerJobIds.push(parentJob.id);

                        const affectedPackageIds: number[] = scannedPackages
                            .map((pkg) => pkg.id)
                            .concat(newPackageIds);

                        for (const pkgId of affectedPackageIds) {
                            if (pkgId !== scannedPackages[0].id) {
                                const childJob =
                                    await dbQueries.createScannerJob({
                                        packageId: pkgId,
                                        state: "created",
                                        parentId: parentJob.id,
                                    });

                                rescanScannerJobIds.push(childJob.id);
                            }
                        }

                        await workQueue.add(
                            {
                                jobId: parentJob.id,
                                options: { timeout: timeout },
                                files: filesToScan,
                            },
                            {
                                jobId: parentJob.id,
                            },
                        );

                        await dbQueries.updateScannerJob(parentJob.id, {
                            fileCount: filesToScan.length,
                            timeout: timeout,
                        });

                        await dbQueries.updateManyScannerJobStates(
                            rescanScannerJobIds,
                            "queued",
                        );

                        await dbQueries.updateManyPackagesScanStatuses(
                            affectedPackageIds,
                            "pending",
                        );

                        res.status(200).json({
                            purls: purls,
                            state: {
                                status: "pending",
                                jobId: parentJob.id,
                            },
                            results: null,
                        });
                    } else {
                        res.status(200).json({
                            purls: purls,
                            state: {
                                status: "ready",
                                jobId: null,
                            },
                            results: results,
                        });
                    }
                } else if (pendingJobs.length > 0) {
                    console.log("Found pending ScannerJob");

                    if (pendingJobs.length !== reqPackages.length) {
                        console.log(
                            "Creating new ScannerJobs for packages that do not have one yet and linking them to an existing ScannerJob",
                        );
                        // If there are pending ScannerJobs for some of the packages, but not all of them, we need to create
                        // new ScannerJobs for the packages that do not have a ScannerJob yet and link them to an existing ScannerJob

                        const parentId: string =
                            pendingJobs[0].parentId || pendingJobs[0].id;

                        for (const pkgId of inDbNoJobsNotScannedPkgIds) {
                            await dbQueries.createScannerJob({
                                packageId: pkgId,
                                state: pendingJobs[0].state,
                                parentId: parentId,
                            });
                        }

                        await dbQueries.updateManyPackagesScanStatuses(
                            inDbNoJobsNotScannedPkgIds,
                            "pending",
                        );

                        for (const purl of notInDbPurls) {
                            const parsedPurl = parsePurl(purl);
                            const newPackage = await dbQueries.createPackage({
                                type: parsedPurl.type,
                                namespace: parsedPurl.namespace,
                                name: parsedPurl.name,
                                version: parsedPurl.version,
                                qualifiers: parsedPurl.qualifiers,
                                subpath: parsedPurl.subpath,
                                scanStatus: "pending",
                                declaredLicenseSPDX: reqPackages.find(
                                    (elem) => elem.purl === purl,
                                )?.declaredLicenseExpressionSPDX,
                            });

                            if (newPackage.purl !== purl) {
                                dbQueries.deletePackage(newPackage.id);
                                await dbQueries.createSystemIssue({
                                    message:
                                        "Generated purl does not match the requested purl",
                                    severity: "MODERATE",
                                    errorCode: "PURL_MISMATCH",
                                    errorType: "ScannerRouterError",
                                    info: JSON.stringify({
                                        requestedPurl: purl,
                                        generatedPurl: newPackage.purl,
                                    }),
                                });
                                log.debug(
                                    `Generated purl does not match the requested purl.\nRequested purl: ${purl}\nGenerated purl: ${newPackage.purl}`,
                                );
                                throw new CustomError(
                                    "Internal server error. Generated purl does not match the requested purl",
                                    500,
                                );
                            }

                            purls.push(newPackage.purl);

                            await dbQueries.createScannerJob({
                                packageId: newPackage.id,
                                state: pendingJobs[0].state,
                                parentId: parentId,
                            });
                        }

                        res.status(200).json({
                            purls: purls,
                            state: {
                                status: "pending",
                                jobId: parentId,
                            },
                            results: null,
                        });
                    } else {
                        // If all of the packages have a pending ScannerJob, we can return the id of the first one, or rather, if it has a parent, the id of the parent
                        res.status(200).json({
                            purls: purls,
                            state: {
                                status: "pending",
                                jobId:
                                    pendingJobs[0].parentId ||
                                    pendingJobs[0].id,
                            },
                            results: null,
                        });
                    }
                } else {
                    console.log("No results found");
                    res.status(200).json({
                        purls: [],
                        state: {
                            status: "no-results",
                            jobId: null,
                        },
                        results: null,
                    });
                }
            }
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                const err = await getErrorCodeAndMessage(error);

                if (err.message === "Internal server error") {
                    try {
                        await dbQueries.createSystemIssue({
                            message: "Error in post /scan-results",
                            severity: "MODERATE",
                            errorCode: "UNKNOWN_ERROR",
                            errorType: "ScannerRouterError",
                            info: JSON.stringify({
                                requestBody: req.body,
                                error: error,
                            }),
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

// Get package configuration for package with purl
scannerRouter.post(
    "/package-configuration",
    authenticateDosApiToken,
    requireApiScope(ApiScope.CLEARANCE_DATA),
    async (req, res) => {
        try {
            // The middlewares have already verified that req.apiTokenAuth exists, so the non-null assertion operator can be safely used here.
            const auth = req.apiTokenAuth!;

            console.log(
                "Searching for configuration for package with purl: " +
                    req.body.purl,
            );

            const packageId = await dbQueries.findPackageIdByPurl(
                req.body.purl,
                "scanned",
            );

            if (!packageId) throw new CustomError("Package not found", 404);

            const packageConfiguration =
                await dbOperations.getPackageConfiguration(
                    packageId,
                    auth.apiTokenId,
                );

            res.status(200).json(packageConfiguration);
        } catch (error) {
            console.log("Error: ", error);

            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

// Request presigned upload url for a file
scannerRouter.post(
    "/upload-url",
    authenticateDosApiToken,
    requireApiScope(ApiScope.SCAN_DATA),
    async (req, res) => {
        try {
            const objectExists = await objectExistsCheck(
                s3Client,
                process.env.SPACES_BUCKET || "doubleopen",
                req.body.key,
            );

            if (objectExists === undefined) {
                console.log("Error: objectExists undefined");
                return res.status(200).json({
                    success: false,
                    presignedUrl: undefined,
                    message:
                        "Unable to determine if object with the requested key already exists",
                });
            }
            if (objectExists) {
                console.log(
                    "Error: Object with key " +
                        req.body.key +
                        " already exists.",
                );
                return res.status(200).json({
                    success: false,
                    presignedUrl: undefined,
                    message: "An object with the requested key already exists",
                });
            }

            const presignedUrl: string | undefined = await getPresignedPutUrl(
                s3Client,
                process.env.SPACES_BUCKET || "doubleopen",
                req.body.key,
            );

            if (presignedUrl) {
                res.status(200).json({
                    success: true,
                    presignedUrl: presignedUrl,
                    message: "Presigned URL received",
                });
            } else {
                console.log("Error: Presigned URL is undefined");
                res.status(200).json({
                    success: false,
                    presignedUrl: undefined,
                    message:
                        "Unable to get a presigned URL for the requested key",
                });
            }
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
);

// Add new ScannerJob
scannerRouter.post(
    "/job",
    authenticateDosApiToken,
    requireApiScope(ApiScope.SCAN_DATA),
    async (req, res) => {
        try {
            const packagesArray: {
                package: Package;
                existingJob: ScannerJob | null;
            }[] = [];

            const queryPackages =
                "packages" in req.body
                    ? req.body.packages
                    : "purls" in req.body
                      ? req.body.purls.map((purl) => {
                            return {
                                purl: purl,
                                declaredLicenseExpressionSPDX: null,
                            };
                        })
                      : [];

            // Finding existing Packages and ScannerJobs for the purls, creating new Packages if needed
            for (const pkg of queryPackages) {
                let packageObj = await dbQueries.findPackageByPurl(pkg.purl);
                let existingJob = null;
                if (!packageObj) {
                    const parsedPurl = parsePurl(pkg.purl);

                    const jobPackage = await dbQueries.createPackage({
                        type: parsedPurl.type,
                        namespace: parsedPurl.namespace,
                        name: parsedPurl.name,
                        version: parsedPurl.version,
                        qualifiers: parsedPurl.qualifiers,
                        subpath: parsedPurl.subpath,
                        scanStatus: "notScanned",
                        declaredLicenseSPDX: pkg.declaredLicenseExpressionSPDX,
                    });

                    if (jobPackage.purl !== pkg.purl) {
                        dbQueries.deletePackage(jobPackage.id);
                        await dbQueries.createSystemIssue({
                            message:
                                "Generated purl does not match the requested purl",
                            severity: "MODERATE",
                            errorCode: "PURL_MISMATCH",
                            errorType: "ScannerRouterError",
                            info: JSON.stringify({
                                requestedPurl: pkg.purl,
                                generatedPurl: jobPackage.purl,
                                zipFileKey: req.body.zipFileKey,
                            }),
                        });
                        log.debug(
                            `Generated purl does not match the requested purl.\nRequested purl: ${pkg.purl}\nGenerated purl: ${jobPackage.purl}`,
                        );
                        throw new CustomError(
                            "Internal server error. Generated purl does not match the requested purl",
                            500,
                        );
                    }

                    packageObj = jobPackage;
                } else {
                    // Checking if there already is a ScannerJob for the package
                    existingJob = await dbQueries.findScannerJobByPackageId(
                        packageObj.id,
                    );
                }

                packagesArray.push({
                    package: packageObj,
                    existingJob: existingJob,
                });
            }

            let scannerJobIdToReturn = null;
            let packageIdsForNewJobProcess: number[] | null = [];
            let existingJobs: ScannerJob[] | null = [];

            if (packagesArray.length === 1) {
                if (
                    packagesArray[0].existingJob &&
                    packagesArray[0].existingJob.state !== "failed"
                ) {
                    // Deleting zip file from object storage
                    await deleteFile(
                        s3Client,
                        process.env.SPACES_BUCKET || "doubleopen",
                        req.body.zipFileKey,
                    );
                    // This is the case where only one purl was given and a ScannerJob already exists for it
                    scannerJobIdToReturn = packagesArray[0].existingJob.id;
                    packageIdsForNewJobProcess = null;
                    existingJobs = null;
                } else {
                    // This is the case where only one purl was given and a ScannerJob does not exist for it
                    scannerJobIdToReturn = (
                        await dbQueries.createScannerJob({
                            state: "created",
                            packageId: packagesArray[0].package.id,
                            objectStorageKey: req.body.zipFileKey,
                        })
                    ).id;
                    packageIdsForNewJobProcess = null;
                    existingJobs = null;

                    processPackageAndSendToScanner(
                        req.body.zipFileKey,
                        scannerJobIdToReturn,
                        [packagesArray[0].package.id],
                        [packagesArray[0].package.purl],
                        jobStateMap,
                    );
                }
            } else {
                for (const pkg of packagesArray) {
                    // If a scanned package with any of these purls already exists,
                    // the filetrees can be copied to the other ones
                    if (pkg.package.scanStatus === "scanned") {
                        const copyPackageIds = [];

                        for (const pkg2 of packagesArray) {
                            if (
                                pkg2.package.id !== pkg.package.id &&
                                pkg2.package.scanStatus !== "scanned"
                            ) {
                                copyPackageIds.push(pkg2.package.id);
                            }
                        }

                        await dbOperations.copyDataToNewPackages(
                            pkg.package.id,
                            copyPackageIds,
                        );

                        // Updating scan status for the packages that were copied
                        await dbQueries.updateManyPackagesScanStatuses(
                            copyPackageIds,
                            "scanned",
                        );

                        packageIdsForNewJobProcess = null;
                        scannerJobIdToReturn = pkg.existingJob?.id;

                        // If the Package is scanned, but there is no ScannerJob for it,
                        // we need to create a new ScannerJob for the package, so that we can return the id in response
                        if (!scannerJobIdToReturn)
                            scannerJobIdToReturn = (
                                await dbQueries.createScannerJob({
                                    state: "completed",
                                    packageId: pkg.package.id,
                                })
                            ).id;
                        break;
                    } else if (
                        pkg.existingJob &&
                        pkg.existingJob.state !== "failed"
                    ) {
                        // Case where a still running ScannerJob exists for the package
                        existingJobs.push(pkg.existingJob);
                    } else {
                        // Otherwise add the package to the list of packages that need to be processed
                        packageIdsForNewJobProcess.push(pkg.package.id);
                    }
                }
            }

            if (existingJobs && existingJobs.length > 0) {
                // Even if there are more than one existing jobs, we only need the first one, as these
                // jobs are scanning the same source anyway, or are linked to the same parent ScannerJob

                // We can now create child ScannerJobs for the packages that do not have a Scanner Job yet
                // These child ScannerJobs will be linked to the existing ScannerJob and their state will be updated
                // when the existing ScannerJob state changes

                /*
                 * The reason why it is better to have these child ScannerJobs instead of changing the implementation to
                 * support multiple packageIds in one ScannerJob is that if the original ScannerJob is in the 'savingResults' phase
                 * when new packages are added to it, the results might not actually get saved for the new packages.
                 * When there are these child ScannerJobs, the jobStateQuery cron job can catch the state difference between the
                 * original ScannerJob and the child ScannerJobs and copy the results to the packages linked to the child ScannerJobs
                 * and update the state of the child ScannerJobs accordingly.
                 */

                const parentId: string =
                    existingJobs[0].parentId || existingJobs[0].id;

                const packageIdsForStateUpdate = [];
                for (const pkg of packagesArray) {
                    if (!pkg.existingJob) {
                        const createdJob = await dbQueries.createScannerJob({
                            packageId: pkg.package.id,
                            state: existingJobs[0].state,
                            parentId: parentId,
                        });

                        // Setting the ScannerJob id to return in response to the first created child ScannerJob
                        if (!scannerJobIdToReturn)
                            scannerJobIdToReturn = createdJob.id;
                    }
                    if (pkg.package.scanStatus === "notScanned") {
                        packageIdsForStateUpdate.push(pkg.package.id);
                    }
                }

                // If all the packages already had a ScannerJob, we can return the id of the parent ScannerJob
                if (!scannerJobIdToReturn) scannerJobIdToReturn = parentId;

                // Update the scan status for the packages
                if (packageIdsForStateUpdate.length > 0) {
                    await dbQueries.updateManyPackagesScanStatuses(
                        packageIdsForStateUpdate,
                        "pending",
                    );
                }
            } else if (packageIdsForNewJobProcess) {
                // If there were no existing ScannerJobs, or Packages that were scanned, we need to create a new ScannerJob
                // and process files for the packages
                const newScannerJob = await dbQueries.createScannerJob({
                    state: "created",
                    objectStorageKey: req.body.zipFileKey,
                    packageId: packageIdsForNewJobProcess[0],
                });

                scannerJobIdToReturn = newScannerJob.id;

                processPackageAndSendToScanner(
                    req.body.zipFileKey,
                    scannerJobIdToReturn,
                    packageIdsForNewJobProcess,
                    queryPackages.map((pkg) => pkg.purl),
                    jobStateMap,
                );
            }

            if (!scannerJobIdToReturn)
                throw new CustomError(
                    "Internal server error. Something is missing in the processing as no scanner job id exists to return in response.",
                    500,
                );
            return res.status(200).json({
                scannerJobId: scannerJobIdToReturn,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                const err = await getErrorCodeAndMessage(error);

                if (err.message === "Internal server error") {
                    try {
                        await dbQueries.createSystemIssue({
                            message: "Error in post /job",
                            severity: "MODERATE",
                            errorCode: "UNKNOWN_ERROR",
                            errorType: "ScannerRouterError",
                            info: JSON.stringify({
                                requestBody: req.body,
                                error: error,
                            }),
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }

                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

// Get ScannerJob state
scannerRouter.get(
    "/job-state/:id",
    authenticateDosApiToken,
    requireApiScope(ApiScope.SCAN_DATA),
    async (req, res) => {
        try {
            const scannerJob = await dbQueries.findScannerJobStateById(
                req.params.id,
            );

            if (!scannerJob) {
                res.status(400).json({
                    message:
                        "Bad Request: Scanner Job with requested id cannot be found in the database",
                });
            } else {
                let message =
                    stateMap.get(scannerJob.state) || scannerJob.state;

                if (scannerJob.state === "failed") {
                    message = scannerJob.failureMessage || message;
                } else if (
                    scannerJob.state === "processing" ||
                    scannerJob.state === "savingResults"
                ) {
                    message =
                        jobStateMap.get(scannerJob.id) ||
                        stateMap.get(scannerJob.state) ||
                        message;
                }
                res.status(200).json({
                    state: {
                        status: scannerJob.state,
                        message: message,
                    },
                });
            }
        } catch (error) {
            console.log("Problem with database query: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
);

// Get all jobs in the work queue
scannerRouter.get(
    "/work-queue/jobs",
    authzPermission({ resource: "WorkQueue", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const jobStatuses: JobStatus[] = req.query.status || [
                "active",
                "waiting",
                "completed",
                "failed",
                "delayed",
                "paused",
            ];

            const jobs = await workQueue.getJobs(jobStatuses);

            const jobList: {
                id: string;
                state: string;
                finishedOn: Date | undefined;
            }[] = [];

            for (const job of jobs) {
                const state = await job.getState();
                const finishedOn = job.finishedOn;
                jobList.push({
                    id: String(job.id),
                    state,
                    finishedOn: finishedOn ? new Date(finishedOn) : undefined,
                });
            }
            res.status(200).json(jobList);
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({
                message: "Internal server error: Unknown error",
            });
        }
    },
);

// Get details for job in work queue
scannerRouter.get(
    "/work-queue/jobs/:id",
    authzPermission({ resource: "WorkQueue", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const job = await workQueue.getJob(req.params.id);

            if (!job) throw new CustomError("Job not found", 404);

            const state = await job.getState();
            const finishedOn = job.finishedOn;

            let result = undefined;

            if (state === "completed") {
                result = job.returnvalue?.result;
            }

            res.status(200).json({
                id: req.params.id,
                state,
                data: job.data,
                finishedOn: finishedOn ? new Date(finishedOn) : undefined,
                result: result ? JSON.parse(result) : undefined,
            });
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.log("Error: ", error);
                res.status(500).json({
                    message: "Internal server error: Unknown error",
                });
            }
        }
    },
);

export default scannerRouter;
