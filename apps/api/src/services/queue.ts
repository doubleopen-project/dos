// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import Queue from "bull";

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
}
