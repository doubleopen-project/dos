// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express from 'express';
import Queue from 'bull';

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Create/connect to a named work queue
let workQueue = new Queue("scanner", REDIS_URL);

const router = express.Router();

// Node: Hello World
router.get("/", (req, res) => {
    res.status(200).json({
        "message": "Hello World from Scanner Agent"
    });
});

// Node: POST a new scanner job. This is yet empty (dummy job)
router.post("/job", async (req, res) => {
    const job = await workQueue.add({});
    
    res.status(201).json({
        id: job.id,
        name: job.name
    });
});

// Node: Query job details for job [id]
router.get("/job/:id", async(req, res) => {
    let id = req.params.id;
    let job = await workQueue.getJob(id);

    if (job === null) {
        res.status(404).json({
            "message": "No such job in the work queue!"
        }).end();
    } else {
        let state = await job.getState();
        let progress = job.progress;
        let reason = job.failedReason;
        res.status(200).json({id, state, progress, reason});
    }
});

export default router;
