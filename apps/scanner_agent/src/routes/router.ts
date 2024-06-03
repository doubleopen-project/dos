// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import Queue, { Job } from "bull";
import fetch from "cross-fetch";
import { scannerAgentApi } from "validation-helpers";
//import milliseconds from "milliseconds";
import { authenticateAPIToken } from "../helpers/auth_helpers";

const router = zodiosRouter(scannerAgentApi);

//////////////////////////
// Environment variables
//////////////////////////

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL || "redis://localhost:6379";
const REDIS_PW: string = process.env.REDIS_PW || "redis";

// URL address and node of DOS to send job status updates to
const dosUrl: string = process.env.DOS_URL || "http://localhost:5000/api/";
const postStateUrl: string = dosUrl + "job-state/";
const postResultsUrl: string = dosUrl + "job-results";

// Token for communicating with DOS API
const SA_API_TOKEN: string = process.env.SA_API_TOKEN || "token";

// Create/connect to a named work queue
const workQueue: Queue.Queue<ScannerJob> = new Queue("scanner", REDIS_URL, {
    redis: { password: REDIS_PW },
});

//////////////////////////
// Interfaces and types
//////////////////////////

// Information about the file to be scanned
type ScannedFile = {
    hash: string;
    path: string;
};

// Options for ScanCode
type ScanCodeOptions = {
    timeout: number;
};

// Scan job with its parameters
type ScannerJob = {
    jobId: string;
    options: ScanCodeOptions;
    files: ScannedFile[];
};

// Job return information
interface JobInfo {
    id: string;
    state: string;
    finishedOn: number | undefined;
}

// Send the job state to DOS
interface RequestBodyState {
    state: string;
}

// Send the job results to DOS
interface RequestBodyResults {
    id: Queue.JobId;
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
router.get("/", (_req, res) => {
    res.status(200).json({
        message: "Scanner Agent is up and listening!",
    });
    return;
});

// Node: POST a new scanner job
router.post("/job", authenticateAPIToken, async (req, res) => {
    // Job details are in the request body

    try {
        // Unique job ID is given by DOS
        const jobOpts = {
            jobId: req.body.jobId,
        };

        // Add the job to the work queue
        await workQueue.add(
            {
                jobId: req.body.jobId,
                options: req.body.options,
                files: req.body.files,
            },
            jobOpts,
        );

        res.status(201).json({
            id: req.body.jobId,
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            error: "Error in POST /job",
        });
    }
});

// Node: Query job details for job [id]
router.get("/job/:id", authenticateAPIToken, async (req, res) => {
    const id = req.params.id;
    const job: Job | null = await workQueue.getJob(id);

    if (job === null) {
        res.status(404).json({
            error: "No such job in the work queue",
        });
    } else {
        const state: string = await job.getState();
        const finishedOn: number | undefined = job.finishedOn;
        if (state === "completed") {
            const result: string = job.returnvalue?.result;
            res.status(200).json({
                id: id,
                state,
                data: job.data,
                finishedOn,
                result: result ? JSON.parse(result) : undefined,
            });
        } else {
            res.status(200).json({
                id: id,
                state,
                finishedOn,
            });
        }
    }
});

// Node: Used by the API to post the results state of job [id] so the job can be removed from the queue
// when results are saved to DB
router.post("/result-state/:id", authenticateAPIToken, async (req, res) => {
    const id = req.params.id;
    const state = req.body.state;
    const job: Job | null = await workQueue.getJob(id);

    if (job === null) {
        res.status(404).json({
            error: "No such job in the work queue",
        });
    } else {
        if (state == "failed") {
            res.status(200).json({
                message:
                    "API failed to process the job results, keeping the job in the queue",
            });
            console.log(
                "Job",
                id,
                ": saving results failed, keeping job in the queue",
            );
        } else if (state == "saved") {
            res.status(200).json({
                message:
                    "API processed the job results, removing the job from the queue",
            });
            await job.remove();
            console.log(
                "Job",
                id,
                ": results saved, job removed from the queue",
            );
        } else {
            res.status(400).json({
                error: "Invalid result state",
            });
        }
    }
});

// Node: Query statuses of all active/waiting jobs in the work queue
router.get("/jobs", authenticateAPIToken, async (_req, res) => {
    const jobs: Job[] = await workQueue.getJobs([
        "active",
        "waiting",
        "completed",
        "failed",
    ]);
    const jobList: JobInfo[] = [];

    for (const job of jobs) {
        const state: string = await job.getState();
        const finishedOn: number | undefined = job.finishedOn;
        jobList.push({
            id: String(job.id),
            state,
            finishedOn,
        });
    }
    res.status(200).json(jobList);
});

// Listen to global job events

workQueue.on("global:waiting", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "is waiting");
    await postJobState(jobId, "waiting");
});

