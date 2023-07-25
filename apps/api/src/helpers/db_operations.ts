// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as dbQueries from '../helpers/db_queries';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { Package, ScannerJob } from 'database';
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
        } else {
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
                for (const licenseFinding of record.file.licenseFindings) {
                    licenses.push({
                        license: licenseFinding.licenseExpression,
                        location: {
                            path: record.path,
                            start_line: licenseFinding.startLine,
                            end_line: licenseFinding.endLine
                        },
                        score: licenseFinding.score
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
    // Find all packages with purl
    const packages: Package[] | null = await dbQueries.findPackagesByPurl(purl);

    if (packages && packages.length > 0) {

        // Find all scannerJobs for packages
        const scannerJobs: ScannerJob[] | null = await dbQueries.findScannerJobsByPackageIds(packages);

        if (scannerJobs && scannerJobs.length > 0) {
            // Delete all license findings for scannerJobs
            await dbQueries.deleteLicenseFindingsByScannerJobIds(scannerJobs);

            // Delete all copyright findings for scannerJobs
            await dbQueries.deleteCopyrightFindingsByScannerJobIds(scannerJobs);
        }

        // Delete all FileTrees for packages
        await dbQueries.deleteFileTreesByPackageIds(packages);

        // Delete all scannerJobs for packages
        await dbQueries.deleteScannerJobsByPackageIds(packages);

        // Delete all packages with purl
        await dbQueries.deletePackagesByPurl(purl);

        return 'Data deleted for packages with purl ' + purl;

    } else {
        return 'No packages found with purl ' + purl;
    }

}

export const getJobState = async (jobId: string): Promise<string | null> => {
    const scannerJob = await dbQueries.findScannerJobById(jobId);
    if (!scannerJob) return null;

    return scannerJob.state;
}

export const saveJobResults = async (jobId: string, result: ScannerJobResultSchema): Promise<void> => {
    console.log('Editing ScannerJob');
    const scannerJob = await dbQueries.updateScannerJob(
        {
            id: jobId,
            data: {
                scannerName: result.headers[0].tool_name,
                scannerVersion: result.headers[0].tool_version,
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
                    dbFile = await dbQueries.createFile({
                        data: {
                            sha256: file.sha256,
                            scanStatus: 'scanned',
                        }
                    });
                } else {
                    await dbQueries.updateFile({
                        id: dbFile.id,
                        data: {
                            scanStatus: 'scanned',
                        }
                    })
                }

                await dbQueries.createFileTree({
                    data: {
                        path: file.path,
                        packageId: scannerJob.packageId,
                        sha256: file.sha256,
                    }
                })

                for (const license of file.license_detections) {
                    for (const match of license.matches) {
                        await dbQueries.createLicenseFinding({
                            data: {
                                scanner: result.headers[0].tool_name,
                                licenseExpression: license.license_expression,
                                startLine: match.start_line,
                                endLine: match.end_line,
                                score: match.score,
                                sha256: file.sha256,
                                scannerJobId: scannerJob.id
                            }
                        })
                    }
                }

                for (const copyright of file.copyrights) {
                    await dbQueries.createCopyrightFinding({
                        data: {
                            startLine: copyright.start_line,
                            endLine: copyright.end_line,
                            copyright: copyright.copyright,
                            sha256: file.sha256,
                            scannerJobId: scannerJob.id
                        }
                    })
                }
            }
        }
    }

}

export const saveFilesAndFileTrees = async (packageId: number, files: { hash: string, path: string }[]): Promise<void> => {
    for (const file of files) {
        const existingFile = await dbQueries.findFileByHash(file.hash);

        if (!existingFile) {
            // Create new File
            await dbQueries.createFile({
                data: {
                    sha256: file.hash,
                    scanStatus: 'notStarted',
                }
            });
        }

        // Create new FileTree
        await dbQueries.createFileTree({
            data: {
                path: file.path,
                sha256: file.hash,
                packageId: packageId,
            }
        });
    }
}