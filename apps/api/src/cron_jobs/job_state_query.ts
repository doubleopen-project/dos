// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/*
 * This cron job will query the state of all jobs that are not in a final state (completed, failed, resultsDeleted)
 * so that the state of the job in the database can be updated if the state of the job in the job queue has changed
 * or if the state is stuck on pre-scan or post-scan phases.
 * These error stages could be caused by:
 * - a connection issue between the API and Scanner Agent
 * - API not being able to reach database
 * - API or Scanner Agent crashing / stopping / not responding unexpectedly
 * - job queue being wiped before the job has finished
 */

import {
    copyDataToNewPackages,
    saveJobResults,
} from "../helpers/db_operations";
import {
    findScannerJobById,
    findScannerJobsWithStates,
    updatePackage,
    updateScannerJob,
} from "../helpers/db_queries";
import { queryJobDetails } from "../helpers/sa_queries";

const flaggedMap = new Map<
    string,
    { dbState: string; queueState: string; flagCount: number }
>([]);

const nonFinalStates = [
    "created",
    "processing",
    "queued",
    "waiting",
    "active",
    "delayed",
    "paused",
    "stuck",
    "resumed",
    "stalled",
    "savingResults",
];

export const jobStateQuery = async () => {
    try {
        console.log("Cron job: Checking for job state issues");
        // Get all scanner jobs that are not in a final state (queried from database)
        const scannerJobsInNonFinalState =
            await findScannerJobsWithStates(nonFinalStates);

        // Delete flagged jobs that are not in the list of jobs in non-final state
        if (flaggedMap.size > 0 && scannerJobsInNonFinalState.size > 0) {
            for (const [key, value] of flaggedMap.entries()) {
                const dbItem = scannerJobsInNonFinalState.get(key);
                if (!dbItem || dbItem.state !== value.dbState) {
                    flaggedMap.delete(key);
                }
            }
        } else if (
            flaggedMap.size > 0 &&
            scannerJobsInNonFinalState.size === 0
        ) {
            flaggedMap.clear();
        }

        for (const [key, value] of scannerJobsInNonFinalState) {
            const scannerJobId = key;
            // The get() method of Map will return a reference to the flagged job object (not a copy), so it can be directly modified
            const flaggedJob = flaggedMap.get(scannerJobId);
            const dbState = value.state;
            const packageId = value.packageId;
            const parentId = value.parentId;
            if (dbState === "created" || dbState === "processing") {
                /*
                 * Case where the job hasn't yet been added to the queue.
                 */
                const maxFlagCountForProcessing =
                    parseInt(process.env.MAX_FLAG_COUNT_PROCESSING as string) ||
                    12;

                if (flaggedJob) {
                    if (flaggedJob.dbState === dbState) {
                        // If the job is in the flagged map, increment the flagCount
                        flaggedJob.flagCount++;
                        if (
                            (dbState === "created" &&
                                flaggedJob.flagCount > 1) ||
                            (dbState === "processing" &&
                                flaggedJob.flagCount >
                                    maxFlagCountForProcessing)
                        ) {
                            console.log(
                                scannerJobId +
                                    ": Changing state from " +
                                    dbState +
                                    " to failed as the state hasn't changed in " +
                                    (dbState === "created"
                                        ? "5 minutes"
                                        : maxFlagCountForProcessing * 5 +
                                          " minutes"),
                            );
                            await updateScannerJob(scannerJobId, {
                                state: "failed",
                            });
                            await updatePackage({
                                id: packageId,
                                data: { scanStatus: "failed" },
                            });
                            flaggedMap.delete(scannerJobId);
                        }
                    } else {
                        // If the dbState has changed since the last check
                        flaggedJob.dbState = dbState;
                        flaggedJob.flagCount = 1;
                    }
                } else {
                    // If the job is not in the flagged map
                    flaggedMap.set(scannerJobId, {
                        dbState: dbState,
                        queueState: "prescan",
                        flagCount: 1,
                    });
                }
            } else if (dbState === "savingResults") {
                if (flaggedJob) {
                    if (flaggedJob.dbState === dbState) {
                        flaggedJob.flagCount++;
                        if (flaggedJob.flagCount > 6) {
                            /* Case where API has crashed / stopped during saving results phase */
                            console.log(
                                scannerJobId +
                                    ": Restarting saving results phase as the job has been in the savingResults state for 30 minutes",
                            );
                            const jobDetails =
                                await queryJobDetails(scannerJobId);
                            if (jobDetails.result) {
                                saveJobResults(
                                    scannerJobId,
                                    jobDetails.result,
                                    undefined,
                                );
                            } else {
                                console.log(
                                    scannerJobId +
                                        ": Job has completed, but no result was found. Changing state to failed.",
                                );
                                await updateScannerJob(scannerJobId, {
                                    state: "failed",
                                });
                                await updatePackage({
                                    id: packageId,
                                    data: {
                                        scanStatus: "failed",
                                    },
                                });
                            }

                            flaggedMap.delete(scannerJobId);
                        }
                    } else {
                        // If the dbState has changed since the last check
                        flaggedJob.dbState = dbState;
                        flaggedJob.flagCount = 1;
                    }
                } else {
                    // If the job is not in the flagged map
                    flaggedMap.set(scannerJobId, {
                        dbState: dbState,
                        queueState: "postscan",
                        flagCount: 1,
                    });
                }
            } else if (parentId) {
                /*
                 * Case where the job is a child job.
                 * The state of the job in the job queue is not queried, as the state of the parent job is the one that matters.
                 */
                const parentJob = scannerJobsInNonFinalState.get(parentId);
                if (parentJob) {
                    /*
                     * If the parent job is in the list of jobs in non-final state, and the
                     * state of the parent job is different from the state of the child job,
                     * update the state of the child job to match the state of the parent job
                     */
                    if (parentJob.state !== dbState) {
                        console.log(
                            scannerJobId +
                                ": Changing state from " +
                                dbState +
                                " to " +
                                parentJob.state +
                                " as the parent job has changed state",
                        );
                        await updateScannerJob(scannerJobId, {
                            state: parentJob.state,
                        });
                    }
                } else {
                    // The parent job is not in the list of jobs in non-final state, so it must be in a final state

                    // Get the state and data of the parent job from the database
                    const parentJob = await findScannerJobById(parentId);

                    if (!parentJob) {
                        // If the parent job is not found in the database, mark the child job as failed
                        console.log(
                            scannerJobId +
                                ": Changing state to failed as the parent job is not found in the database",
                        );
                        await updateScannerJob(scannerJobId, {
                            state: "failed",
                        });
                        await updatePackage({
                            id: packageId,
                            data: { scanStatus: "failed" },
                        });
                    } else if (parentJob.state === "failed") {
                        console.log(
                            scannerJobId +
                                ": Changing state to failed as the parent job has failed",
                        );
                        await updateScannerJob(scannerJobId, {
                            state: "failed",
                        });
                        await updatePackage({
                            id: packageId,
                            data: { scanStatus: "failed" },
                        });
                    } else if (parentJob.state === "completed") {
                        console.log(
                            scannerJobId +
                                ": Copying results and changing state to completed as the parent job has completed",
                        );
                        await copyDataToNewPackages(parentJob.packageId, [
                            packageId,
                        ]);
                        await updateScannerJob(scannerJobId, {
                            state: "completed",
                        });
                        await updatePackage({
                            id: packageId,
                            data: { scanStatus: "scanned" },
                        });
                    }
                }
            } else {
                // State of the job in the job queue
                const jobDetails = await queryJobDetails(scannerJobId);
                const jobQueueState = jobDetails.state;

                if (dbState !== jobQueueState) {
                    switch (jobQueueState) {
                        case "failed":
                            // Just update the state in the database, if case is "failed"
                            console.log(
                                scannerJobId +
                                    ": Changing state to failed as its state is failed in the job queue",
                            );
                            await updateScannerJob(scannerJobId, {
                                state: "failed",
                            });
                            await updatePackage({
                                id: packageId,
                                data: { scanStatus: "failed" },
                            });
                            break;
                        case "completed":
                            /*
                             * Case where job is completed in queue but Scanner Agent's
                             * attempt to inform API about the state of the job has failed.
                             */
                            if (jobDetails.result) {
                                console.log(
                                    "The job has completed state in the queue, but " +
                                        dbState +
                                        " in the database. Initiating saving results.",
                                );
                                // Save the job results to the database
                                saveJobResults(
                                    scannerJobId,
                                    jobDetails.result,
                                    undefined,
                                );
                            } else {
                                console.log(
                                    scannerJobId +
                                        ": Job has completed, but no result was found. Changing state to failed.",
                                );
                                await updateScannerJob(scannerJobId, {
                                    state: "failed",
                                });
                                await updatePackage({
                                    id: packageId,
                                    data: {
                                        scanStatus: "failed",
                                    },
                                });
                                flaggedMap.delete(scannerJobId);
                            }
                            break;
                        case "notFound":
                            /*
                             * Case where the job has a state "queued", "waiting", "active", "resumed" or "stalled"
                             * in the database, but the job is not found in the queue.
                             * This could mean that the queue has been wiped before the job has finished,
                             * or something else could have gone wrong, so we'll just mark the job as failed.
                             */
                            if (
                                flaggedJob &&
                                flaggedJob.dbState === dbState &&
                                flaggedJob.queueState === jobQueueState
                            ) {
                                // For now, logging to the console
                                console.log(
                                    scannerJobId +
                                        ": ScannerJob not found in job queue. Changing state to failed.",
                                );
                                await updateScannerJob(scannerJobId, {
                                    state: "failed",
                                });
                                await updatePackage({
                                    id: packageId,
                                    data: {
                                        scanStatus: "failed",
                                    },
                                });
                                flaggedMap.delete(scannerJobId);
                                break;
                            } else {
                                // If the states have changed since the last check, but still differ from each other,
                                // update the flagged job's states in the map with flagCount 1
                                flaggedMap.set(scannerJobId, {
                                    dbState: dbState,
                                    queueState: jobQueueState,
                                    flagCount: 1,
                                });
                            }
                            break;
                        case "noConnectionToSA":
                            if (flaggedJob) {
                                if (
                                    flaggedJob.dbState === dbState &&
                                    flaggedJob.queueState === jobQueueState
                                ) {
                                    flaggedJob.flagCount++;
                                    if (flaggedJob.flagCount > 2) {
                                        console.log(
                                            scannerJobId +
                                                ": Updating job state to failed, as the connection to Scanner Agent has been down for 3 consecutive checks",
                                        );
                                        await updateScannerJob(scannerJobId, {
                                            state: "failed",
                                        });
                                        flaggedMap.delete(scannerJobId);
                                    }
                                } else {
                                    // If the states have changed since the last check, but still differ from each other,
                                    // update the flagged job's states in the map with flagCount 1
                                    flaggedMap.set(scannerJobId, {
                                        dbState: dbState,
                                        queueState: jobQueueState,
                                        flagCount: 1,
                                    });
                                }
                            } else {
                                // If the job is not in the flagged map, add it with flagCount 1
                                flaggedMap.set(scannerJobId, {
                                    dbState: dbState,
                                    queueState: jobQueueState,
                                    flagCount: 1,
                                });
                            }
                            break;
                        default:
                            if (flaggedJob) {
                                if (
                                    flaggedJob.dbState === dbState &&
                                    flaggedJob.queueState === jobQueueState
                                ) {
                                    // If the states haven't changed since the last check, just update the state in the database
                                    console.log(
                                        scannerJobId +
                                            ": Updating job state to " +
                                            jobQueueState,
                                    );
                                    await updateScannerJob(scannerJobId, {
                                        state: jobQueueState,
                                    });
                                    flaggedMap.delete(scannerJobId);
                                } else {
                                    // If the states have changed since the last check, but still differ from each other,
                                    // update the flagged job's states in the map with flagCount 1
                                    flaggedMap.set(scannerJobId, {
                                        dbState: dbState,
                                        queueState: jobQueueState,
                                        flagCount: 1,
                                    });
                                }
                            } else {
                                // If the job is not in the flagged map, add it with flagCount 1
                                flaggedMap.set(scannerJobId, {
                                    dbState: dbState,
                                    queueState: jobQueueState,
                                    flagCount: 1,
                                });
                            }
                            break;
                    }
                }
            }
        }
        //console.log(flaggedMap.entries());
        if (flaggedMap.size > 0)
            console.log(
                "Tracking " +
                    flaggedMap.size +
                    (flaggedMap.size === 1 ? " job" : " jobs"),
            );
        else console.log("No issues found");
    } catch (error) {
        console.error(error);
    }
};
