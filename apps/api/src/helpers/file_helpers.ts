// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import admZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import fetch from 'cross-fetch';
import { downloadFile } from 's3-helpers';
import crypto from 'crypto';
import * as dbQueries from './db_queries';
import * as dbOperations from './db_operations';
import * as s3Helpers from 's3-helpers';

// Fetching zip file from object storage
export const downloadZipFile = async (zipFileKey: string, downloadPath: string): Promise<boolean> => {
    if (!process.env.SPACES_BUCKET) {
        throw new Error("SPACES_BUCKET environment variable is missing");
    }
    return await downloadFile(process.env.SPACES_BUCKET, zipFileKey, downloadPath);
}

// Unzipping the file
export const unzipFile = async (downloadPath: string, extractPath: string): Promise<boolean> => {
    // Check that file exists
    const fileExists = fs.existsSync(downloadPath);

    if (fileExists) {
        const zip = new admZip(downloadPath);
        zip.extractAllTo(extractPath, true);
        return true;
    } else {
        return false;
    }
}

// Deleting local files
export const deleteLocalFiles = async (downloadPath: string, extractPath: string): Promise<void> => {
    fs.rmSync(extractPath, { recursive: true });
    fs.rmSync(downloadPath);
}

// Iterate through all files in a directory and return an array of file hashes and paths 
export const getFileHashesMappedToPaths = async (baseDir: string): Promise<Array<{ hash: string, path: string }>> => {
    // Get the file paths as an array
    const fileHashesAndPaths: Array<{ hash: string, path: string }> = [];
    const directories: string[] = [baseDir];

    while (directories.length > 0) {
        const currentDir = directories.pop() as string;

        const curDirNoBase = currentDir.split(baseDir).pop();
        
        if (curDirNoBase === '.git') {
            console.log('Skipping .git directory');
            continue;
        }

        const files = await fs.promises.readdir(currentDir);

        for (const file of files) {
            if (file === '.gitignore') {
                console.log('Skipping .gitignore file');
                continue;
            }

            // Get the full paths
            const fromPath = path.join(currentDir, file);

            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat(fromPath);

            if (stat.isFile()) {
                // Get sha256 hash of the file
                const fileBuffer = fs.readFileSync(fromPath);
                const hashSum = crypto.createHash('sha256');

                hashSum.update(fileBuffer);

                const filePath = fromPath.split(baseDir).pop();

                fileHashesAndPaths.push({
                    hash: hashSum.digest('hex'),
                    path: filePath as string
                });
            } else if (stat.isDirectory()) {
                directories.push(fromPath);
            }
        }
    }

    return fileHashesAndPaths;
}

export const processPackageAndSendToScanner = async (zipFileKey: string, scannerJobId: string, packageId: number) => {
    try {
        if (!process.env.SPACES_BUCKET) {
            throw new Error('Error: SPACES_BUCKET environment variable is not defined');
        }

        // Downloading zip file from object storage
        const downloadPath = '/tmp/downloads/' + zipFileKey;
        const downloaded = await downloadZipFile(zipFileKey, downloadPath);

        if (!downloaded) {
            throw new Error('Zip file download failed');
        }

        console.log('Zip file downloaded');

        // Unzipping the file locally
        const fileNameNoExt = (zipFileKey).split('.')[0];
        const basePath = '/tmp/extracted/';
        const extractPath = basePath + fileNameNoExt + '/';

        const fileUnzipped = await unzipFile(downloadPath, extractPath);

        if (!fileUnzipped) {
            throw new Error('Zip file unzipping failed');
        }

        console.log('Zip file unzipped');

        // Saving files in extracted folder to object storage

        // Listing file paths and the corresponding file hashes and content types
        const fileHashesAndPaths = await getFileHashesMappedToPaths(extractPath);

        console.log('fileHashesAndPaths count: ', fileHashesAndPaths.length);

        // Uploading files to object storage individually with the file hash as the key

        const uploadedWithHash = await s3Helpers.saveFilesWithHashKey(fileHashesAndPaths, extractPath, process.env.SPACES_BUCKET);

        if (!uploadedWithHash) {
            throw new Error('Error: Uploading files to object storage failed');
        }

        console.log('Files uploaded to object storage');

        // Deleting local files
        deleteLocalFiles(downloadPath, extractPath);
        console.log('Local files deleted');

        // Deleting zip file from object storage
        await s3Helpers.deleteFile(process.env.SPACES_BUCKET, zipFileKey);

        // Save FileTrees to existing Files and get list of files to be scanned

        const filesToBeScanned: { hash: string, path: string }[] = await dbOperations.findFilesToBeScanned(packageId, fileHashesAndPaths)
        console.log('filesToBeScanned count: ', filesToBeScanned.length);

        if (filesToBeScanned.length > 0) {
            console.log('Sending a request to Scanner Agent to add new job to the work queue');
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
                console.log('Updating ScannerJob state to "queued"');

                await dbQueries.updateScannerJob({
                    id: scannerJobId,
                    data: { state: 'queued' }
                })

            } else {
                throw new Error('Error: Adding to queue was unsuccessful. Scanner Agent returned status code ' + response.status);
            }
        } else {
            // Update package scanStatus and ScannerJob to completed
            dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'completed' } });
            dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'completed' } });
        }

    } catch (error) {
        console.log(error);
        dbQueries.updatePackage({ id: packageId, data: { scanStatus: 'failed' } });
        dbQueries.updateScannerJob({ id: scannerJobId, data: { state: 'failed' } });
    }
}