workQueue.on("global:active", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "is active");
    await postJobState(jobId, "active");
});

workQueue.on("global:resumed", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "has been resumed");
    await postJobState(jobId, "resumed");
});

workQueue.on("global:stalled", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "has stalled");
    await postJobState(jobId, "stalled");
});

workQueue.on("global:failed", async (jobId: Queue.JobId) => {
    console.log("Job", jobId, "has failed");
    await postJobState(jobId, "failed");
});

workQueue.on("global:completed", async (jobId: Queue.JobId, result: string) => {
    console.log("Job", jobId, "has been completed");
    const response = await postJobResults(jobId, result);
    if (response === "error") {
        console.log("Job", jobId, "results could not be sent to DOS");
        await postJobState(jobId, "failed");
    }

    /*
    // Remove the job from the queue once completed
    try {
        const job = await workQueue.getJob(jobId);
        await job?.remove();
        console.log("Job", jobId, "has been removed from the queue");
    } catch (error) {
        console.log(error);
    }
    */
});

/*
// All old jobs cleanup from the queue
const cleanQueue = async (): Promise<void> => {
    const cleanupInterval: number = milliseconds.days(1);
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
*/

// Create a request to send the job state to DOS
export const createRequestState = (state: string): RequestInit => {
    const requestBody: RequestBodyState = {
        state: state,
    };

    return {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Charset: "utf-8",
            Authorization: "Bearer " + SA_API_TOKEN,
        },
        body: JSON.stringify(requestBody),
    };
};

// Create a request to send the job results to DOS
export const createRequestResults = (
    id: Queue.JobId,
    result: string,
): RequestInit => {
    let requestBody: RequestBodyResults = {
        id: id,
        result: undefined, // Initialize result as undefined
    };

    if (result !== undefined) {
        // TODO: Parse the result type-safely
        const parsedResult: ParsedResult = JSON.parse(
            result,
            (_key: string, value: string | undefined) => {
                if (typeof value === "string") {
                    try {
                        return JSON.parse(value) as string | undefined;
                    } catch (error) {
                        return value;
                    }
                }
                return value;
            },
        ) as ParsedResult;

        const scanresult: string = parsedResult.result;
        requestBody = {
            ...requestBody,
            result: scanresult,
        };
    }

    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Charset: "utf-8",
            Authorization: "Bearer " + SA_API_TOKEN,
        },
        body: JSON.stringify(requestBody),
    };
};

// Send the job state to DOS
const postJobState = async (
    id: Queue.JobId,
    state: string,
): Promise<string | undefined> => {
    const request: RequestInit = createRequestState(state);
    try {
        const response: globalThis.Response = await fetch(
            postStateUrl + id,
            request,
        );
        const data: string | undefined = (await response.json()) as
            | string
            | undefined;
        //console.log("Response from DOS:", data);
        return data;
    } catch (error) {
        console.log("Error:", error);
    }
};

// Send the job results to DOS
const postJobResults = async (
    id: Queue.JobId,
    result: string,
): Promise<string | undefined> => {
    const request: RequestInit = createRequestResults(id, result);
    try {
        const response: globalThis.Response = await fetch(
            postResultsUrl,
            request,
        );
        let data: string | undefined = "error";
        if (response.ok) {
            data = (await response.json()) as string | undefined;
        }
        //console.log("Response from DOS:", data);
        return data;
    } catch (error) {
        console.log("Error:", error);
    }
};

export default router;
