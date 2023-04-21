// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* This is a first reference implementation of a Bull messaging queue worker.
   Eventually this will be the one running ScanCode background processes.
*/

/*
eslint-disable @typescript-eslint/no-misused-promises
*/

import Queue from "bull";
import throng from "throng";

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://127.0.0.1:6379";

// How many workers for ScanCode
const WORKERS: number = process.env.WEB_CONCURRENCY? parseInt(process.env.WEB_CONCURRENCY) : 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker: number = 10;

const sleep = async (ms: number): Promise<unknown> => {
    return new Promise((resolve)  => setTimeout(resolve, ms));
}

const start = (): void => {
    
    // Connect to the named work queue
    const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);

    workQueue.process(maxJobsPerWorker, async (job: Queue.Job) => {

        // A dummy example job for the worker
        let progress: number = 0;
        while (progress < 100) {
            await sleep(100);
            progress++;
            await job.progress(progress);
            console.log("Process id: ", job.id, " progress: ", progress);
        }
        return {
            value: "This will be stored."
        }
    });

    workQueue.on("completed", job => {
        console.log("Job", job.id, "completed with result", job.returnvalue);
    });

}

// Initialise the clustered worker process
throng({
    workers: WORKERS, 
    start
});