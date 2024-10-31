// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import log from "loglevel";
import { saveFilesWithHashKey } from "s3-helpers";
import QueueService from "../services/queue";
import { findFilesToBeScanned } from "./db_operations";
import * as dbQueries from "./db_queries";
import * as fileHelpers from "./file_helpers";
import { s3Client } from "./s3client";

const workQueue = QueueService.getInstance();

const logLevel: log.LogLevelDesc =
    (process.env.LOG_LEVEL as log.LogLevelDesc) || "info"; // trace/debug/info/warn/error/silent

log.setLevel(logLevel);

export const processPackageAndSendToScanner = async (
    zipFileKey: string,
    scannerJobId: string,
    packageIds: number[],
    purls: string[],
    jobStateMap: Map<string, string>,
) => {
    try {
        log.info(
            scannerJobId + ": Processing files for purl(s) " + purls.join(", "),
        );

        log.debug(scannerJobId + ": Search for main Scanner Job");
        const mainScannerJob = await dbQueries.findScannerJobById(scannerJobId);

        if (!mainScannerJob)
            throw new Error("Scanner job not found in database.");

        // Create ScannerJobs for each package
        const scannerJobIds: string[] = [scannerJobId];
        if (packageIds.length > 1) {
            log.debug(scannerJobId + ": Creating ScannerJobs for each package");
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
        log.debug(
            scannerJobId + ": Updating Package scanStatuses to 'pending'",
        );
        await dbQueries.updateManyPackagesScanStatuses(packageIds, "pending");
        // Update ScannerJob statuses to 'processing'
        log.debug(
            scannerJobId + ": Updating ScannerJob statuses to 'processing'",
        );
        await dbQueries.updateManyScannerJobStates(scannerJobIds, "processing");
        // Downloading zip file from object storage
        const downloadPath = "/tmp/downloads/" + zipFileKey;
        log.info(scannerJobId + ": Downloading zip file from object storage");
        const downloaded = await fileHelpers.downloadZipFile(
            zipFileKey,
            downloadPath,
        );

        if (!downloaded) throw new Error("Zip file download failed.");

        log.debug(scannerJobId + ": Zip file downloaded");

        // Unzipping the file locally
        const fileNameNoExt = zipFileKey.split(".")[0];
        const basePath = "/tmp/extracted/";
        const extractPath = basePath + fileNameNoExt + "/";

        log.debug(scannerJobId + ": Unzipping the file locally");
        const fileUnzipped = await fileHelpers.unzipFile(
            downloadPath,
            extractPath,
        );

        if (!fileUnzipped) throw new Error("Zip file unzipping failed.");

        log.debug(scannerJobId + ": Zip file unzipped");

        // Saving files in extracted folder to object storage

        // Mapping file hashes and the corresponding paths in an array
        log.debug(scannerJobId + ": Mapping file hashes and paths");
        const fileHashesMappedToPaths: {
            filesCount: number;
            fileHashesAndPaths: Map<string, string[]>;
        } = await fileHelpers.getFileHashesMappedToPaths(extractPath);

        log.info(
            scannerJobId +
                ": Found files: " +
                fileHashesMappedToPaths.filesCount,
        );
        log.debug(
            scannerJobId +
                ": Found unique files: " +
                fileHashesMappedToPaths.fileHashesAndPaths.size,
        );

        // Save FileTrees to existing Files (and for files with multiple paths) and get array of files to be scanned
        log.debug(scannerJobId + ": Finding files to be scanned");
        let filesToBeScanned: { hash: string; path: string }[] | null =
            await findFilesToBeScanned(
                packageIds,
                fileHashesMappedToPaths.fileHashesAndPaths,
            );
        log.info(
            scannerJobId + ": Uploading and sending to be scanned: ",
            filesToBeScanned.length,
        );

        // Uploading files to object storage with the file hash as the key
        if (filesToBeScanned.length > 0) {
            log.debug(
                scannerJobId +
                    ": Uploading files to object storage with the file hash as the key",
            );
            const uploadedWithHash = await saveFilesWithHashKey(
                s3Client,
                process.env.SPACES_BUCKET || "doubleopen",
                filesToBeScanned,
                extractPath,
                scannerJobId,
                jobStateMap,
            );

            if (!uploadedWithHash)
                throw new Error("Uploading files to object storage failed.");
        }
        jobStateMap.delete(scannerJobId);

        log.debug(scannerJobId + ": Files uploaded to object storage");

        // Deleting local files
        fileHelpers.deleteLocalFiles(downloadPath, extractPath);
        log.debug(scannerJobId + ": Local files deleted");

        if (filesToBeScanned.length > 0) {
            log.info(scannerJobId + ": Adding job to the work queue");

            const timeout = 600;

            try {
                await workQueue.add(
                    {
                        jobId: scannerJobId,
                        options: { timeout: timeout },
                        files: filesToBeScanned,
                    },
                    {
                        jobId: scannerJobId,
                    },
                );
            } catch (error) {
                throw new Error("Adding job to job queue was unsuccessful.");
            }

            await dbQueries.updateScannerJob(scannerJobId, {
                fileCount: filesToBeScanned.length,
                timeout: timeout,
            });
        } else {
            log.debug(scannerJobId + ": No files to be scanned");
            log.debug(
                scannerJobId + ': Changing Package scanStatus to "scanned"',
            );
            dbQueries.updateManyPackagesScanStatuses(packageIds, "scanned");
            log.debug(
                scannerJobId + ': Changing ScannerJob state to "completed"',
            );
            dbQueries.updateManyScannerJobStates(scannerJobIds, "completed");
        }
        fileHashesMappedToPaths.fileHashesAndPaths.clear();
        filesToBeScanned = null;
        log.debug(scannerJobId + ": Processing phase completed");
    } catch (error) {
        log.error(scannerJobId + ": Error in processing phase\n" + error);
        try {
            log.info(
                scannerJobId +
                    ': Changing ScannerJob and children (if any) states and related Packages scanStatuses to "failed"',
            );
            dbQueries.updateScannerJobAndPackagesStateToFailedRecursive(
                scannerJobId,
            );
        } catch (error) {
            log.error(
                scannerJobId +
                    ': Unable to update ScannerJob and Package statuses to "failed"',
            );
        }
    }
};
