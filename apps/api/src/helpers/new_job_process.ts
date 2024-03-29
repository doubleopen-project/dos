// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { saveFilesWithHashKey } from "s3-helpers";
import { findFilesToBeScanned } from "./db_operations";
import * as dbQueries from "./db_queries";
import * as fileHelpers from "./file_helpers";
import { s3Client } from "./s3client";
import { sendJobToQueue } from "./sa_queries";

export const processPackageAndSendToScanner = async (
    zipFileKey: string,
    scannerJobId: string,
    packageIds: number[],
    purls: string[],
    jobStateMap: Map<string, string>,
) => {
    try {
        console.log(
            scannerJobId + ": Processing files for purl(s) " + purls.join(", "),
        );

        const mainScannerJob = await dbQueries.findScannerJobById(scannerJobId);

        if (!mainScannerJob) throw new Error("ScannerJob not found");

        const scannerJobIds: string[] = [scannerJobId];
        if (packageIds.length > 1) {
            for (const packageId of packageIds) {
                if (packageId !== mainScannerJob.packageId) {
                    const createdScannerJob = await dbQueries.createScannerJob({
                        packageId: packageId,
                        state: "created",
                        parentId: scannerJobId,
                    });
                    scannerJobIds.push(createdScannerJob.id);
                }
            }
        }
        // Update Package scanStatuses to 'pending'
        await dbQueries.updateManyPackagesScanStatuses(packageIds, "pending");
        // Update ScannerJob statuses to 'processing'
        await dbQueries.updateManyScannerJobStates(scannerJobIds, "processing");
        // Downloading zip file from object storage
        const downloadPath = "/tmp/downloads/" + zipFileKey;
        const downloaded = await fileHelpers.downloadZipFile(
            zipFileKey,
            downloadPath,
        );

        if (!downloaded) {
            dbQueries.updateManyPackagesScanStatuses(packageIds, "failed");
            dbQueries.updateManyScannerJobStates(scannerJobIds, "failed");
            throw new Error("Zip file download failed");
        }

        //console.log(scannerJobId + ': Zip file downloaded');

        // Unzipping the file locally
        const fileNameNoExt = zipFileKey.split(".")[0];
        const basePath = "/tmp/extracted/";
        const extractPath = basePath + fileNameNoExt + "/";

        const fileUnzipped = await fileHelpers.unzipFile(
            downloadPath,
            extractPath,
        );

        if (!fileUnzipped) {
            dbQueries.updateManyPackagesScanStatuses(packageIds, "failed");
            dbQueries.updateManyScannerJobStates(scannerJobIds, "failed");
            throw new Error("Zip file unzipping failed");
        }

        //console.log(scannerJobId + ': Zip file unzipped');

        // Saving files in extracted folder to object storage

        // Mapping file hashes and the corresponding paths in an array
        const fileHashesMappedToPaths: {
            filesCount: number;
            fileHashesAndPaths: Map<string, string[]>;
        } = await fileHelpers.getFileHashesMappedToPaths(extractPath);

        console.log(
            scannerJobId +
                ": Found files: " +
                fileHashesMappedToPaths.filesCount,
        );
        //console.log(scannerJobId + ': Found unique files: ' + fileHashesMappedToPaths.fileHashesAndPaths.size);

        // Save FileTrees to existing Files (and for files with multiple paths) and get array of files to be scanned
        let filesToBeScanned: { hash: string; path: string }[] | null =
            await findFilesToBeScanned(
                packageIds,
                fileHashesMappedToPaths.fileHashesAndPaths,
            );
        console.log(
            scannerJobId + ": Uploading and sending to be scanned: ",
            filesToBeScanned.length,
        );

        // Uploading files to object storage with the file hash as the key
        if (filesToBeScanned.length > 0) {
            const uploadedWithHash = await saveFilesWithHashKey(
                s3Client,
                process.env.SPACES_BUCKET || "doubleopen",
                filesToBeScanned,
                extractPath,
                scannerJobId,
                jobStateMap,
            );

            if (!uploadedWithHash) {
                dbQueries.updateManyPackagesScanStatuses(packageIds, "failed");
                dbQueries.updateManyScannerJobStates(scannerJobIds, "failed");
                throw new Error(
                    "Error: Uploading files to object storage failed",
                );
            }
        }
        jobStateMap.delete(scannerJobId);

        //console.log('Files uploaded to object storage');

        // Deleting local files
        fileHelpers.deleteLocalFiles(downloadPath, extractPath);
        //console.log('Local files deleted');

        if (filesToBeScanned.length > 0) {
            console.log(
                scannerJobId +
                    ": Sending a request to Scanner Agent to add new job to the work queue",
            );

            const addedToQueue = await sendJobToQueue(
                scannerJobId,
                filesToBeScanned,
                { timeout: process.env.DEFAULT_TIMEOUT || "120" },
            );

            if (addedToQueue) {
                console.log(
                    scannerJobId + ': Updating ScannerJob state to "queued"',
                );

                await dbQueries.updateManyScannerJobStates(
                    scannerJobIds,
                    "queued",
                );

                await dbQueries.updateScannerJob(scannerJobId, {
                    fileCount: filesToBeScanned.length,
                    timeout:
                        parseInt(process.env.DEFAULT_TIMEOUT as string) || 120,
                });
            } else {
                throw new Error("Error: Adding to queue was unsuccessful.");
            }
        } else {
            dbQueries.updateManyPackagesScanStatuses(packageIds, "scanned");
            dbQueries.updateManyScannerJobStates(scannerJobIds, "completed");
        }
        fileHashesMappedToPaths.fileHashesAndPaths.clear();
        filesToBeScanned = null;
    } catch (error) {
        console.log(error);
        try {
            console.log(
                scannerJobId + ': Changing ScannerJob state to "failed"',
            );
            dbQueries.updateScannerJob(scannerJobId, { state: "failed" });
            console.log(
                scannerJobId + ': Changing Package scanStatus to "failed"',
            );
            dbQueries.updateManyPackagesScanStatuses(packageIds, "failed");
        } catch (error) {
            console.log(
                scannerJobId +
                    ': Unable to update ScannerJob and Package statuses to "failed"',
            );
        }
    }
};
