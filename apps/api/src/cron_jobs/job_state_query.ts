// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* In case anything goes wrong with Scanner Agent trying to inform API
 * about the state of a job, this cron job will query the state of all
 * jobs that are not in a final state (completed, failed, resultsDeleted).
 */

import {
    findScannerJobsWithStates,
    updatePackage,
    updateScannerJob,
} from "../helpers/db_queries";
import { queryJobState } from "../helpers/sa_queries";

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
            if (dbState === "created" || dbState === "processing") {
                /*
                 * Case where the job hasn't yet been added to the queue.
                 */
                // TODO: figure out what the optimal limits for flagCount are for "created" and "processing" states
                if (flaggedJob) {
                    if (flaggedJob.dbState === dbState) {
                        // If the job is in the flagged map, increment the flagCount
                        flaggedJob.flagCount++;
                        if (
                            (dbState === "created" &&
                                flaggedJob.flagCount > 1) ||
                            (dbState === "processing" &&
                                flaggedJob.flagCount > 6)
                        ) {
                            console.log(
                                scannerJobId +
                                    ": Changing state from " +
                                    dbState +
                                    " to failed as the state hasn't changed in " +
                                    (dbState === "created"
                                        ? "5 minutes"
                                        : "30 minutes"),
                            );
                            await updateScannerJob(scannerJobId, {
                                state: "failed",
                            });
                            await updatePackage({
                                id: packageId,
                                data: { scanStatus: "failed" },
                            });
                            flaggedMap.delete(scannerJobId);

                            //TODO: maybe retry jobs that have failed during creation/processing?
                            // And log an issue if the retry fails
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
                        queueState: "notReadyForQueue",
                        flagCount: 1,
                    });
                }
            } else {
                // State of the job in the job queue
                const jobQueueState = await queryJobState(scannerJobId);

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
                            // TODO: Launch a new task to save the results
                            // For now, just update the state "failed" for ScannerJob and Package in the database
                            console.log(
                                scannerJobId +
                                    ": Job has completed, but changing job state to failed, as the saving results phase needs to be initiated separately",
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
                        case "notFound":
                            /*
                             * Case where the job has a state "queued", "waiting", "active", "resumed" or "stalled"
                             * in the database, but the job is not found in the queue.
                             * This could mean that the queue has been wiped before the job has finished,
                             * or something else could have gone wrong, so we'll just mark the job as failed.
                             */

                            // TODO: Add an issue about this to the database, so that it can be investigated
                            // Could be like a SystemIssue table or something, so it wouldn't get lost in the logs.
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
    } catch (error) {
        console.error(error);
    }
};
