// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as dbQueries from '../helpers/db_queries';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { ScannerJob } from 'database';
import { ScannerJobResultSchema } from 'validation-helpers';
import { formatDateString } from './date_helpers';
//import fs from 'fs';

// ------------------------- Database operations -------------------------

// Get results for package with purl if exists
export const getPackageResults = async (purl: string) => {
    const queriedPackage = await dbQueries.findPackageByPurl(purl);

    let status = 'no-results';
    let id = null;
    let results = null;

    if (queriedPackage) {

        if (queriedPackage.scanStatus === 'pending') {
            const scannerJob = await dbQueries.findMostRecentScannerJobByPackageId(queriedPackage.id);

            if (scannerJob) {
                console.log('Package with purl ' + purl + ' has a pending scanner job with id ' + scannerJob.id);
                status = 'pending';
                id = scannerJob.id;
            } else {
                throw new Error('Error: unable to fetch scanner job id from database');
            }
        } else if (queriedPackage.scanStatus === 'scanned') {
            console.log('Found results for package with purl ' + purl);

            results = await getScanResults(queriedPackage.id);
            status = 'ready';
        }
    } else {
        console.log('No package found with purl ' + purl);
    }

    return {
        state: {
            status: status,
            id: id
        },
        results: results
    }
}

// Get scan results for package
export const getScanResults = async (packageId: number) => {
    const queriedScanResults = await dbQueries.getPackageScanResults(packageId);

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
                            end_line: endLine
                        },
                        score: score
                    })
                }
            }

            if (filetree.file.copyrightFindings.length > 0) {
                for (const copyrightFinding of filetree.file.copyrightFindings) {
                    copyrights.push({
                        statement: copyrightFinding.copyright,
                        location: {
                            path: filetree.path,
                            start_line: copyrightFinding.startLine,
                            end_line: copyrightFinding.endLine
                        }
                    })
                }
            }

            if (filetree.file.scanIssues.length > 0) {
                const timeoutErrorRegex = "(ERROR: for scanner: (?<scanner>\\w+):\n)?" +
                    "ERROR: Processing interrupted: timeout after (?<timeout>\\d+) seconds.";


                for (const issue of filetree.file.scanIssues) {
                    let message = issue.message;
                    const timeoutErrorMatch = issue.message.match(timeoutErrorRegex);

                    if (timeoutErrorMatch) {
                        let timeout = 120;

                        if (issue.scannerConfig.includes('timeout')) {
                            const scannerConfigList = issue.scannerConfig.split(' ');
                            // index of timeout flag
                            const timeoutIndex = scannerConfigList.indexOf('--timeout');
                            // timeout value
                            timeout = parseInt(scannerConfigList[timeoutIndex + 1]);
                        }

                        message = "ERROR: Timeout after " + timeout
                            + " seconds while scanning file '" + filetree.path + "'";
                    } else {
                        message += ' Path to file: ' + filetree.path + '.';
                    }

                    issues.push({
                        timestamp: issue.createdAt,
                        source: 'DOS',
                        message: message,
                        severity: issue.severity
                    })
                }
            }
        }
        return {
            licenses: licenses,
            copyrights: copyrights,
            issues: issues
        }
    } else {
        throw new Error('Error: unable to fetch scan results from database');
    }
}

// Delete data for packages with purl
export const deletePackageDataByPurl = async (purl: string): Promise<string> => {
    // Find all package ids with purl
    const packageIds: number[] | null = await dbQueries.findPackageIdsByPurl(purl);

    if (packageIds && packageIds.length > 0) {

        // Find all scannerJobs for packages
        const scannerJobs: ScannerJob[] | null = await dbQueries.findScannerJobsByPackageIds(packageIds);

        // Find all file ids related to packages
        const fileHashes = await dbQueries.findFileHashesByPackageIds(packageIds);

        if (fileHashes && fileHashes.length > 0) {
            console.log('fileHashes count: ' + fileHashes.length);
            // Delete all licenseFindings related to files
            const deletedLicenseFindings = await dbQueries.deleteLicenseFindingsByFileHashes(fileHashes);
            console.log('deletedLicenseFindings count: ' + deletedLicenseFindings.count);

            // Delete all copyrightFindings related to files
            const deletedCopyrightFindings = await dbQueries.deleteCopyrightFindingsByFileHashes(fileHashes);
            console.log('deletedCopyrightFindings count: ' + deletedCopyrightFindings.count);

            // Delete all scanIssues related to files
            const deletedScanIssues = await dbQueries.deleteScanIssuesByFileHashes(fileHashes);
            console.log('deletedScanIssues count: ' + deletedScanIssues.count);

            // Update file scanStatuses to 'notScanned'
            await dbQueries.updateManyFilesStatuses(fileHashes, 'notStarted');
        }

        if (scannerJobs && scannerJobs.length > 0) {
            // Update all scannerJobs states for packages
            await dbQueries.updateScannerJobsStatesByPackageIds(packageIds, 'resultsDeleted');
        }

        // Update all packages with purl
        await dbQueries.updatePackagesScanStatusesByPurl(purl, 'notStarted');

        return 'Results deleted for packages with purl ' + purl;

    } else {
        return 'No packages found with purl ' + purl;
    }

}

