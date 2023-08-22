// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import fetch from 'cross-fetch';
import * as dbQueries from './db_queries';
import { findFilesToBeScanned } from './db_operations';
import * as s3Helpers from 's3-helpers';
import * as fileHelpers from './file_helpers';

export const processPackageAndSendToScanner = async (zipFileKey: string, scannerJobId: string, packageId: number, purl: string, jobStateMap: Map<string, string>) => {
    try {
        if (!process.env.SPACES_BUCKET) {
            dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'failed' } });
            dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'failed' } });
            throw new Error('Error: SPACES_BUCKET environment variable is not defined');
        }
        console.log(scannerJobId + ': Processing files for purl ' + purl);
        // Update ScannerJob status to 'processing'
        await dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'processing' } });
        // Downloading zip file from object storage
        const downloadPath = '/tmp/downloads/' + zipFileKey;
        const downloaded = await fileHelpers.downloadZipFile(zipFileKey, downloadPath);

        if (!downloaded) {
            dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'failed' } });
            dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'failed' } });
            throw new Error('Zip file download failed');
        }

        //console.log(scannerJobId + ': Zip file downloaded');

        // Unzipping the file locally
        const fileNameNoExt = (zipFileKey).split('.')[0];
        const basePath = '/tmp/extracted/';
        const extractPath = basePath + fileNameNoExt + '/';

        const fileUnzipped = await fileHelpers.unzipFile(downloadPath, extractPath);

        if (!fileUnzipped) {
            dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'failed' } });
            dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'failed' } });
            throw new Error('Zip file unzipping failed');
        }

        //console.log(scannerJobId + ': Zip file unzipped');

        // Saving files in extracted folder to object storage

        // Listing file paths and the corresponding file hashes
        let fileHashesAndPaths: { hash: string, path: string }[] | null = await fileHelpers.getFileHashesMappedToPaths(extractPath);

        console.log(scannerJobId + ': Found files: ' + fileHashesAndPaths.length);

        // Save FileTrees to existing Files and get list of files to be scanned

        let filesToBeScanned: { hash: string, path: string }[] | null = await findFilesToBeScanned(packageId, fileHashesAndPaths)
        console.log(scannerJobId + ': Uploading and sending to be scanned: ', filesToBeScanned.length);

        // Uploading files to object storage individually with the file hash as the key

        const uploadedWithHash = await s3Helpers.saveFilesWithHashKey(filesToBeScanned, extractPath, process.env.SPACES_BUCKET, scannerJobId, jobStateMap);

        jobStateMap.delete(scannerJobId);

        if (!uploadedWithHash) {
            dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'failed' } });
            dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'failed' } });
            throw new Error('Error: Uploading files to object storage failed');
        }

        //console.log('Files uploaded to object storage');

        // Deleting local files
        fileHelpers.deleteLocalFiles(downloadPath, extractPath);
        //console.log('Local files deleted');

        // Deleting zip file from object storage
        await s3Helpers.deleteFile(process.env.SPACES_BUCKET, zipFileKey);

        if (filesToBeScanned.length > 0) {
            console.log(scannerJobId + ': Sending a request to Scanner Agent to add new job to the work queue');
            const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';
            const postJobUrl = scannerUrl + 'job';

            const request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.SA_TOKEN
                },
                body: JSON.stringify({
                    jobId: scannerJobId,
                    files: filesToBeScanned
                })
            }

            const response = await fetch(postJobUrl, request);

            if (response.status === 201) {
                console.log(scannerJobId + ': Updating ScannerJob state to "queued"');

                await dbQueries.updateScannerJob({
                    id: scannerJobId,
                    data: { state: 'queued' }
                })

            } else {
                dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'failed' } });
                dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'failed' } });
                throw new Error('Error: Adding to queue was unsuccessful. Scanner Agent returned status code ' + response.status);
            }
        } else {
            // Update package scanStatus and ScannerJob to completed
            dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'scanned' } });
            dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'completed' } });
        }
        fileHashesAndPaths = null;
        filesToBeScanned = null;

    } catch (error) {
        console.log(error);
        try {
            console.log('Attempting to change ScannerJob state and Package scanStatus to "failed"');
            
            dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'failed' } });
            dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'failed' } });
        } catch (error) {
            console.log(scannerJobId + ': Unable to update ScannerJob and Package statuses to "failed"');
        }
    }
}