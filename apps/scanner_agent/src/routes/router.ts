// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/*
eslint-disable @typescript-eslint/no-misused-promises
*/

import express, { Request, RequestHandler, Response, Router } from 'express';
import Queue from 'bull';
import bodyParser from 'body-parser';
import fetch from "cross-fetch";
import * as dotenv from "dotenv";

// Load environment variables
const result = dotenv.config({ path: "../../.env"});
if (result.error) {
    throw result.error;
}

const router: Router = express.Router();
router.use(bodyParser.json() as RequestHandler);

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://127.0.0.1:6379";

// URL address and node of DOS to send job status updates to
const dosUrl: string = process.env.DOS_URL? process.env.DOS_URL : "https://localhost:5000/";
const postStatusUrl: string = dosUrl + "jobstatus";

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

// Listen to global job events

workQueue.on("global:waiting", async (jobId: number) => {
    console.log("Job", jobId, "is waiting");
    await postJobStatus(jobId, "waiting");
})

workQueue.on("global:active", async (jobId: number) => {
    console.log("Job", jobId, "is active");
    await postJobStatus(jobId, "active");
})

workQueue.on("global:resumed", async (jobId: number) => {
    console.log("Job", jobId, "has been resumed");
    await postJobStatus(jobId, "resumed");
})

workQueue.on("global:stalled", async (jobId: number) => {
    console.log("Job", jobId, "has stalled");
    await postJobStatus(jobId, "stalled");
})

workQueue.on("global:failed", async (jobId: number) => {
    console.log("Job", jobId, "has failed");
    await postJobStatus(jobId, "failed");
})

workQueue.on("global:completed", async (jobId: number, result: string) => {
    console.log("Job", jobId, "has been completed");
    await postJobStatus(jobId, "completed", result);
})

// Create a request to send the job status to DOS
const createRequest = (id: number, status: string, result?: string): RequestInit => {

    let requestBody = {
        id: id,
        name: "Scanner Agent",
        status: status,
        result: undefined // Initialize result as undefined
      };

    if (result !== undefined) {
        
        const parsedResult = JSON.parse(result, (key, value) => {
            if (typeof value === "string") {
              try {
                return JSON.parse(value);
              } catch (error) {
                return value;
              }
            }
            return value;
          });
      
        const files = parsedResult.result?.files;
        console.log(files);
        requestBody = {
            ...requestBody,
            result: files // Assign "files" node as the result
        };
    }

    return {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Charset": "utf-8"
        },
        body: JSON.stringify(requestBody)
    }
}

// Send the job status to DOS
const postJobStatus = async (id: number, status: string, result?: string): Promise<string | undefined> => {
    const request: RequestInit = createRequest(id, status, result);
    try {
        const response: globalThis.Response = await fetch(postStatusUrl, request);
        const data: string | undefined = await response.json();
        console.log("Response from DOS:", data);
        return data;
    } catch (error) {
        console.log("Error:", error);
    }
}

export default router;