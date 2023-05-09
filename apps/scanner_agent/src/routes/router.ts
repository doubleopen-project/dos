// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/*
eslint-disable @typescript-eslint/no-misused-promises
*/

import express, { Request, RequestHandler, Response, Router } from 'express';
import Queue from 'bull';
import bodyParser from 'body-parser';

const router: Router = express.Router();
router.use(bodyParser.json() as RequestHandler);

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://127.0.0.1:6379";

// Create/connect to a named work queue
const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);

// Node: Hello World
router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        "Message": "Hello World from Scanner Agent"
    });
    return;
});

interface CustomRequest<T> extends Request {
    body: T;
}

interface ScannerJob {
    directory: string;
}

// Node: POST a new scanner job
router.post("/job", async (req: CustomRequest<ScannerJob>, res: Response) => {

    // Job details are in the request body

    try {
        if (!req.body.directory) {
            res.status(400).json({
                "Message": "Missing directory in POST /job"
            });
            return;
        }

        const job: Queue.Job = await workQueue.add({
            directory: req.body.directory
        })
        
        res.status(201).json({
            id: job.id,
            data: job.data
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            "Message": "Error in POST /job"
        });
    }
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
        const finishedOn: number | undefined = job.finishedOn;
        res.status(200).json({
            id: job.id, 
            data: job.data,
            state, 
            finishedOn
        });
    }
});

// Node: Query statuses of all active/waiting jobs in the work queue
router.get("/jobs", async(req: Request, res: Response) => {
    const jobs: Queue.Job[] = await workQueue.getJobs(["active", "waiting", "completed", "failed"]);
    const jobList: any[] = [];

    for (const job of jobs) {
        const state: string = await job.getState();        
        const finishedOn: number | undefined = job.finishedOn;
        jobList.push({
            id: job.id,
            data: job.data,
            state,
            finishedOn
        });
    }
    res.status(200).json(jobList);
});

export default router;