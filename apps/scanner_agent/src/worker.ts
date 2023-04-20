// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* This is a first reference implementation of a Bull messaging queue worker.
   Eventually this will be the one running ScanCode background processes.
*/

import Queue from "bull";
import throng from "throng";

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// How many workers for ScanCode
const WORKERS = process.env.WEB_CONCURRENCY || 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 10;

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const start = () => {
    
    // Connect to the named work queue
    let workQueue = new Queue("scanner", REDIS_URL);

    workQueue.process(maxJobsPerWorker, async (job) => {

        // A dummy example job for the worker
        let progress: number = 0;
        while (progress < 100) {
            sleep(50);
            progress++;
            job.progress(progress);
        }
        return {
            value: "This will be stored."
        }
    });

}

// Initialise the clustered worker process
throng({
    workers: WORKERS, 
    start
});