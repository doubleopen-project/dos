// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import log from "loglevel";
import {
    createSystemIssue,
    findScannerJobsByState,
    findSystemIssues,
    updateManyPackagesScanStatuses,
    updateManyScannerJobStates,
    updateSystemIssue,
} from "./db_queries";

const logLevel: log.LogLevelDesc =
    (process.env.LOG_LEVEL as log.LogLevelDesc) || "info"; // trace/debug/info/warn/error/silent

log.setLevel(logLevel);

export const onStartUp = async () => {
    try {
        log.info("Checking for jobs in processing state...");

        const jobs = await findScannerJobsByState("processing");

        log.info("Found " + jobs.length + " jobs in processing state");

        if (jobs.length === 0) {
            log.info(
                "No jobs in processing state, moving on to start the server",
            );
            return;
        }
        log.info(
            "Setting the state of these jobs to 'failed', as the processing was interrupted, or caused the server to become unresponsive and restart",
        );
        await updateManyScannerJobStates(
            jobs.map((job) => job.id),
            "failed",
            "processing",
        );
        log.info("Also setting the scanStatus of the packages to 'failed'");
        await updateManyPackagesScanStatuses(
            jobs.map((job) => job.package.id),
            "failed",
        );

        log.info("Filing SystemIssues for the jobs in processing state");

        const errorCode = "PROCESSING_INTERRUPTED";
        const severity = "LOW";
        const msgBase =
            "The processing of the job was interrupted by server restart for package with purl ";

        for (const job of jobs) {
            log.debug(
                "Finding out if the job " +
                    job.id +
                    " has a SystemIssue already",
            );
            const existingIssues = await findSystemIssues(
                errorCode,
                msgBase + job.package.purl,
                false,
            );

            if (existingIssues.length === 0) {
                log.debug("No SystemIssue found for job " + job.id);
                log.info("Filing a SystemIssue for job " + job.id);
                await createSystemIssue({
                    message: msgBase + job.package.purl,
                    severity: severity,
                    errorCode: errorCode,
                    errorType: "ScannerRouterError",
                    info: {
                        latestJobId: [job.id],
                        packageId: job.package.id,
                    },
                });
            } else {
                log.info(
                    "SystemIssue(s) found for package " + job.package.purl,
                );
                for (const issue of existingIssues) {
                    log.info("Updating SystemIssue");
                    await updateSystemIssue(issue.id, {
                        info: {
                            latestJobId: [job.id],
                            packageId: job.package.id,
                        },
                        severity: "CRITICAL",
                        details:
                            "Severity updated to CRITICAL as the same issue was found multiple times, which implies that the processing of this package is causing the server to restart",
                    });
                }
            }
        }
        log.info(
            "All jobs in processing state have been handled. Moving on to start the server.",
        );
    } catch (error) {
        log.error("Error in onStartUp: " + error);
    }
};
