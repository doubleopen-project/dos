// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/*
eslint-disable @typescript-eslint/no-misused-promises
*/

import express, { Request, Response, Router } from 'express';
import Queue from 'bull';

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Create/connect to a named work queue
const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);

const router: Router = express.Router();

// Node: Hello World
router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        "Message": "Hello World from Scanner Agent"
    });
    return;
});

// Node: POST a new scanner job. This is yet empty (dummy job)
router.post("/job", async (req: Request, res: Response) => {
    const job: Queue.Job = await workQueue.add({});
    
    res.status(201).json({
        id: job.id,
        name: job.name
    });
});

// Node: Query job details for job [id]
router.get("/job/:id", async(req: Request, res: Response) => {
    const id: string = req.params.id;
    const job: Queue.Job | null = await workQueue.getJob(id);

    if (job === null) {
        res.status(404).json({
            "Message": "No such job in the work queue"
        });
    } else {
        const state: string = await job.getState();
        const progress: number = job.progress();
        const finishedOn: number | undefined = job.finishedOn;
        res.status(200).json({
            id, 
            state, 
            progress, 
            finishedOn
        });
    }
});

// Trying to write the same functions using a different structure to make Lint happy

router.post("/jobtemp", function(req: Request, res: Response) {

    workQueue.add({})
        .then(function(jobResolved: Queue.Job) {
            const job: Queue.Job = jobResolved;
            return res.status(201).json({
                id: job.id,
                name: job.name
            })
        })
        .catch(function(err: string) {
            console.log("Failed to push a job to the queue, reason", err);
            return res.status(500).json({"Message": "Internal server error: Bull"});
        }) 
});

router.get("/jobtemp/:id", function(req: Request, res: Response) {
    const id: string = req.params.id;
    
    workQueue.getJob(id)
        .then(function(jobResolved: Queue.Job | null) {
            if (jobResolved) {
                // TODO
            }
        })
        .catch(function() {
            return res.status(404).json({
                "Message": "No such job in the work queue!"
            });
        })
});



export default router;