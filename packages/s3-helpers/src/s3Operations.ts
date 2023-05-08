// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// All needed file operations for Digital Ocean Spaces


import {
    ListBucketsCommand,
    ListObjectsCommand,
    ListObjectsCommandInput,
    PutObjectCommand,
    PutObjectCommandInput,
    GetObjectCommand,
    ListBucketsCommandOutput,
    ListObjectsCommandOutput,
    PutObjectCommandOutput,
    ListObjectsV2CommandOutput,
    _Object,
    GetObjectCommandOutput,
    HeadObjectCommand,
    HeadObjectCommandOutput
} from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';
import * as fs from 'fs';
import * as path from 'path';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// List all buckets in the account
export const listBuckets = async (): Promise<string | undefined> => {
    try {
        const data: ListBucketsCommandOutput = await s3Client.send(new ListBucketsCommand({}));
        return JSON.stringify(data.Buckets);
    } catch (err) {
        console.log("Error trying to return a list of S3 buckets", err);
    }
};

// List all objects (files, directories) in a bucket
export const listObjects = async (bucketName: string): Promise<string | undefined> => {
    const bucketParams: ListObjectsCommandInput = { Bucket: bucketName };
    try {
        const data: ListObjectsCommandOutput = await s3Client.send(new ListObjectsCommand(bucketParams));
        return JSON.stringify(data.Contents);
    } catch (err) {
        console.log("Error trying to return a list of S3 bucket objects", err);
    }
};

// Upload a file to a bucket
export const uploadFile = async (bucketName: string, fileName: string, fileContent: string): Promise<string | undefined> => {
    const uploadParams: PutObjectCommandInput = { Bucket: bucketName, Key: fileName, Body: fileContent };
    try {
        const data: PutObjectCommandOutput = await s3Client.send(new PutObjectCommand(uploadParams));
        //console.log("Success uploadFile():" + " uploaded " + fileName + " to " + bucketName);
        return JSON.stringify(data);
    } catch (err) {
        console.log("Error trying to upload a file to S3 bucket", err);
    }
}

// Download an entire directory of files from a bucket to a local directory
export const downloadDirectory = async (bucketName: string, dirS3: string, baseDir: string): Promise<string> => {

    // Don't try to retrieve from an empty directory
    if (await isDirectoryEmpty(bucketName, dirS3)) {
        console.log("Error: trying to download an empty or non-existing directory from S3");
        return "error";
    }

    // Retrieve a list of all files in the directory
    let files: _Object[] = [];
    try {
        const listObjectsV2Result: ListObjectsV2CommandOutput = await s3Client.listObjectsV2({
            Bucket: bucketName,
            Prefix: dirS3
        });
        files = listObjectsV2Result.Contents || [];
    } catch (err) {
        console.log("Error: listing files in a directory", err);
        return "error";
    }

    // Download the S3 directory to a local directory
    await Promise.all(files.map(async (file: _Object) => {
        const filePath: string = path.join(baseDir, file.Key || "");
        const dirPath: string = path.dirname(filePath);

        // Create the local directory if it does not exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Function to turn the file's body into a string
        const streamToString = (stream: any): Promise<unknown> => {
            const chunks: any[] = [];
            return new Promise((resolve, reject) => {
                stream.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
            });
        }

        // Download the file and write it to the local directory
        await (async (): Promise<"error" | undefined> => {
            try {
                const response: GetObjectCommandOutput = await s3Client.send(new GetObjectCommand({
                    Bucket: bucketName,
                    Key: file.Key
                }));
                const bodyContents: unknown = await streamToString(response.Body);
                fs.writeFileSync(filePath, bodyContents as string);
            } catch (err) {
                console.log("Error: downloading a file", err);
                return "error";
            }
        })();
    }));
    return "success";
}

// Is a S3 directory empty?
const isDirectoryEmpty = async (bucketName: string, directoryName: string): Promise<boolean> => {
    const listObjectsV2Result: ListObjectsV2CommandOutput = await s3Client.listObjectsV2({
        Bucket: bucketName,
        Prefix: directoryName,
        MaxKeys: 2
    });
    // If the directory is empty, the KeyCount will be 1 (the directory itself)
    // If the directory does not exist, the KeyCount will be 0
    if (listObjectsV2Result.KeyCount === 2) {
        return false;
    } else {
        return true;
    }
}

// Check if object exists in bucket
export const objectExistsCheck = async (key: string): Promise<boolean | undefined> => {

    checkS3ClientEnvs();

    if (!process.env.SPACES_BUCKET) {
        throw new Error("SPACES_BUCKET environment variable is missing");
    }

    try {
        const bucket: string = process.env.SPACES_BUCKET;

        const headObjCommand: HeadObjectCommand = new HeadObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const objectResponse: HeadObjectCommandOutput = await s3Client.send(headObjCommand);

        if (objectResponse.$metadata.httpStatusCode === 200) {
            return true;
        }

        console.log("Object storage status code is: ", objectResponse.$metadata.httpStatusCode);
        return undefined;

    } catch (error) {
        // An error is thrown when "await s3Client.send(headObjCommand)" responds with $metadata httpStatusCode 404
        // So this is the case that the object does not exist
        const typedError: expectedError = error as expectedError;

        if(typedError && typedError.$metadata && typedError.$metadata.httpStatusCode) {
            if (typedError.$metadata.httpStatusCode === 404) {
                return false;
            }
        }

        console.log(error);
        
        return undefined;
    }
}

interface expectedError {
    $fault: string,
    $metadata: {
        httpStatusCode: number,
        requestId: string,
        extendedRequestId: string | undefined,
        cfId: string | undefined,
        attempts: number,
        totalRetryDelay: number
    }
}

// Get presigned put url
export const getPresignedPutUrl = async (key: string): Promise<string | undefined> => {
    checkS3ClientEnvs();

    if (!process.env.SPACES_BUCKET) {
        throw new Error("SPACES_BUCKET environment variable is missing");
    }

    try {
        const bucket: string = process.env.SPACES_BUCKET;

        const command: PutObjectCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const url: string = await getSignedUrl(s3Client, command);
        return url;

    } catch (error) {

        console.log(error);
        return undefined;
    }
};

const checkS3ClientEnvs = (): void => {
    if (!process.env.SPACES_ENDPOINT) {
        throw new Error("SPACES_ENDPOINT environment variable is missing");
    }
    if (!process.env.SPACES_KEY) {
        throw new Error("SPACES_KEY environment variable is missing");
    }
    if (!process.env.SPACES_SECRET) {
        throw new Error("SPACES_SECRET environment variable is missing");
    }
}
