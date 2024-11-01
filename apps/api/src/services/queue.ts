// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import Queue from "bull";
import { saveJobResults } from "../helpers/db_operations";
import {
    updateManyScannerJobChildren,
    updateScannerJob,
    updateScannerJobAndPackagesStateToFailedRecursive,
    updateScannerJobStateRecursive,
} from "../helpers/db_queries";
import { parseResult } from "../helpers/result_parser";

export default class QueueService {
    private static instance: Queue.Queue;

    /*
     * Empty private constructor is added here to prevent instantiation
     * and to highlight that this class is a singleton.
     */
    private constructor() {}

    public static getInstance(): Queue.Queue {
        if (!QueueService.instance) {
            QueueService.instance = new Queue(
                "scanner",
                process.env.REDIS_URL || "redis://localhost:6379",
                {
                    redis: {
                        password: process.env.REDIS_PW || "redis",
                    },
                },
            );
        }
        return QueueService.instance;
    }

    public static initiateJobEventListeners(): void {
        const workQueue = QueueService.getInstance();

        workQueue.on("global:waiting", async (jobId: string) => {
            try {
                // Update scanner job and its children (if any) states
                await updateScannerJob(jobId, {
                    state: "waiting",
                });
                await updateManyScannerJobChildren(jobId, {
                    state: "waiting",
                });
                console.log(`${jobId}: Changed state to waiting`);
            } catch (error) {
                console.log(error);
            }
        });

        workQueue.on("global:active", async (jobId: string) => {
            try {
                // Update scanner job and its children (if any) states
                await updateScannerJob(jobId, {
                    state: "active",
                });
                await updateManyScannerJobChildren(jobId, {
                    state: "active",
                });
                console.log(`${jobId}: Changed state to active`);
            } catch (error) {
                console.log(error);
            }
        });

        workQueue.on("global:resumed", async (jobId: string) => {
            try {
                // Update scanner job and its children (if any) states
                await updateScannerJobStateRecursive(jobId, {
                    state: "resumed",
                });
                console.log(`${jobId}: Changed state to resumed`);
            } catch (error) {
                console.log(error);
            }
        });

        workQueue.on("global:stalled", async (jobId: string) => {
            try {
                // Update scanner job and its children (if any) states
                await updateScannerJobStateRecursive(jobId, {
                    state: "stalled",
                });
                console.log(`${jobId}: Changed state to stalled`);
            } catch (error) {
                console.log(error);
            }
        });

        workQueue.on(
            "global:failed",
            async (jobId: string, failedReason: string) => {
                try {
                    const message = `Job failed in queue. Reason: ${failedReason}`;
                    console.error(`${jobId}: ${message}`);
                    // Update scanner job and its children (if any), and related packages
                    await updateScannerJobAndPackagesStateToFailedRecursive(
                        jobId,
                        message,
                    );
                    console.log(`${jobId}: Changed state to failed`);
                } catch (error) {
                    console.log(error);
                }
            },
        );

        workQueue.on(
            "global:completed",
            async (jobId: string, result: string) => {
                try {
                    console.log(
                        `${jobId}: Job completed, initiating saving results`,
                    );
                    const parsedResult = parseResult(result);
                    saveJobResults(jobId, parsedResult.result);
                } catch (error) {
                    console.log(error);
                }
            },
        );
    }
}
