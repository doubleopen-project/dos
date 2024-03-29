// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

//import fs from "fs";
import { Prisma } from "database";
import { deleteFile } from "s3-helpers";
import { ScannerJobResultType } from "validation-helpers";
import * as dbQueries from "../helpers/db_queries";
import { s3Client } from "./s3client";
import { reportResultState, sendJobToQueue } from "./sa_queries";

// ------------------------- Database operations -------------------------

// Get scan results for package
export const getScanResults = async (
    purl: string,
    options: { fetchConcluded?: boolean },
) => {
    const queriedScanResults = await dbQueries.getPackageScanResults(purl);

    if (queriedScanResults) {
        const licenses = [];
        const copyrights = [];
        const issues = [];

        for (const filetree of queriedScanResults) {
            if (
                options.fetchConcluded &&
                filetree.file.licenseConclusions.length > 0
            ) {
                for (const licenseConclusion of filetree.file
                    .licenseConclusions) {
                    if (
                        !licenseConclusion.local ||
                        (licenseConclusion.local &&
                            licenseConclusion.contextPurl === purl)
                    ) {
                        licenses.push({
                            license:
                                licenseConclusion.concludedLicenseExpressionSPDX,
                            location: {
                                path: filetree.path,
                                start_line: undefined,
                                end_line: undefined,
                            },
                            score: undefined,
                        });
                    }
                }
            } else if (filetree.file.licenseFindings.length > 0) {
                let startLine = 0;
                let endLine = 0;
                let scoreSum = 0;
                let scoreCounter = 0;
                for (const licenseFinding of filetree.file.licenseFindings) {
                    for (const match of licenseFinding.licenseFindingMatches) {
                        if (match.startLine < startLine || startLine === 0) {
                            startLine = match.startLine;
                        }
                        if (match.endLine > endLine) {
                            endLine = match.endLine;
                        }
                        scoreSum += match.score;
                        scoreCounter++;
                    }

                    const score = scoreSum / scoreCounter;

                    licenses.push({
                        license: licenseFinding.licenseExpressionSPDX,
                        location: {
                            path: filetree.path,
                            start_line: startLine,
                            end_line: endLine,
                        },
                        score: score,
                    });
                }
            }

            if (filetree.file.copyrightFindings.length > 0) {
                for (const copyrightFinding of filetree.file
                    .copyrightFindings) {
                    copyrights.push({
                        statement: copyrightFinding.copyright,
                        location: {
                            path: filetree.path,
                            start_line: copyrightFinding.startLine,
                            end_line: copyrightFinding.endLine,
                        },
                    });
                }
            }

            if (filetree.file.scanIssues.length > 0) {
                const timeoutErrorRegex =
                    "(ERROR: for scanner: (?<scanner>\\w+):\n)?" +
                    "ERROR: Processing interrupted: timeout after (?<timeout>\\d+) seconds.";

                for (const issue of filetree.file.scanIssues) {
                    let message = issue.message;
                    const timeoutErrorMatch =
                        issue.message.match(timeoutErrorRegex);

                    if (timeoutErrorMatch) {
                        let timeout = 120;

                        if (issue.scannerConfig.includes("timeout")) {
                            const scannerConfigList =
                                issue.scannerConfig.split(" ");
                            // index of timeout flag
                            const timeoutIndex =
                                scannerConfigList.indexOf("--timeout");
                            // timeout value
                            timeout = parseInt(
                                scannerConfigList[timeoutIndex + 1],
                            );
                        }

                        message =
                            "ERROR: Timeout after " +
                            timeout +
                            " seconds while scanning file '" +
                            filetree.path +
                            "'.";
                    } else {
                        message += " Path to file: " + filetree.path + ".";
                    }

                    issues.push({
                        timestamp: issue.createdAt,
                        source: "DOS",
                        message: message,
                        severity: issue.severity,
                    });
                }
            }
        }
        return {
            licenses: licenses,
            copyrights: copyrights,
            issues: issues,
        };
    } else {
        throw new Error("Error: unable to fetch scan results from database");
    }
};

