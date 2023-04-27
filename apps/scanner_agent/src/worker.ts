// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* This is a first reference implementation of a Bull messaging queue worker.
   Eventually this will be the one running ScanCode background processes.
*/

/*
eslint-disable @typescript-eslint/no-misused-promises
*/

import Queue, { Job } from "bull";
import throng from "throng";
import fetch from "cross-fetch"

interface JobStatusRequest {
    method: string;
    body: string;
}

// URL address and node of DOS to send job status updates to
const dosUrl: string = process.env.DOS_URL? process.env.DOS_URL : "https://localhost:5000/";
const postStatusUrl: string = dosUrl + "jobstatus";

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://127.0.0.1:6379";

// How many workers for ScanCode
const WORKERS: number = process.env.WEB_CONCURRENCY? parseInt(process.env.WEB_CONCURRENCY) : 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker: number = 10;

const sleep = async (s: number): Promise<unknown> => {
    return new Promise((resolve)  => setTimeout(resolve, s*1000));
}

const start = (): void => {
    
    console.log("Worker is alive");

    // Connect to the named work queue
    const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);
    workQueue.process(maxJobsPerWorker, async (job: Queue.Job) => {

        // get a random integer between 1 and max
        const getRandomInt = (max: number): number => {
            return Math.floor(Math.random() * Math.floor(max));
        }

        const maxSleepTime: number = 60; // A dummy job can take at most 60 seconds
        const sleepTime: number = getRandomInt(maxSleepTime);
        console.log("Job", job.id, "is emulating a process that takes", sleepTime, "seconds");
        await sleep(sleepTime);

        return {
            value: "This will be the result of the job"
        }
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
        console.log("Job", jobId, "has been completed with result:", result);
        await postJobStatus(jobId, "completed");
    })
}

// Create a request to send the job status to DOS
const createRequest = (id: number, status: string): JobStatusRequest => {
    return {
        method: "PUT",
        body: JSON.stringify({
            id: id,
            name: "Scanner Agent",
            status: status
        })
    }
}

// Send the job status to DOS
const postJobStatus = async (id: number, status: string): Promise<any> => {
    const request: JobStatusRequest = createRequest(id, status);
    try {
        const response: globalThis.Response = await fetch(postStatusUrl, request);
        const data: unknown = await response.json();
        console.log("Response from DOS:", data);
    } catch (error) {
        console.log("Error:", error);
    }
}

// Initialise the clustered worker process
throng({
    workers: WORKERS, 
    start
});