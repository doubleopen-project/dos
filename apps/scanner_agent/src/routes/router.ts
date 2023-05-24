// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-inferrable-types */

import { Request, RequestHandler, Response, Router } from 'express';
import Queue, { Job, JobOptions } from 'bull';
import bodyParser from 'body-parser';
import fetch from "cross-fetch";
import { loadEnv } from 'common-helpers';
import milliseconds from "milliseconds";

//////////////////////////
// Environment variables
//////////////////////////

loadEnv("../../.env");

const router: Router = Router();
router.use(bodyParser.json() as RequestHandler);

// Connect to Heroku-provided URL on Heroku and local redis instance locally
//const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://127.0.0.1:6379";
const REDIS_URL: string = process.env.REDIS_URL || "redis://localhost:6379";

// URL address and node of DOS to send job status updates to
//const dosUrl: string = process.env.DOS_URL? process.env.DOS_URL : "https://localhost:5000/";
const dosUrl: string = process.env.DOS_URL || "http://localhost:5000/api/";
const postStatusUrl: string = dosUrl + "job-state";

// Create/connect to a named work queue
const workQueue: Queue.Queue<ScannerJob> = new Queue("scanner", REDIS_URL);

//////////////////////////
// Interfaces and types
//////////////////////////

// Custom request interface
interface CustomRequest<T> extends Request {
    body: T;
}

// Scan job with its parameters
type ScannerJob = {
    directory: string;
    opts: {
        jobId: string;
    }
}

// Job return information
interface JobInfo {
    id: Queue.JobId;
    state: string;
    data: ScannerJob;
    finishedOn: number | undefined;
}

// Send the job status to DOS
interface RequestBody {
    id: Queue.JobId;
    name: string;
    state: string;
    result: string | undefined;
}

// Parse the scanjob result
interface ParsedResult {
    result: string;
    key: string;
    value: string | undefined;
}

//////////////////////////
// Module implementation
//////////////////////////

// Node: Hello World
router.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        "Message": "Hello World from Scanner Agent"
    });
    return;
});

// Node: POST a new scanner job
router.post("/job", async (req: CustomRequest<ScannerJob>, res: Response) => {

    // Job details are in the request body

    try {
        if (!req.body.directory || !req.body.opts.jobId) {
            res.status(400).json({
                "Message": "Missing directory or job ID in POST /job"
            });
            return;
        }

        // Unique job ID is given by DOS
        const jobOpts: JobOptions = {
            jobId: req.body.opts.jobId,
        };
        
        // ...and it is used to add the job to the work queue
        const job: Job<ScannerJob> = await workQueue.add({
            directory: req.body.directory,
            opts: {
                jobId: req.body.opts.jobId
            }
        }, jobOpts);
        
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
    const id: Queue.JobId = req.params.id;
    const job: Job<ScannerJob> | null = await workQueue.getJob(id);

    if (job === null) {
        res.status(404).json({
            "Message": "No such job in the work queue"
        });
    } else {
        const state: string = await job.getState();
        const finishedOn: number | undefined = job.finishedOn;
        if (state === "completed") {
            const result: string = job.returnvalue?.result;
            res.status(200).json({
                id: job.id, 
                state, 
                data: job.data,
                finishedOn,
                result: result ? JSON.parse(result) : undefined
            });
        } else {
            res.status(200).json({
                id: job.id,
                state,
                finishedOn
            });
        }
    }
});

// Node: Query statuses of all active/waiting jobs in the work queue
router.get("/jobs", async(_req: Request, res: Response) => {
    const jobs: Job<ScannerJob>[] = await workQueue.getJobs(["active", "waiting", "completed", "failed"]);
    const jobList: JobInfo[] = [];

    for (const job of jobs) {
        const state: string = await job.getState();
        const data: ScannerJob = job.data;
        const finishedOn: number | undefined = job.finishedOn;
        jobList.push({
            id: job.id,
            state,
            data: data,
            finishedOn
        });
    }
    res.status(200).json(jobList);
});

// Listen to global job events

workQueue.on("global:waiting", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "is waiting");
    await postJobStatus(jobId, "waiting");
})

workQueue.on("global:active", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "is active");
    await postJobStatus(jobId, "active");
})

workQueue.on("global:resumed", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "has been resumed");
    await postJobStatus(jobId, "resumed");
})

workQueue.on("global:stalled", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "has stalled");
    await postJobStatus(jobId, "stalled");
})

workQueue.on("global:failed", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "has failed");
    await postJobStatus(jobId, "failed");
})

workQueue.on("global:completed", async (jobId: Queue.JobId, result: string) => {
    console.log("Job", jobId, "has been completed");
    await postJobStatus(jobId, "completed", result);
})

// Job cleanup from the queue
const cleanQueue = async (): Promise<void> => {
    const cleanupInterval: number = milliseconds.days(5);
    try {
        await workQueue.clean(cleanupInterval, "completed");
        await workQueue.clean(cleanupInterval, "failed");
        console.log("Job queue cleanup done!");
    }
    catch (error) {
        console.log(error);
    }
}
void cleanQueue();

// Create a request to send the job status to DOS
const createRequest = (id: Queue.JobId, state: string, result?: string): RequestInit => {

    let requestBody: RequestBody = {
        id: id,
        name: "Scanner Agent",
        state: state,
        result: undefined // Initialize result as undefined
      };

    if (result !== undefined) {
        // TODO: Parse the result type-safely
        const parsedResult: ParsedResult = JSON.parse(result, (_key: string, value: string | undefined) => {
            if (typeof value === "string") {
              try {
                return JSON.parse(value) as string | undefined;
              } catch (error) {
                return value;
              }
            }
            return value;
        }) as ParsedResult;
      
        const scanresult: string = parsedResult.result;
        //console.log(scanresult);
        requestBody = {
            ...requestBody,
            result: scanresult
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
const postJobStatus = async (id: Queue.JobId, status: string, result?: string): Promise<string | undefined> => {
    const request: RequestInit = createRequest(id, status, result);
    try {
        const response: globalThis.Response = await fetch(postStatusUrl, request);
        const data: string | undefined = await response.json() as string | undefined;
        console.log("Response from DOS:", data);
        return data;
    } catch (error) {
        console.log("Error:", error);
    }
}

export default router;