// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as dbQueries from '../helpers/db_queries';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { Package, ScannerJob } from 'database';

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