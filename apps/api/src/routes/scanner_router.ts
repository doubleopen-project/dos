// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { Package, Prisma, ScannerJob } from "database";
import { deleteFile, getPresignedPutUrl, objectExistsCheck } from "s3-helpers";
import { scannerAPI } from "validation-helpers";
import {
    authenticateORTToken,
    authenticateSAToken,
} from "../helpers/auth_helpers";
import { CustomError } from "../helpers/custom_error";
import * as dbOperations from "../helpers/db_operations";
import * as dbQueries from "../helpers/db_queries";
import { getErrorCodeAndMessage } from "../helpers/error_handling";
import { processPackageAndSendToScanner } from "../helpers/new_job_process";
import { parsePurl } from "../helpers/purl_helpers";
import { s3Client } from "../helpers/s3client";
import { stateMap } from "../helpers/state_helpers";

const scannerRouter = zodiosRouter(scannerAPI);

const jobStateMap: Map<string, string> = new Map();

// Get scan results for package with purl
scannerRouter.post("/scan-results", authenticateORTToken, async (req, res) => {
    try {
        console.log(
            "Searching for results for package with purl(s): " +
                req.body.purls.join(", "),
        );

        const options = req.body.options || {};

        const packages = await dbQueries.findPackagesByPurls(req.body.purls);

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
            const notInDbPurls = [...req.body.purls];

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
            }

            if (scannedPackages.length > 0) {
                console.log("Found scan results");
                // The results will be the same for all packages, so we can just get the results for the first one
                const results = await dbOperations.getScanResults(
                    scannedPackages[0].id,
                    options,
                );

                if (scannedPackages.length < req.body.purls.length) {
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
                res.status(200).json({
                    purls: purls,
                    state: {
                        status: "ready",
                        jobId: null,
                    },
                    results: results,
                });
            } else if (pendingJobs.length > 0) {
                console.log("Found pending ScannerJob");

                if (pendingJobs.length !== req.body.purls.length) {
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
                            jobId: pendingJobs[0].parentId || pendingJobs[0].id,
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
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get package configuration for package with purl
scannerRouter.post(
    "/package-configuration",
    authenticateORTToken,
    async (req, res) => {
        try {
            // TODO: Return results based on user access rights and choices

            console.log(
                "Searching for configuration for package with purl: " +
                    req.body.purl,
            );

            const packageConfiguration =
                await dbOperations.getPackageConfiguration(req.body.purl);

            res.status(200).json(packageConfiguration);
        } catch (error) {
            console.log("Error: ", error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message: "Unable to find results for the requested package",
                });
            } else if (error instanceof Error)
                res.status(404).json({ message: error.message });
            else res.status(500).json({ message: "Internal server error" });
        }
    },
);

// Request presigned upload url for a file
scannerRouter.post("/upload-url", authenticateORTToken, async (req, res) => {
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
                "Error: Object with key " + req.body.key + " already exists.",
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
                message: "Unable to get a presigned URL for the requested key",
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add new ScannerJob
scannerRouter.post("/job", authenticateORTToken, async (req, res) => {
    try {
        const packagesArray: {
            package: Package;
            existingJob: ScannerJob | null;
        }[] = [];

        // Finding existing Packages and ScannerJobs for the purls, creating new Packages if needed
        for (const purl of req.body.purls) {
            let packageObj = await dbQueries.findPackageByPurl(purl);
            let existingJob = null;
            if (!packageObj) {
                const parsedPurl = parsePurl(purl);

                const jobPackage = await dbQueries.createPackage({
                    type: parsedPurl.type,
                    namespace: parsedPurl.namespace,
                    name: parsedPurl.name,
                    version: parsedPurl.version,
                    qualifiers: parsedPurl.qualifiers,
                    subpath: parsedPurl.subpath,
                    scanStatus: "notScanned",
                });

                if (jobPackage.purl !== purl) {
                    dbQueries.deletePackage(jobPackage.id);
                    await dbQueries.createSystemIssue({
                        message:
                            "Generated purl does not match the requested purl",
                        severity: "MODERATE",
                        errorCode: "PURL_MISMATCH",
                        errorType: "ScannerRouterError",
                        info: JSON.stringify({
                            requestedPurl: purl,
                            generatedPurl: jobPackage.purl,
                            zipFileKey: req.body.zipFileKey,
                        }),
                    });
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
                packagesArray[0].existingJob.state !== "resultsDeleted" &&
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
                    req.body.purls,
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
                    pkg.existingJob.state !== "resultsDeleted" &&
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
                req.body.purls,
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
            res.status(err.statusCode).json({ message: err.message });
        }
    }
});

// Get ScannerJob state
scannerRouter.get("/job-state/:id", authenticateORTToken, async (req, res) => {
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
            let message = stateMap.get(scannerJob.state) || scannerJob.state;

            if (
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
});

// ------------------------------------- SA ROUTES -------------------------------------

// Update ScannerJob state
scannerRouter.put("/job-state/:id", authenticateSAToken, async (req, res) => {
    try {
        if (req.body.state === "completed") {
            return res.status(400).json({
                message:
                    "Bad Request: Cannot change state to completed. Use /job-results endpoint instead",
            });
        } else {
            if (req.body.state === "active") {
                // Wait 5 ms
                // Reason: Scanner Agent might send requests for states 'waiting' and 'active' at the same time, and may be saved in the wrong order
                await new Promise((resolve) => setTimeout(resolve, 5));
            }

            const updatedScannerJob = await dbQueries.updateScannerJob(
                req.params.id as string,
                {
                    state: req.body.state,
                },
            );

            if (updatedScannerJob && req.body.state === "failed") {
                await dbQueries.updatePackage({
                    id: updatedScannerJob.packageId,
                    data: { scanStatus: "failed" },
                });
            }

            const scannerJobChildren =
                await dbQueries.findScannerJobsByParentId(req.params.id);

            if (scannerJobChildren.length > 0) {
                await dbQueries.updateManyScannerJobStates(
                    scannerJobChildren.map((child) => child.id),
                    req.body.state,
                    updatedScannerJob.failureState || undefined,
                );

                if (req.body.state === "failed") {
                    await dbQueries.updateManyPackagesScanStatuses(
                        scannerJobChildren.map((child) => child.packageId),
                        "failed",
                    );
                }
            }

            for (const child of scannerJobChildren) {
                await dbQueries.updateScannerJob(child.id, {
                    state: req.body.state,
                });

                if (req.body.state === "failed" && child.packageId) {
                    await dbQueries.updatePackage({
                        id: child.packageId,
                        data: { scanStatus: "failed" },
                    });
                }
            }

            console.log(
                req.params.id + ': Changed state to "' + req.body.state + '"',
            );

            res.status(200).json({
                message:
                    "Received job with id " +
                    req.params.id +
                    ". Changed state to " +
                    req.body.state,
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Save job results to database
scannerRouter.post("/job-results", authenticateSAToken, async (req, res) => {
    try {
        dbOperations.saveJobResults(req.body.id, req.body.result, jobStateMap);
        res.status(200).json({
            message:
                "Received and saving results for job with with id " +
                req.body.id,
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default scannerRouter;