// Delete data for packages with purl
export const deletePackageDataByPurl = async (
    purl: string,
): Promise<string> => {
    // Find all package ids with purl
    const packageId: number | null = await dbQueries.findPackageIdByPurl(purl);

    if (packageId) {
        // Find all file ids related to packages
        const allFileHashes =
            await dbQueries.findFileHashesByPackageId(packageId);

        if (allFileHashes.length === 0)
            throw new Error("No files found for Package with purl " + purl);

        // Exclude hashes that are related to other packages
        const fileHashes = await dbQueries.findFileHashesNotInOtherPackages(
            packageId,
            allFileHashes,
        );

        if (fileHashes && fileHashes.length > 0) {
            // Delete all licenseFindings related to files
            const deletedLicenseFindings =
                await dbQueries.deleteLicenseFindingsByFileHashes(fileHashes);
            console.log(
                "deletedLicenseFindings count: " + deletedLicenseFindings.count,
            );

            // Delete all copyrightFindings related to files
            const deletedCopyrightFindings =
                await dbQueries.deleteCopyrightFindingsByFileHashes(fileHashes);
            console.log(
                "deletedCopyrightFindings count: " +
                    deletedCopyrightFindings.count,
            );

            // Delete all scanIssues related to files
            const deletedScanIssues =
                await dbQueries.deleteScanIssuesByFileHashes(fileHashes);
            console.log("deletedScanIssues count: " + deletedScanIssues.count);

            // Delete all LicenseConclusions related to files
            const deletedLicenseConclusions =
                await dbQueries.deleteLicenseConclusionsByFileHashes(
                    fileHashes,
                );
            console.log(
                "deletedLicenseConclusions count: " +
                    deletedLicenseConclusions.count,
            );
        }
        // Delete all PathExclusions related to package
        const deletedPathExclusions =
            await dbQueries.deletePathExclusionsByPackageId(packageId);
        console.log(
            "deletedPathExclusions count: " + deletedPathExclusions.count,
        );
        // Delete all Scanner Jobs related to package
        const deletedScannerJobs =
            await dbQueries.deleteScannerJobsByPackageId(packageId);
        console.log("deletedScannerJobs count: " + deletedScannerJobs.count);

        // Delete all fileTrees related to package
        const deletedFileTrees =
            await dbQueries.deleteFileTreesByPackageId(packageId);
        console.log("deletedFileTrees count: " + deletedFileTrees.count);

        // Delete all files related to package that are not in other packages
        const deletedFiles =
            await dbQueries.deleteFilesByFileHashes(fileHashes);
        console.log("deletedFiles count: " + deletedFiles.count);

        // Delete Package
        await dbQueries.deletePackage(packageId);
        console.log("deleted package with purl " + purl);

        return "Results deleted for packages with purl " + purl;
    } else {
        return "No package found with purl " + purl;
    }
};

const getScannerConfigString = (options: {
    [key: string]: string | boolean | number;
}) => {
    let configString = "";
    if (options["--copyright"]) {
        configString += "--copyright ";
    }
    if (options["--license"]) {
        configString += "--license ";
    }
    if (options["--license-references"]) {
        configString += "--license-references ";
    }
    if (options["--package"]) {
        configString += "--package ";
    }
    if (options["--info"]) {
        configString += "--info ";
    }
    if (options["--strip-root"]) {
        configString += "--strip-root ";
    }
    if (options["--processes"]) {
        configString += "--processes " + options["--processes"] + " ";
    }
    if (options["--json"]) {
        configString += "--json ";
    }
    if (options["--json-pp"]) {
        configString += "--json-pp ";
    }

    return configString;
};

