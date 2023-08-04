// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as dbQueries from '../helpers/db_queries';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { ScannerJob } from 'database';
import { ScannerJobResultSchema } from 'validation-helpers';
import { formatDateString } from './date_helpers';

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
                status = 'pending';
                id = scannerJob.id;
            } else {
                throw new Error('Error: unable to fetch scanner job id from database');
            }
        } else if (queriedPackage.scanStatus === 'scanned') {
            results = await getScanResults(queriedPackage.id);
            status = 'ready';
        }
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

        for (const record of queriedScanResults) {
            if (record.file.licenseFindings.length > 0) {
                let startLine = 0;
                let endLine = 0;
                let scoreSum = 0;
                let scoreCounter = 0;
                for (const licenseFinding of record.file.licenseFindings) {
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
                            path: record.path,
                            start_line: startLine,
                            end_line: endLine
                        },
                        score: score
                    })
                }
            }

            if (record.file.copyrightFindings.length > 0) {
                for (const copyrightFinding of record.file.copyrightFindings) {
                    copyrights.push({
                        statement: copyrightFinding.copyright,
                        location: {
                            path: record.path,
                            start_line: copyrightFinding.startLine,
                            end_line: copyrightFinding.endLine
                        }
                    })
                }
            }
        }

        return {
            licenses: licenses,
            copyrights: copyrights
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

export const getJobState = async (jobId: string): Promise<string | null> => {
    const scannerJob = await dbQueries.findScannerJobById(jobId);
    if (!scannerJob) return null;

    return scannerJob.state;
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
        const scannerConfig = getScannerConfigString(result.headers[0].options);
        const scanner = result.headers[0].tool_name + '@' + result.headers[0].tool_version;
        console.log('Editing ScannerJob');
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
        console.log('Adding LicenseFindings and CopyrightFindings for files');

        for (const file of result.files) {

            if (file.type === 'file') {
                if (file.sha256) {
                    let dbFile = await dbQueries.findFileByHash(file.sha256);

                    if (!dbFile) {
                        // Create file
                        dbFile = await dbQueries.createFile({
                            data: {
                                sha256: file.sha256,
                                scanStatus: 'scanned'
                            }
                        })

                        // Create FileTree
                        await dbQueries.createFileTree({
                            data: {
                                path: file.path,
                                sha256: file.sha256,
                                packageId: scannerJob.packageId
                            }
                        })

                    } else {
                        await dbQueries.updateFile({
                            id: dbFile.id,
                            data: {
                                scanStatus: 'scanned',
                            }
                        })
                    }

                    if (file.detected_license_expression_spdx) {
                        const finding = await dbQueries.createLicenseFinding({
                            data: {
                                scanner: scanner,
                                scannerConfig: scannerConfig,
                                licenseExpressionSPDX: file.detected_license_expression_spdx,
                                sha256: file.sha256
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
                        console.log('File ' + file.sha256 + ' ' + file.path + ' has license_detections but no detected_license_expression_spdx');
                    }
                }

            }

            for (const copyright of file.copyrights) {
                await dbQueries.createCopyrightFinding({
                    data: {
                        startLine: copyright.start_line,
                        endLine: copyright.end_line,
                        copyright: copyright.copyright,
                        scanner: scanner,
                        scannerConfig: scannerConfig,
                        sha256: file.sha256
                    }
                })
            }
        }


        console.log('Changing Package scanStatus to "scanned"');
        await dbQueries.updatePackage({
            id: scannerJob.packageId,
            data: { scanStatus: 'scanned' }
        })

        console.log('Changing ScannerJob state to "completed"');
        await dbQueries.updateScannerJob({
            id: scannerJob.id,
            data: { state: 'completed' }
        })
    } catch (error) {
        console.log(error);
    }
}

export const findFilesToBeScanned = async (packageId: number, files: { hash: string, path: string }[]): Promise<{ hash: string, path: string }[]> => {
    const filesToBeScanned: { hash: string, path: string }[] = [];

    for (const file of files) {
        // Check if File already exists
        const existingFile = await dbQueries.findFileByHash(file.hash);

        if (existingFile) {
            const existingFileTree = await dbQueries.findFileTreeByHashAndPackageId(file.hash, packageId);

            if (!existingFileTree) {
                // Create new FileTree
                await dbQueries.createFileTree({
                    data: {
                        path: file.path,
                        sha256: file.hash,
                        packageId: packageId,
                    }
                });
            }

            if (existingFile.scanStatus === 'notStarted' || existingFile.scanStatus === 'failed') {
                filesToBeScanned.push(file);
            }

        } else {
            filesToBeScanned.push(file);
        }
    }

    return filesToBeScanned;
}

export const getFilesToBeScanned = async (packageId: number): Promise<{ hash: string, path: string }[]> => {
    const filesToBeScanned: { hash: string, path: string }[] = [];
    const fileTrees = await dbQueries.findFileTreesByPackageId(packageId);

    if (!fileTrees) {
        throw new Error('Error: unable to fetch file trees from database');
    }

    console.log('getFilesToBeScanned File trees count: ' + fileTrees.length);

    for (const fileTree of fileTrees) {

        const file = await dbQueries.findFileByHash(fileTree.sha256);

        if (!file) {
            console.log('File not found from database');
        } else {
            if (file.scanStatus === 'notStarted') {
                filesToBeScanned.push({ hash: file.sha256, path: fileTree.path });
            }
        }
    }

    return filesToBeScanned;
}