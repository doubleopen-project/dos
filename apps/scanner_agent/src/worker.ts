// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Queue, { Job } from "bull";
import throng from "throng";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { downloadDirectory } from "s3-helpers";
import { loadEnv } from 'common-helpers';

//////////////////////////
// Environment variables
//////////////////////////

loadEnv("../../.env");

// Base directory for ScanCode input files
const baseDir = "/tmp/scanjobs/";

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://localhost:6379";

// How many workers for ScanCode
const WORKERS: number = process.env.WEB_CONCURRENCY? parseInt(process.env.WEB_CONCURRENCY) : 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 10;

//////////////////////////
// Interfaces and types
//////////////////////////

// Scan job with its parameters
type ScannerJob = {
    directory: string;
}

//////////////////////////
// Module implementation
//////////////////////////

const start = (): void => {
    
    console.log(Date() + ": Worker is alive");

    // Connect to the named work queue
    const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);

    workQueue.process(maxJobsPerWorker, async (job: Job<ScannerJob>) => {

        console.log("-> processing job: ", job.id, " with data: ", job.data);

        const jobDirectory = String(job.data.directory);
        const dir: string = baseDir + jobDirectory;
        console.log("-> create new temp directory for scanjob: ", dir);

        // Try to download the directory from S3 and check if it was successful
        const downloadSuccess: string = await downloadDirectory("doubleopen2", jobDirectory, baseDir);
        if (downloadSuccess !== "success") {
            console.log("Failed to download directory from S3");
            throw new Error("Failed to download directory from S3");
        } else {
            console.log("-> successfully downloaded directory from S3");
        }
        
        // Spawn a child process to run ScanCode inside this container

        const options: string[] = [
            "-clp",
            //"-v",
            "-q",
            "--json",
            "-",
            dir
        ];
        
        try {
            const childProcess: ChildProcessWithoutNullStreams = spawn("scancode", options);
            
            // await for output from the child process
            let result = "";
            for await (const chunk of childProcess.stdout as AsyncIterable<Buffer | string>) {
                result += chunk.toString();
            }

            // await for errors from the child process
            let error = "";
            for await (const chunk of childProcess.stderr) {
                error += chunk;
                console.log("Error:", error);
            }

            // await for the child process to exit
            const exitCode: number = await new Promise<number>((resolve) => {
                childProcess.on("close", resolve);
            });

            if (exitCode !== 0) {
                throw new Error(`Subprocess error exit ${exitCode}, ${error}`);
            }

            // Remove the local directory from the container after the job is completed
            try {
                spawn("rm", ["-rf", dir]);
                console.log("-> local directory removed: ", dir);
            } catch (error) {
                console.log("Error removing the local directory: ", error);
            }
            
            console.log("-> completed job: ", job.id, " with data: ", job.data);

            return {
                result
            }

        } catch (error) {
            console.log("Error:", error);
        }
    }); 
}

// Initialise the clustered worker process
throng({ workers: WORKERS, start: start }).catch((error: string) => {
    console.log("Scanner Worker: Throng error:", error);
});