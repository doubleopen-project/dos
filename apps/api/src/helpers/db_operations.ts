// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

//import fs from "fs";
import braces from "braces";
import { FileTree, Prisma } from "database";
import globToRegExp from "glob-to-regexp";
import log from "loglevel";
import { minimatch } from "minimatch";
import { deleteFile } from "s3-helpers";
import { ScannerJobResultType } from "validation-helpers";
import * as dbQueries from "../helpers/db_queries";
import QueueService from "../services/queue";
import { getErrorCodeAndMessage } from "./error_handling";
import { isTimeoutError } from "./is_timeout_error";
import { s3Client } from "./s3client";

const logLevel: log.LogLevelDesc =
    (process.env.LOG_LEVEL as log.LogLevelDesc) || "info"; // trace/debug/info/warn/error/silent

log.setLevel(logLevel);

// ------------------------- Database operations -------------------------

// Get scan results for package
export const getScanResults = async (purl: string) => {
    const queriedScanResults = await dbQueries.getPackageScanResults(purl);

    if (queriedScanResults) {
        const licenses = [];
        const copyrights = [];
        const issues = [];

        for (const filetree of queriedScanResults) {
            if (filetree.file.licenseFindings.length > 0) {
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
                for (const issue of filetree.file.scanIssues) {
                    let message = issue.message;

                    if (issue.timeoutIssue) {
                        message =
                            "ERROR: Timeout after " +
                            issue.timeout +
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

        // Update child scanner jobs (if any)
        await dbQueries.updateManyScannerJobChildren(jobId, {
            state: "savingResults",
        });

        const packageId: number = scannerJob.packageId;

        const scannerJobChildren =
            await dbQueries.findScannerJobsByParentId(jobId);

        scannerConfig = "--timeout " + scannerJob.timeout + " " + scannerConfig;
        console.log(jobId + ': Changed state to "savingResults"');
        console.log(
            jobId + ": Adding LicenseFindings and CopyrightFindings for files",
        );

        const workQueue = QueueService.getInstance();
        const workQueueJob = await workQueue.getJob(jobId);

        if (!workQueueJob) {
            await dbQueries.createSystemIssue({
                message: "WorkQueue job not found",
                severity: "MODERATE",
                errorCode: "WORKQUEUE_JOB_NOT_FOUND",
                errorType: "ScannerRouterError",
                info: JSON.stringify({ jobId: jobId }),
            });
        }

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

        for (let i = 0; i < batchCount; i++) {
            const batch = files.slice(i * batchSize, (i + 1) * batchSize);

            const DB_CONCURRENCY =
                parseInt(process.env.DB_CONCURRENCY as string) || 10;
            const promises: Promise<void>[] = [];
            for (const file of batch) {
                const queryTask = (async () => {
                    if (file.type === "file" && file.sha256) {
                        const dbFile = await dbQueries.createFileIfNotExists({
                            sha256: file.sha256,
                            scanStatus: "notStarted",
                        });

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

                        if (dbFile.scanStatus === "scanned") {
                            /*
                             * The case where the file has previously been scanned, but was
                             * sent for rescanning, for instance, due to a change in the
                             * timeout value in the case of a timeout scan issue.
                             *
                             * Remove the earlier findings and issues related to the file
                             * before saving the new ones.
                             */
                            await dbQueries.deleteLicenseFindingsByFileHashes([
                                dbFile.sha256,
                            ]);

                            await dbQueries.deleteCopyrightFindingsByFileHashes(
                                [dbFile.sha256],
                            );

                            await dbQueries.deleteScanIssuesByFileHashes([
                                dbFile.sha256,
                            ]);
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
                                    // If there is no SPDX expression for the match's license expression,
                                    // attempt to replace scancode specific keys with SPDX compliant ID's
                                    // If there is a problem, log a SystemIssue. This is a safety measure,
                                    // in case the string replacement logic below fails for some reason.
                                    let logSystemIssue = false;
                                    const issueDetails: {
                                        scancodeExpression: string;
                                        part: string;
                                        issue: string;
                                    }[] = [];

                                    let spdxLicenseExpression =
                                        match.spdx_license_expression;

                                    // If there is no SPDX expression, attempt to build one
                                    if (!spdxLicenseExpression) {
                                        const scancodeExpression =
                                            match.license_expression;
                                        const scancodeExprParts =
                                            scancodeExpression.split(" ");

                                        const mappedScancodeExprParts =
                                            scancodeExprParts.map((part) => {
                                                if (
                                                    part === "AND" ||
                                                    part === "OR" ||
                                                    part === "WITH"
                                                )
                                                    return part;
                                                else {
                                                    // Remove leading and trailing parentheses if there are any
                                                    const partToReplace = part
                                                        .replaceAll("(", "")
                                                        .replaceAll(")", "");
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
                                                }
                                            });

                                        spdxLicenseExpression =
                                            mappedScancodeExprParts.join(" ");
                                    }

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
                            const timeoutError = isTimeoutError(scanError);
                            await dbQueries.createScanIssue({
                                severity: "ERROR",
                                message: scanError,
                                scanner: scanner,
                                scannerConfig: scannerConfig,
                                fileSha256: file.sha256,
                                timeoutIssue: timeoutError,
                                timeout: timeoutError
                                    ? (scannerJob.timeout ?? undefined)
                                    : undefined,
                            });
                        }

                        await dbQueries.updateFile({
                            id: dbFile.id,
                            data: {
                                scanStatus: "scanned",
                                scanner: scanner,
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

        if (workQueueJob) {
            console.log(`${jobId}: Removing job from work queue`);
            await workQueueJob.remove();
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
            console.log(
                jobId +
                    ': Changing ScannerJob and children (if any) states and related Packages scanStatuses to "failed"',
            );
            const errorObject = await getErrorCodeAndMessage(error);
            await dbQueries.updateScannerJobAndPackagesStateToFailedRecursive(
                jobId,
                errorObject.message !== "Internal server error"
                    ? errorObject.message
                    : "Internal server error. Saving results failed due to unknown reason.",
            );
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
                }),
            });
            // Disable eslint rule for unused variable as the error needs to be caught, but not used.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log(
                jobId +
                    ': Unable to update ScannerJob and Package statuses to "failed"',
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
    packageId: number,
    apiTokenId: string,
): Promise<PackageConfiguration> => {
    const atcgs =
        await dbQueries.findClearanceGroupsForApiTokenWithPackageClearances(
            packageId,
            apiTokenId,
        );

    const peMap = new Map<
        string,
        PackageConfiguration["pathExclusions"][number]
    >();

    const lcMap = new Map<
        string,
        PackageConfiguration["licenseConclusions"][number]
    >();

    for (const atcg of atcgs) {
        for (const pe of atcg.clearanceGroup.pathExclusions) {
            if (!peMap.has(pe.pathExclusion.pattern)) {
                peMap.set(pe.pathExclusion.pattern, pe.pathExclusion);
            }
        }

        for (const lc of atcg.clearanceGroup.licenseConclusions) {
            for (const ft of lc.licenseConclusion.file.filetrees) {
                const path = ft.path;

                if (!lcMap.has(path)) {
                    lcMap.set(path, {
                        path: path,
                        detectedLicenseExpressionSPDX:
                            lc.licenseConclusion.detectedLicenseExpressionSPDX,
                        concludedLicenseExpressionSPDX:
                            lc.licenseConclusion.concludedLicenseExpressionSPDX,
                        comment: lc.licenseConclusion.comment,
                    });
                }
            }
        }
    }

    return {
        licenseConclusions: [...lcMap.values()],
        pathExclusions: [...peMap.values()],
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

export const findFileTreesMatchingPattern = async (
    packageId: number,
    pattern: string,
): Promise<FileTree[]> => {
    /*
     * With the current method of creating a regex from glob patterns, the query won't find any
     * rows if the pattern contains one of the characters in the unsupportedCharacters array.
     * It may be possible to transform these globs to a regex that can be used in the query,
     * but as these kinds of globs haven't been used so far, it's not a priority right now. For
     * now, the method is set to "loop" if the pattern contains any of the unsupported characters.
     * This means all the filetrees in the package will be fetched and checked with minimatch.
     */
    const unsupportedCharacters = ["[", "]", "?", "!", "|", "(", ")", "+", "@"];
    let method = "regex";
    if (unsupportedCharacters.some((c) => pattern.includes(c))) {
        method = "loop";
    }

    log.debug("Using method: " + method);

    const filetrees: FileTree[] = [];

    /*
     * If the method is set to "regex", first, the braces function is used to expand the pattern.
     * For example a pattern like "{path1/**,path2/{file1,file2}}" will be expanded to its individual
     * paths/patterns like ["path1/**", "path2/file1", "path2/file2"]. Then, for each part, an exact
     * match is searched for in the database. If no exact match is found, a regex is created from the
     * pattern and used to search for filetrees in the database.
     */
    if (method === "regex") {
        const expandedPaths = braces(pattern, {
            expand: true,
        });
        log.debug(expandedPaths);
        for (const path of expandedPaths) {
            const exactMatch = await dbQueries.findFileTreeByPkgIdAndPath(
                packageId,
                path,
            );

            if (exactMatch) {
                filetrees.push(exactMatch);
            } else {
                const regex = globToRegExp(path, { globstar: true });
                log.debug("Glob: " + path);
                log.debug("Regex: " + regex.source);
                const regexMatches =
                    await dbQueries.findFileTreesByPackageIdAndPathRegex(
                        packageId,
                        regex.source,
                    );

                log.debug("Matches: " + regexMatches.length);

                if (regexMatches.length > 0) {
                    for (const ft of regexMatches) {
                        filetrees.push(ft);
                    }
                } else {
                    log.error(
                        "No match for pattern: " +
                            path +
                            " with regex: " +
                            regex.source,
                    );
                    /*
                     * This case shouldn't happen, but as a safety measure, if it does, the "loop"
                     * method will be used instead.
                     */
                    filetrees.length = 0;
                    log.debug("Switching to method: loop");
                    method = "loop";
                    break;
                }
            }
        }
    }

    if (method === "loop") {
        const allFileTrees =
            await dbQueries.findFileTreesByPackageId(packageId);
        for (const fileTree of allFileTrees) {
            if (minimatch(fileTree.path, pattern, { dot: true })) {
                filetrees.push(fileTree);
            }
        }
    }

    return filetrees;
};

export const fileTreeMatchingPatternExists = async (
    packageId: number,
    pattern: string,
): Promise<boolean> => {
    // Try first if one of the expanded paths is an exact match or a regex match
    const expandedPaths = braces(pattern, {
        expand: true,
    });
    log.debug(expandedPaths);
    for (const path of expandedPaths) {
        const exactMatch = await dbQueries.findFileTreeByPkgIdAndPath(
            packageId,
            path,
        );

        if (exactMatch) return true;
        else {
            const regex = globToRegExp(path, { globstar: true });
            log.debug("Glob: " + path);
            log.debug("Regex: " + regex.source);
            const regexMatchFound =
                await dbQueries.findIfFtByPkgIdAndPathRegexExists(
                    packageId,
                    regex.source,
                );

            log.debug("Matched: " + regexMatchFound);

            if (regexMatchFound) return true;
        }
    }

    /*
     * If no match is found yet, loop through all filetrees in the package
     * Only do to this as a last resort, because for bigger packages,
     * fetching all filetrees is a slow operation
     */
    const allFileTrees = await dbQueries.findFileTreesByPackageId(packageId);
    for (const fileTree of allFileTrees) {
        if (minimatch(fileTree.path, pattern, { dot: true })) {
            return true;
        }
    }

    return false;
};
