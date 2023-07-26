// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Queue, { Job } from "bull";
import throng from "throng";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { downloadFile } from "s3-helpers";
import { loadEnv, getCurrentDateTime } from 'common-helpers';
import { rimraf } from "rimraf";
import * as path from 'path';

//////////////////////////
// Environment variables
//////////////////////////

loadEnv("../../.env");

// Base directory for ScanCode input files
const baseDir = "/tmp/scanjobs";

// Connect to Heroku-provided URL on Heroku and local redis instance locally
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL : "redis://localhost:6379";

// How many workers for ScanCode
const WORKERS: number = process.env.WEB_CONCURRENCY? parseInt(process.env.WEB_CONCURRENCY) : 1;

// Spaces bucket
const SPACES_BUCKET: string = process.env.SPACES_BUCKET? process.env.SPACES_BUCKET : "doubleopen2";

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 10;

//////////////////////////
// Interfaces and types
//////////////////////////

// Information about the file to be scanned
type ScannedFile = {
    hash: string;
    path: string;
}

// Scan job with its parameters
type ScannerJob = {
    jobId: string;
    files: ScannedFile[];
}

//////////////////////////
// Module implementation
//////////////////////////

const start = (): void => {
    
    console.log(getCurrentDateTime() + ": Worker is alive");

    // Connect to the named work queue
    const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);

    workQueue.process(maxJobsPerWorker, async (job: Job<ScannerJob>) => {

        console.log("*** ",  getCurrentDateTime(), " New scanner job arrived: ", job.id);
        //console.log("-> job data: ", job.data);

        const jobIdDir = String(job.id);
        const localJobDir = path.join(baseDir, jobIdDir);
        console.log("-> create new local directory for scanjob: ", localJobDir);

        // Try to download the files from S3 and check if it was successful
        for (const file of job.data.files) {
            const downloadSuccess: boolean = await downloadFile(SPACES_BUCKET, file.hash, path.join(localJobDir, file.path));
            if (downloadSuccess === false) {
                console.log("Failed to download file", file, "from S3");
                throw new Error("Failed to download file from S3");   
            }
        }
        
        // Spawn a child process to run ScanCode inside this container
        const options: string[] = [
            "-clp",
            //"-v",
            "-i",
            "-q",
            "--json",
            "-",
            localJobDir
        ];

        const childProcess: ChildProcessWithoutNullStreams = spawn("scancode", options);
        
        const pid = childProcess.pid;
        console.log(`[${pid}] process spawned for job: ${job.id}`);
        
        let result = "";
        childProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        let error = "";
        childProcess.stderr.on("data", (data) => {
            error += data.toString();
            console.log(`[${pid}] process error: ${error}`);
        });

        const processPromise = new Promise<{ result: string }>((resolve, reject) => {
            childProcess.on("exit", (code) => {
              console.log(`[${pid}] process exited with code: ${code}`);
              handleProcessExit()
                .then(() => resolve({result}))
                .catch((error) => reject(error));
            });
          });
      
        async function handleProcessExit(): Promise<void> {
            try {
                try {
                    await removeDirectory(localJobDir);
                    console.log(`[${pid}] process local directory removed: ${localJobDir}`);
                } catch (error) {
                    console.log(`[${pid}] process error removing the local directory: ${error}`);
                }
            } finally {
                console.log(`[${pid}] process completed job: ${job.id}`);
            }
        }
        
        function removeDirectory(dir: string): Promise<boolean> {
            return rimraf(dir);
        }

        // Finally, return the result of the ScanCode process
        return processPromise;
    });
}

// Initialise the clustered worker process
throng({ workers: WORKERS, start: start }).catch((error: string) => {
    console.log("Scanner Worker: Throng error:", error);
});