const getScannerConfigString = (options: { [key: string]: string | boolean | number; }) => {
    let configString = '';
    if (options['--copyright']) {
        configString += '--copyright ';
    }
    if (options['--license']) {
        configString += '--license ';
    }
    if (options['--package']) {
        configString += '--package ';
    }
    if (options['--info']) {
        configString += '--info ';
    }
    if (options['--strip-root']) {
        configString += '--strip-root ';
    }
    if (options['--timeout']) {
        configString += '--timeout ' + options['--timeout'] + ' ';
    }
    if (options['--processes']) {
        configString += '--processes ' + options['--processes'] + ' ';
    }
    if (options['--json']) {
        configString += '--json ';
    }
    if (options['--json-pp']) {
        configString += '--json-pp ';
    }

    return configString;
}

export const saveJobResults = async (jobId: string, result: ScannerJobResultSchema): Promise<void> => {
    try {
        // Save result locally for debugging
        //fs.writeFileSync('/tmp/' + jobId + '.json', JSON.stringify(result));
        
        if (result.headers.length > 1) {
            throw ('Error: More than one header in result. What to do now???');
        }
        console.log(jobId + ': Saving results to database');
        console.time(jobId + ': Saving results to database took');

        const scannerConfig = getScannerConfigString(result.headers[0].options);
        const scanner = result.headers[0].tool_name + '@' + result.headers[0].tool_version;
        //console.log('Editing ScannerJob');
        const scannerJob = await dbQueries.updateScannerJob(
            {
                id: jobId,
                data: {
                    state: 'savingResults',
                    scannerName: result.headers[0].tool_name,
                    scannerVersion: result.headers[0].tool_version,
                    scannerConfig: scannerConfig,
                    duration: result.headers[0].duration,
                    scanStartTS: new Date(formatDateString(result.headers[0].start_timestamp)),
                    scanEndTS: new Date(formatDateString(result.headers[0].end_timestamp)),
                    spdxLicenseListVersion: result.headers[0].extra_data.spdx_license_list_version
                }
            }
        )
        console.log(jobId + ': Changed state to "savingResults"');
        console.log(jobId + ': Adding LicenseFindings and CopyrightFindings for files');

        // Handle files list in batches of 1000
        const files = result.files;
        const batchSize = 1000;
        const batchCount = Math.ceil(files.length / batchSize);

        for (let i = 0; i < batchCount; i++) {
            const batch = files.slice(i * batchSize, (i + 1) * batchSize);

            const DB_CONCURRENCY = parseInt(process.env.DB_CONCURRENCY as string) || 10;
            const promises: Promise<void>[] = [];
            for (const file of batch) {
                const queryTask = (async () => {
                    if (file.type === 'file' && file.sha256) {
                        let dbFile = await dbQueries.findFileByHash(file.sha256);

                        if (!dbFile) {
                            dbFile = await dbQueries.createFile({
                                data: {
                                    sha256: file.sha256,
                                    scanStatus: 'notStarted'
                                }
                            });
                        }

                        await dbQueries.createFileTreeIfNotExists({
                            data: {
                                path: file.path,
                                fileSha256: file.sha256,
                                packageId: scannerJob.packageId
                            }
                        });

                        if (file.detected_license_expression_spdx) {
                            const finding = await dbQueries.createLicenseFinding({
                                data: {
                                    scanner: scanner,
                                    scannerConfig: scannerConfig,
                                    licenseExpressionSPDX: file.detected_license_expression_spdx,
                                    fileSha256: file.sha256
                                }
                            })
                            for (const license of file.license_detections) {

                                for (const match of license.matches) {
                                    await dbQueries.createLicenseFindingMatch({
                                        data: {
                                            startLine: match.start_line,
                                            endLine: match.end_line,
                                            score: match.score,
                                            licenseFindingId: finding.id
                                        }
                                    })
                                }
                            }
                        } else if (!file.detected_license_expression_spdx && file.license_detections.length > 0) {
                            throw ('Error: File ' + file.sha256 + ' ' + file.path + ' has license_detections but no detected_license_expression_spdx');
                        }

                        for (const copyright of file.copyrights) {
                            await dbQueries.createCopyrightFinding({
                                data: {
                                    startLine: copyright.start_line,
                                    endLine: copyright.end_line,
                                    copyright: copyright.copyright,
                                    scanner: scanner,
                                    scannerConfig: scannerConfig,
                                    fileSha256: file.sha256
                                }
                            })
                        }

                        for (const scanError of file.scan_errors) {
                            await dbQueries.createScanIssue({
                                data: {
                                    severity: 'ERROR',
                                    message: scanError,
                                    scanner: scanner,
                                    scannerConfig: scannerConfig,
                                    fileSha256: file.sha256
                                }
                            })
                        }

                        await dbQueries.updateFile({
                            id: dbFile.id,
                            data: {
                                scanStatus: 'scanned',
                            }
                        })
                    }
                })();

                promises.push(queryTask);

                if (promises.length >= DB_CONCURRENCY) {
                    await Promise.all(promises);
                    promises.length = 0;
                }
            }
            if (promises.length > 0) {
                await Promise.all(promises);
            }
        }
        console.timeEnd(jobId + ': Saving results to database took');

        result = null;

        const finalFileTreeCount = await dbQueries.countFileTreesByPackageId(scannerJob.packageId);

        console.log(jobId + ': Final filetree count for package: ' + finalFileTreeCount);
        
        console.log(jobId + ': Changing Package scanStatus to "scanned"');
        await dbQueries.updatePackage({
            id: scannerJob.packageId,
            data: { scanStatus: 'scanned' }
        })

        console.log(jobId + ': Changing ScannerJob state to "completed"');
        await dbQueries.updateScannerJob({
            id: scannerJob.id,
            data: { state: 'completed' }
        })
        // TODO:
        // Inform Scanner Agent that saving results was successful

    } catch (error) {
        console.log(error);
        // TODO:
        // Inform Scanner Agent that saving results failed
        try {
            console.log(jobId + ': Changing ScannerJob state to "failed"');
            const editedScannerJob = await dbQueries.updateScannerJob({
                id: jobId,
                data: { state: 'failed' }
            })
            console.log(jobId + ': Changing Package scanStatus to "failed"');
            await dbQueries.updatePackage({
                id: editedScannerJob.packageId,
                data: { scanStatus: 'failed' }
            })

        } catch (error) {
            console.log(jobId + ': Unable to update ScannerJob and Package statuses to "failed"');
        }
    }
}

export const findFilesToBeScanned = async (packageId: number, files: Map<string, string[]>): Promise<{ hash: string, path: string }[]> => {

    const filesToBeScanned: { hash: string, path: string }[] = [];
    const CONCURRENCY_LIMIT = parseInt(process.env.DB_CONCURRENCY as string) || 10;
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
                        data: {
                            sha256: hash,
                            scanStatus: 'notStarted'
                        }
                    });
                }
                // Create FileTrees for file
                for (const path of paths) {
                    await dbQueries.createFileTreeIfNotExists({
                        data: {
                            path: path,
                            fileSha256: hash,
                            packageId: packageId
                        }
                    });
                }
                // Push file to be scanned if scanStatus is 'notStarted' or 'failed', with the first path
                if (file.scanStatus === 'notStarted' || file.scanStatus === 'failed') {
                    filesToBeScanned.push({ hash: hash, path: paths[0] });
                }
            } else if (file) {
                await dbQueries.createFileTreeIfNotExists({
                    data: {
                        path: paths[0],
                        fileSha256: hash,
                        packageId: packageId
                    }
                });

                if (file.scanStatus === 'notStarted' || file.scanStatus === 'failed') {
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
}