export const saveJobResults = async (
    jobId: string,
    result: ScannerJobResultType,
    jobStateMap?: Map<string, string>,
): Promise<void> => {
    try {
        // Save result locally for debugging
        // fs.writeFileSync("/tmp/" + jobId + ".json", JSON.stringify(result));

        if (result.headers.length > 1)
            throw new Error(
                "Error: More than one header in result. What to do now???",
            );

        console.log(jobId + ": Saving results to database");
        console.time(jobId + ": Saving results to database took");

        let scannerConfig = getScannerConfigString(result.headers[0].options);
        const scanner =
            result.headers[0].tool_name + "@" + result.headers[0].tool_version;
        //console.log('Editing ScannerJob');
        const scannerJob = await dbQueries.updateScannerJob(jobId, {
            state: "savingResults",
            scanDuration: result.headers[0].duration,
        });

        const packageId: number = scannerJob.packageId;

        const scannerJobChildren =
            await dbQueries.findScannerJobsByParentId(jobId);

        scannerConfig = "--timeout " + scannerJob.timeout + " " + scannerConfig;
        console.log(jobId + ': Changed state to "savingResults"');
        console.log(
            jobId + ": Adding LicenseFindings and CopyrightFindings for files",
        );

        // Make a map of scancode keys to SPDX license IDs to enhance
        // performance when searching for SPDX license ID for a key.
        const scKeyToSpdxIdMap = new Map<string, string>();

        for (const licenseReference of result.license_references) {
            scKeyToSpdxIdMap.set(
                licenseReference.key,
                licenseReference.spdx_license_key,
            );
        }

        // Handle files list in batches of 1000
        const files = result.files;
        const batchSize = 1000;
        const batchCount = Math.ceil(files.length / batchSize);
        const filesCount = result.headers[0].extra_data.files_count;
        let j = 0;

        const newJobFilesList: { hash: string; path: string }[] = [];

        for (let i = 0; i < batchCount; i++) {
            const batch = files.slice(i * batchSize, (i + 1) * batchSize);

            const DB_CONCURRENCY =
                parseInt(process.env.DB_CONCURRENCY as string) || 10;
            const promises: Promise<void>[] = [];
            for (const file of batch) {
                const queryTask = (async () => {
                    if (file.type === "file" && file.sha256) {
                        let dbFile = await dbQueries.findFileByHash(
                            file.sha256,
                        );

                        if (!dbFile) {
                            dbFile = await dbQueries.createFile({
                                sha256: file.sha256,
                                scanStatus: "notStarted",
                            });
                        } else {
                            // Delete old scan issues
                            await dbQueries.deleteScanIssuesByFileHashes([
                                file.sha256,
                            ]);
                        }

                        await dbQueries.createFileTreeIfNotExists({
                            path: file.path,
                            fileSha256: file.sha256,
                            packageId: packageId,
                        });

                        if (scannerJobChildren.length > 0) {
                            for (const childScannerJob of scannerJobChildren) {
                                await dbQueries.createFileTreeIfNotExists({
                                    path: file.path,
                                    fileSha256: file.sha256,
                                    packageId: childScannerJob.packageId,
                                });
                            }
                        }

                        if (file.detected_license_expression_spdx) {
                            const finding =
                                await dbQueries.createLicenseFinding({
                                    scanner: scanner,
                                    scannerConfig: scannerConfig,
                                    unprocessedLicenseExpressionSPDX:
                                        file.detected_license_expression_spdx,
                                    fileSha256: file.sha256,
                                });
                            for (const license of file.license_detections) {
                                for (const match of license.matches) {
                                    // Attempt to replace scancode specific keys with SPDX compliant ID's
                                    // If there is a problem, log a SystemIssue. This is a safety measure,
                                    // in case the string replacement logic below fails for some reason.
                                    let logSystemIssue = false;
                                    const issueDetails: {
                                        scancodeExpression: string;
                                        part: string;
                                        issue: string;
                                    }[] = [];

                                    const scancodeExpression =
                                        match.license_expression;
                                    const scancodeExprParts =
                                        scancodeExpression.split(" ");

                                    const mappedScancodeExprParts =
                                        scancodeExprParts.map((part) => {
                                            if (part === "AND") {
                                                return part;
                                            } else if (part === "OR") {
                                                return part;
                                            } else if (part === "WITH") {
                                                return part;
                                            } else if (
                                                part.startsWith("(") ||
                                                part.endsWith(")")
                                            ) {
                                                const partToReplace = part
                                                    .replace("(", "")
                                                    .replace(")", "");
                                                const foundItem =
                                                    scKeyToSpdxIdMap.get(
                                                        partToReplace,
                                                    );

                                                if (!foundItem) {
                                                    // Keep track of these issues, to make sure that there isn't a
                                                    // problem with the string replacement logic
                                                    logSystemIssue = true;
                                                    issueDetails.push({
                                                        scancodeExpression:
                                                            match.license_expression,
                                                        part: part,
                                                        issue:
                                                            "No match found for: " +
                                                            partToReplace,
                                                    });
                                                    // Fall back to building an ID based on the ScanCode-specific key
                                                    return part.replace(
                                                        partToReplace,
                                                        "LicenseRef-scancode-" +
                                                            partToReplace,
                                                    );
                                                }

                                                return part.replace(
                                                    partToReplace,
                                                    foundItem,
                                                );
                                            } else {
                                                const foundItem =
                                                    scKeyToSpdxIdMap.get(part);
                                                if (!foundItem) {
                                                    // Keep track of these issues, to make sure that there isn't a
                                                    // problem with the string replacement logic
                                                    logSystemIssue = true;
                                                    issueDetails.push({
                                                        scancodeExpression:
                                                            match.license_expression,
                                                        part: part,
                                                        issue:
                                                            "No match found for: " +
                                                            part,
                                                    });
                                                    // Fall back to building an ID based on the ScanCode-specific key
                                                    return (
                                                        "LicenseRef-scancode-" +
                                                        part
                                                    );
                                                }
                                                return foundItem;
                                            }
                                        });

                                    const spdxLicenseExpression =
                                        mappedScancodeExprParts.join(" ");

                                    const newMatch =
                                        await dbQueries.createLicenseFindingMatch(
                                            {
                                                startLine: match.start_line,
                                                endLine: match.end_line,
                                                score: match.score,
                                                licenseFindingId: finding.id,
                                                licenseExpression:
                                                    spdxLicenseExpression,
                                            },
                                        );

                                    if (logSystemIssue) {
                                        await dbQueries.createSystemIssue({
                                            message:
                                                "Issue with license expression conversion",
                                            severity: "LOW",
                                            errorCode:
                                                "LICENSE_EXPRESSION_CONVERSION_ISSUE",
                                            errorType: "ScannerRouterError",
                                            details:
                                                JSON.stringify(issueDetails),
                                            info: JSON.stringify({
                                                jobId: jobId,
                                                packageId: packageId,
                                                fileSha256: file.sha256,
                                                licenseFindingId: finding.id,
                                                licenseFindingMatchId:
                                                    newMatch.id,
                                            }),
                                        });
                                    }
                                }
                            }
                        } else if (
                            !file.detected_license_expression_spdx &&
                            file.license_detections.length > 0
                        ) {
                            throw new Error(
                                "Error: File " +
                                    file.sha256 +
                                    " " +
                                    file.path +
                                    " has license_detections but no detected_license_expression_spdx",
                            );
                        }

                        for (const copyright of file.copyrights) {
                            await dbQueries.createCopyrightFinding({
                                startLine: copyright.start_line,
                                endLine: copyright.end_line,
                                copyright: copyright.copyright,
                                scanner: scanner,
                                scannerConfig: scannerConfig,
                                fileSha256: file.sha256,
                            });
                        }

                        for (const scanError of file.scan_errors) {
                            await dbQueries.createScanIssue({
                                severity: "ERROR",
                                message: scanError,
                                scanner: scanner,
                                scannerConfig: scannerConfig,
                                fileSha256: file.sha256,
                            });

                            const timeoutErrorRegex =
                                "(ERROR: for scanner: (?<scanner>\\w+):\n)?" +
                                "ERROR: Processing interrupted: timeout after (?<timeout>\\d+) seconds.";

                            const timeoutErrorMatch =
                                scanError.match(timeoutErrorRegex);

                            if (timeoutErrorMatch) {
                                newJobFilesList.push({
                                    hash: file.sha256,
                                    path: file.path,
                                });
                            }
                        }

                        await dbQueries.updateFile({
                            id: dbFile.id,
                            data: {
                                scanStatus: "scanned",
                            },
                        });
                    }
                })();

                promises.push(queryTask);

                if (promises.length >= DB_CONCURRENCY) {
                    await Promise.all(promises);
                    promises.length = 0;
                }

                j++;
                if (jobStateMap)
                    jobStateMap.set(
                        jobId,
                        `Saving results (${j}/${filesCount})`,
                    );
            }
            if (promises.length > 0) {
                await Promise.all(promises);
            }
        }
        console.timeEnd(jobId + ": Saving results to database took");

        if (jobStateMap) jobStateMap.delete(jobId);

        if (newJobFilesList.length > 0) {
            try {
                const newTimeout = scannerJob.timeout
                    ? scannerJob.timeout * 10
                    : 2000;
                if (
                    newTimeout <=
                    (parseInt(process.env.TIMEOUT_MAX as string) || 3600)
                ) {
                    const newScannerJob = await dbQueries.createScannerJob({
                        state: "created",
                        packageId: scannerJob.packageId,
                    });

                    console.log(
                        newScannerJob.id +
                            ": Rescanning " +
                            newJobFilesList.length +
                            " files with timeout: " +
                            newTimeout,
                    );
                    console.log(
                        newScannerJob.id +
                            ": Sending a request to Scanner Agent to add new job to the work queue",
                    );

                    const addedToQueue = await sendJobToQueue(
                        newScannerJob.id,
                        newJobFilesList,
                        { timeout: newTimeout.toString() },
                    );

                    if (addedToQueue) {
                        console.log(
                            newScannerJob.id +
                                ': Updating ScannerJob state to "queued"',
                        );

                        await dbQueries.updateScannerJob(newScannerJob.id, {
                            state: "queued",
                            timeout: newTimeout,
                            fileCount: newJobFilesList.length,
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        const finalFileTreeCount =
            await dbQueries.countFileTreesByPackageId(packageId);

        console.log(
            jobId + ": Final filetree count for package: " + finalFileTreeCount,
        );

        console.log(jobId + ': Changing Package scanStatus to "scanned"');
        await dbQueries.updatePackage({
            id: packageId,
            data: { scanStatus: "scanned" },
        });

        console.log(jobId + ': Changing ScannerJob state to "completed"');
        await dbQueries.updateScannerJob(scannerJob.id, {
            state: "completed",
        });

        if (scannerJobChildren.length > 0) {
            await dbQueries.updateManyScannerJobStates(
                scannerJobChildren.map((job) => job.id),
                "completed",
            );
            await dbQueries.updateManyPackagesScanStatuses(
                scannerJobChildren.map((job) => job.packageId),
                "scanned",
            );
        }

        const reportSuccess = await reportResultState(jobId, "saved");
        if (!reportSuccess) {
            console.log(
                jobId + ": Unable to report result state to Scanner Agent",
            );
        }

        // Delete zip file from object storage
        if (scannerJob.objectStorageKey)
            await deleteFile(
                s3Client,
                process.env.SPACES_BUCKET || "doubleopen",
                scannerJob.objectStorageKey,
            );
    } catch (error) {
        console.log(error);
        try {
            console.log(jobId + ': Changing ScannerJob state to "failed"');
            const editedScannerJob = await dbQueries.updateScannerJob(jobId, {
                state: "failed",
            });
            console.log(jobId + ': Changing Package scanStatus to "failed"');
            await dbQueries.updatePackage({
                id: editedScannerJob.packageId,
                data: { scanStatus: "failed" },
            });

            const childScannerJobs =
                await dbQueries.findScannerJobsByParentId(jobId);

            if (childScannerJobs.length > 0) {
                console.log(
                    jobId +
                        ': Changing ScannerJob states and Package scanStatuses to "failed" for child jobs',
                );
                await dbQueries.updateManyScannerJobStates(
                    childScannerJobs.map((job) => job.id),
                    "failed",
                );

                await dbQueries.updateManyPackagesScanStatuses(
                    childScannerJobs.map((job) => job.packageId),
                    "failed",
                );
            }

            await dbQueries.createSystemIssue({
                message: "Saving results failed",
                severity: "MODERATE",
                errorCode: "SAVING_RESULTS_FAILED",
                errorType: "ScannerRouterError",
                details:
                    error instanceof Error
                        ? error.message
                        : error instanceof Prisma.PrismaClientKnownRequestError
                          ? error.message
                          : error instanceof
                                  Prisma.PrismaClientRustPanicError ||
                              error instanceof
                                  Prisma.PrismaClientInitializationError ||
                              error instanceof
                                  Prisma.PrismaClientValidationError ||
                              error instanceof
                                  Prisma.PrismaClientUnknownRequestError
                            ? error.stack
                            : null,
                info: JSON.stringify({
                    jobId: jobId,
                    packageId: editedScannerJob.packageId,
                }),
            });
        } catch (error) {
            console.log(
                jobId +
                    ': Unable to update ScannerJob and Package statuses to "failed"',
            );
        }

        try {
            const reportSuccess = await reportResultState(jobId, "failed");
            if (!reportSuccess) {
                console.log(
                    jobId + ": Unable to report result state to Scanner Agent",
                );
            }
        } catch (error) {
            console.log(
                jobId + ": Unable to report result state to Scanner Agent",
            );
        }
    }
};

export const findFilesToBeScanned = async (
    packageIds: number[],
    files: Map<string, string[]>,
): Promise<{ hash: string; path: string }[]> => {
    const filesToBeScanned: { hash: string; path: string }[] = [];
    const CONCURRENCY_LIMIT =
        parseInt(process.env.DB_CONCURRENCY as string) || 10;
    const promises: Promise<void>[] = [];

    for (const [hash, paths] of files) {
        const queryTask = (async () => {
            // Check if File already exists
            let file = await dbQueries.findFileByHash(hash);

            if (paths.length > 1) {
                // Multiple paths for the same hash
                if (!file) {
                    // Create new File
                    file = await dbQueries.createFile({
                        sha256: hash,
                        scanStatus: "notStarted",
                    });
                }
                // Create FileTrees for file
                for (const path of paths) {
                    for (const packageId of packageIds) {
                        await dbQueries.createFileTreeIfNotExists({
                            path: path,
                            fileSha256: hash,
                            packageId: packageId,
                        });
                    }
                }
                // Push file to be scanned if scanStatus is 'notStarted' or 'failed', with the first path
                if (
                    file.scanStatus === "notStarted" ||
                    file.scanStatus === "failed"
                ) {
                    filesToBeScanned.push({ hash: hash, path: paths[0] });
                }
            } else if (file) {
                for (const packageId of packageIds) {
                    await dbQueries.createFileTreeIfNotExists({
                        path: paths[0],
                        fileSha256: hash,
                        packageId: packageId,
                    });
                }
                if (
                    file.scanStatus === "notStarted" ||
                    file.scanStatus === "failed"
                ) {
                    filesToBeScanned.push({ hash: hash, path: paths[0] });
                }
            } else {
                filesToBeScanned.push({ hash: hash, path: paths[0] });
            }
        })();

        promises.push(queryTask);

        if (promises.length >= CONCURRENCY_LIMIT) {
            await Promise.all(promises);
            promises.length = 0;
        }
    }
    if (promises.length > 0) {
        await Promise.all(promises);
    }
    return filesToBeScanned;
};

type PackageConfiguration = {
    licenseConclusions: {
        path: string;
        detectedLicenseExpressionSPDX: string | null;
        concludedLicenseExpressionSPDX: string;
        comment: string | null;
    }[];
    pathExclusions: {
        pattern: string;
        reason: string;
        comment: string | null;
    }[];
};

export const getPackageConfiguration = async (
    purl: string,
): Promise<PackageConfiguration> => {
    const packageWithPathExclusions =
        await dbQueries.findPackageWithPathExclusionsByPurl(purl);

    if (!packageWithPathExclusions) throw new Error("Package not found");

    const licenseConclusions =
        await dbQueries.findLicenseConclusionsByPackagePurl(purl);
    return {
        licenseConclusions: licenseConclusions,
        pathExclusions: packageWithPathExclusions.pathExclusions,
    };
};

export const copyDataToNewPackages = async (
    packageId: number,
    newPackageIds: number[],
): Promise<void> => {
    const fileTrees = await dbQueries.findFileTreesByPackageId(packageId);

    const CONCURRENCY_LIMIT =
        parseInt(process.env.DB_CONCURRENCY as string) || 10;

    const promises: Promise<void>[] = [];

    for (const fileTree of fileTrees) {
        const queryTask = (async () => {
            for (const newPackageId of newPackageIds) {
                await dbQueries.createFileTreeIfNotExists({
                    path: fileTree.path,
                    fileSha256: fileTree.fileSha256,
                    packageId: newPackageId,
                });
            }
        })();

        promises.push(queryTask);

        if (promises.length >= CONCURRENCY_LIMIT) {
            await Promise.all(promises);
            promises.length = 0;
        }
    }
};
