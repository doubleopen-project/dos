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
import fetch from "cross-fetch";
import { spawn } from "child_process";
import { downloadDirectory } from "s3-helpers";

// URL address and node of DOS to send job status updates to
const dosUrl: string = process.env.DOS_URL? process.env.DOS_URL : "https://localhost:5000/";
const postStatusUrl: string = dosUrl + "jobstatus";

// Base directory for ScanCode input files
const baseDir: string = "/tmp/scanjobs/";

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://127.0.0.1:6379";

// How many workers for ScanCode
const WORKERS: number = process.env.WEB_CONCURRENCY? parseInt(process.env.WEB_CONCURRENCY) : 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker: number = 10;

const start = (): void => {
    
    console.log("Worker is alive");

    // Connect to the named work queue
    const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);

    workQueue.process(maxJobsPerWorker, async (job: Queue.Job) => {

        const dir: string = baseDir + job.data.directory;

        // Try to download the directory from S3 and check if it was successful
        const downloadSuccess: string = await downloadDirectory("doubleopen2", job.data.directory, baseDir);
        if (downloadSuccess !== "success") {
            job.update("failed"); // Update job status
            throw new Error(`Failed to download directory from S3`);
        }
    
        // Spawn a child process to run ScanCode, using Docker

        const options = [
            "run", 
            "--rm",
            "-v",
            `${dir}:/scanjob:ro`,
            //"scancode-toolkit", 
            "docker.io/etsija/scancode:latest",
            "-clp",
            "--json-pp",
            "-",
            "/scanjob"
        ];
        const childProcess = spawn("docker", options);

        // await for output from the child process
        let result: string = "";
        let parsedResult: string = "";
        for await (const chunk of childProcess.stdout) {
            result += chunk.toString();
        }

        // await for errors from the child process
        let error: string = "";
        for await (const chunk of childProcess.stderr) {
            error += chunk;
            job.update("failed"); // Update job status
        }
        
        // await for the child process to exit
        const exitCode: number = await new Promise((resolve, reject) => {
            childProcess.on("close", resolve);
        });

        if (exitCode !== 0) {
            job.update("failed"); // Update job status
            throw new Error(`subprocess error exit ${exitCode}, ${error}`);
        }

        parsedResult = JSON.parse(result);
        job.update("completed");

        return {
            parsedResult
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
        await postJobStatus(jobId, "completed", result);
    })
}

// Create a request to send the job status to DOS
const createRequest = (id: number, status: string, result?: string): RequestInit => {
    return {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            name: "Scanner Agent",
            status: status,
            result: result
        })
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

// Initialise the clustered worker process
throng({ workers: WORKERS, start: start });