// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// All needed file operations for Digital Ocean Spaces

import * as fs from "fs";
import { writeFile } from "fs/promises";
import * as path from "path";
import { Readable } from "stream";
import {
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    GetObjectCommand,
    GetObjectCommandOutput,
    GetObjectRequest,
    HeadObjectCommand,
    HeadObjectCommandOutput,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Download a file from a bucket
export const downloadFile = async (
    s3Client: S3Client,
    bucketName: string,
    fileName: string,
    filePath: string,
): Promise<boolean> => {
    const downloadParams: GetObjectRequest = {
        Bucket: bucketName,
        Key: fileName,
    };

    try {
        // Check if the file exists in the bucket
        if (await objectExistsCheck(s3Client, bucketName, fileName)) {
            const response: GetObjectCommandOutput = await s3Client.send(
                new GetObjectCommand(downloadParams),
            );

            // Check that response.Body is a readable stream
            if (response.Body instanceof Readable) {
                const readableStream: Readable = response.Body as Readable;

                const dirPath: string = path.dirname(filePath);

                // Create the local directory if it does not exist
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }

                await writeFile(filePath, readableStream);
                return true;
            } else {
                console.log("Not Readable");
                throw new Error("Error: file stream is not readable");
            }
        } else {
            console.log("Error: no such file in object storage");
            throw new Error("Error: no such file in object storage");
        }
    } catch (err) {
        console.log(
            "Error trying to download a file from S3Client bucket",
            err,
        );
        return false;
    }
};

// Check if object exists in bucket
export const objectExistsCheck = async (
    s3Client: S3Client,
    bucketName: string,
    key: string,
): Promise<boolean | undefined> => {
    try {
        const headObjCommand: HeadObjectCommand = new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const objectResponse: HeadObjectCommandOutput =
            await s3Client.send(headObjCommand);

        if (objectResponse.$metadata.httpStatusCode === 200) {
            return true;
        }

        console.log(
            "Object storage status code is: ",
            objectResponse.$metadata.httpStatusCode,
        );
        return undefined;
    } catch (error) {
        // An error is thrown when "await s3Client.send(headObjCommand)" responds with $metadata httpStatusCode 404
        // So this is the case that the object does not exist
        const typedError: expectedError = error as expectedError;

        if (
            typedError &&
            typedError.$metadata &&
            typedError.$metadata.httpStatusCode
        ) {
            if (typedError.$metadata.httpStatusCode === 404) {
                return false;
            }
        }

        console.log(error);

        return undefined;
    }
};

interface expectedError {
    $fault: string;
    $metadata: {
        httpStatusCode: number;
        requestId: string;
        extendedRequestId: string | undefined;
        cfId: string | undefined;
        attempts: number;
        totalRetryDelay: number;
    };
}

// Get presigned put url
export const getPresignedPutUrl = async (
    s3Client: S3Client,
    bucketName: string,
    key: string,
): Promise<string | undefined> => {
    try {
        const command: PutObjectCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const url: string = await getSignedUrl(s3Client, command);
        return url;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

// Get presigned get url
export const getPresignedGetUrl = async (
    s3Client: S3Client,
    bucketName: string,
    key: string,
): Promise<string | undefined> => {
    try {
        const command: GetObjectCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const url: string = await getSignedUrl(s3Client, command);
        return url;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

// The testCounter is used to test the retry functionality
//let testCounter = 0;

// Upload a file to a bucket
export const uploadFile = async (
    s3Client: S3Client,
    bucketName: string,
    fileName: string,
    fileContent: string | Buffer,
): Promise<string | undefined> => {
    const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
    };
    try {
        //if (testCounter > 16) {
        //    throw new Error("Test error");
        //}
        const data: PutObjectCommandOutput = await s3Client.send(
            new PutObjectCommand(uploadParams),
        );
        //testCounter++;
        //console.log("Success uploadFile():" + " uploaded " + fileName + " to " + bucketName);
        return JSON.stringify(data);
    } catch (err) {
        console.log("Error trying to upload a file to S3Client bucket", err);
        //testCounter++;
        throw new Error("Error trying to upload a file to S3Client bucket");
    }
};

// Upload files to a bucket with their hash as the key
export const saveFilesWithHashKey = async (
    s3Client: S3Client,
    bucketName: string,
    fileHashesAndPaths: Array<{ hash: string; path: string }>,
    baseDir: string,
    jobId: string,
    jobStateMap: Map<string, string>,
): Promise<boolean> => {
    try {
        let i = 1;
        console.time(jobId + ": Uploading files took");

        const UL_CONCURRENCY =
            parseInt(process.env.UL_CONCURRENCY as string) || 10;
        const uploadPromises = [];

        for (const file of fileHashesAndPaths) {
            const uploadTask = (async () => {
                let retries = parseInt(process.env.UL_RETRIES as string) || 3;
                const retryInterval =
                    parseInt(process.env.UL_RETRY_INTERVAL as string) || 1000;
                let uploadSuccess = false;
                while (!uploadSuccess && retries > 0) {
                    try {
                        // Upload file to S3Client
                        const fileBuffer: Buffer = fs.readFileSync(
                            baseDir + file.path,
                        );
                        await uploadFile(
                            s3Client,
                            bucketName,
                            file.hash,
                            fileBuffer,
                        );
                        uploadSuccess = true;
                    } catch (error) {
                        console.log(error);
                        retries--;
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryInterval),
                        );
                    }
                }
                if (!uploadSuccess) {
                    throw (
                        "Failed to upload file " +
                        file.path +
                        " to bucket " +
                        bucketName
                    );
                }
            })();

            uploadPromises.push(uploadTask);

            if (uploadPromises.length >= UL_CONCURRENCY) {
                await Promise.all(uploadPromises);
                uploadPromises.length = 0;
            }

            jobStateMap.set(
                jobId,
                `Uploading files (${i}/${fileHashesAndPaths.length})`,
            );

            i++;
        }

        if (uploadPromises.length > 0) {
            await Promise.all(uploadPromises);
        }

        console.timeEnd(jobId + ": Uploading files took");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Delete a file from a bucket
export const deleteFile = async (
    s3Client: S3Client,
    bucketName: string,
    fileName: string,
): Promise<boolean> => {
    try {
        const deleteParams: DeleteObjectCommandInput = {
            Bucket: bucketName,
            Key: fileName,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
