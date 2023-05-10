// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/*
eslint-disable @typescript-eslint/no-misused-promises
*/

import Queue from "bull";
import throng from "throng";
import { spawn } from "child_process";
import { downloadDirectory } from "s3-helpers";

// Base directory for ScanCode input files
const baseDir: string = "/tmp/scanjobs/";

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://localhost:6379";

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
        console.log("New scan job directory to create: ", dir);

        // Try to download the directory from S3 and check if it was successful
        const downloadSuccess: string = await downloadDirectory("doubleopen2", job.data.directory, baseDir);
        if (downloadSuccess !== "success") {
            console.log("Failed to download directory from S3");
            job.update("failed"); // Update job status
            throw new Error("Failed to download directory from S3");
        } else {
            console.log("Successfully downloaded directory from S3");
        }
        
        // Spawn a child process to run ScanCode inside this container

        const options = [
            "-clp",
            "--json-pp",
            "-",
            dir
        ];
        
        try {
            const childProcess = spawn("scancode", options);
            
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
                console.log("Error:", error);
                job.update("failed"); // Update job status
            }
            
            // await for the child process to exit
            const exitCode: number = await new Promise((resolve, reject) => {
                childProcess.on("close", resolve);
            });

            if (exitCode !== 0) {
                job.update("failed"); // Update job status
                throw new Error(`Subprocess error exit ${exitCode}, ${error}`);
            }

            parsedResult = JSON.parse(result);
            job.update("completed");

            return {
                parsedResult
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }); 
}

// Initialise the clustered worker process
throng({ workers: WORKERS, start: start });