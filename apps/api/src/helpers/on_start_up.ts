// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import log from "loglevel";
import QueueService from "../services/queue";
import { saveJobResults } from "./db_operations";
import {
    createSystemIssue,
    findScannerJobsByState,
    findSystemIssues,
    getCurators,
    updateCurator,
    updateManyPackagesScanStatuses,
    updateManyScannerJobStates,
    updateScannerJobAndPackagesStateToFailedRecursive,
    updateSystemIssue,
} from "./db_queries";
import { getUser } from "./keycloak_queries";

const workQueue = QueueService.getInstance();

const logLevel: log.LogLevelDesc =
    (process.env.LOG_LEVEL as log.LogLevelDesc) || "info"; // trace/debug/info/warn/error/silent

log.setLevel(logLevel);

export const onStartUp = async () => {
    try {
        await checkJobsInProcessingState();
        await checkJobsInSavingResultsState();
        await updateCurators();

        log.info(
            "All onStartUp checks completed successfully. Moving on to start the server.",
        );
    } catch (error) {
        log.error("Error in onStartUp: " + error);
    }
};

const checkJobsInProcessingState = async () => {
    log.info("Checking for jobs in processing state...");

    const jobs = await findScannerJobsByState("processing");

    log.info("Found " + jobs.length + " jobs in processing state");

    if (jobs.length === 0) {
        log.info("No jobs in processing state.");
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
            "Finding out if the job " + job.id + " has a SystemIssue already",
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
            log.info("SystemIssue(s) found for package " + job.package.purl);
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
};

const checkJobsInSavingResultsState = async () => {
    log.info("Checking for jobs in saving results state...");

    const jobs = await findScannerJobsByState("savingResults", true);

    log.info("Found " + jobs.length + " jobs in saving results state");

    if (jobs.length === 0) {
        log.info("No jobs in saving results state.");
        return;
    }

    const errorCode = "SAVING_RESULTS_INTERRUPTED";
    const severity = "LOW";
    const msgBase =
        "Saving results for the job was interrupted by server restart for package with purl ";

    for (const job of jobs) {
        log.debug(
            "Finding out if the job " + job.id + " has a SystemIssue already",
        );
        const existingIssues = await findSystemIssues(
            errorCode,
            msgBase + job.package.purl,
            false,
        );

        const workQueueJob = await workQueue.getJob(job.id);

        if (existingIssues.length === 0) {
            log.info("Filing a SystemIssue for job " + job.id);
            await createSystemIssue({
                message: msgBase + job.package.purl,
                severity: severity,
                errorCode: errorCode,
                info: {
                    latestJobId: [job.id],
                    packageId: job.package.id,
                },
            });

            const result = workQueueJob?.returnvalue.result;

            if (workQueueJob && result) {
                log.info(job.id + ": Restarting saving results phase.");

                saveJobResults(job.id, JSON.parse(result), undefined);
            } else {
                log.error(
                    job.id +
                        ": Could not restart saving results as work queue job or result is missing.",
                );

                log.info("Setting the state of the job to 'failed'");
                await updateScannerJobAndPackagesStateToFailedRecursive(
                    job.id,
                    "Saving results was interrupted by server restart, and could not be automatically restarted.",
                );
            }
        } else {
            log.info("SystemIssue(s) found for package " + job.package.purl);
            for (const issue of existingIssues) {
                log.info("Updating SystemIssue");
                await updateSystemIssue(issue.id, {
                    info: {
                        latestJobId: [job.id],
                        packageId: job.package.id,
                    },
                    severity: "CRITICAL",
                    details:
                        "Severity updated to CRITICAL as the same issue was found multiple times, which implies that saving results for this package is causing the server to crash.",
                });
            }

            log.info("Setting the state of the job to 'failed'");
            await updateScannerJobAndPackagesStateToFailedRecursive(
                job.id,
                "Saving results failed, due to server crash or restart.",
            );
        }
    }
};

const updateCurators = async () => {
    log.info("Updating curators...");

    const curators = await getCurators();

    for (const curator of curators) {
        const remoteUser = await getUser(curator.remoteId);

        if (remoteUser && remoteUser.username !== curator.username) {
            log.info(
                `Updating curator ${curator.id} with latest info from Keycloak.`,
            );

            await updateCurator(curator.id, {
                username: remoteUser.username,
            });
        }
    }
};
