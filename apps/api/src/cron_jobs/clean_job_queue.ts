// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import log from "loglevel";
import QueueService from "../services/queue";

const logLevel: log.LogLevelDesc =
    (process.env.LOG_LEVEL as log.LogLevelDesc) || "info"; // trace/debug/info/warn/error/silent

log.setLevel(logLevel);

export const cleanJobQueue = async () => {
    try {
        const workQueue = QueueService.getInstance();

        log.info(
            "Cleaning up completed and failed jobs from the queue that are older than 14 days.",
        );

        const cleanedCompleted = await workQueue.clean(
            14 * 24 * 60 * 60 * 1000,
            "completed",
        );
        log.info(
            `Cleaned ${cleanedCompleted.length} completed jobs from the queue.`,
        );

        const cleanedFailed = await workQueue.clean(
            14 * 24 * 60 * 60 * 1000,
            "failed",
        );
        log.info(`Cleaned ${cleanedFailed.length} failed jobs from the queue.`);
    } catch (error) {
        log.error(error);
    }
};
