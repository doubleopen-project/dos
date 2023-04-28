// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// All needed file operations for Digital Ocean Spaces

import { ListBucketsCommand, 
    ListObjectsCommand, 
    ListObjectsCommandInput, 
    PutObjectCommand, 
    PutObjectCommandInput,
    GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../models/s3Client';
import * as fs from 'fs';
import * as path from 'path';

// List all buckets in the account
export const listBuckets = async (): Promise<string | undefined> => {
    try {
        const data = await s3Client.send(new ListBucketsCommand({}));
        return JSON.stringify(data.Buckets);
    } catch (err) {
        console.log("Error trying to return a list of S3 buckets", err);
    }
};

// List all objects (files, directories) in a bucket
export const listObjects = async (bucketName: string): Promise<string | undefined> => {
    const bucketParams: ListObjectsCommandInput = { Bucket: bucketName };
    try {
        const data = await s3Client.send(new ListObjectsCommand(bucketParams));
        return JSON.stringify(data.Contents);
    } catch (err) {
        console.log("Error trying to return a list of S3 bucket objects", err);
    }
}; 

// Upload a file to a bucket
export const uploadFile = async (bucketName: string, fileName: string, fileContent: string): Promise<string | undefined> => {
    const uploadParams: PutObjectCommandInput = { Bucket: bucketName, Key: fileName, Body: fileContent };
    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        //console.log("Success uploadFile():" + " uploaded " + fileName + " to " + bucketName);
        return JSON.stringify(data);
    } catch (err) {
        console.log("Error trying to upload a file to S3 bucket", err);
    }
}

// Download an entire directory of files from a bucket to a local directory
export const downloadDirectory = async (bucketName: string, directoryName: string): Promise<string | undefined> => {
    
    // Don't try to retrieve from an empty directory
    if (await isDirectoryEmpty(bucketName, directoryName)) {
        return "Error: S3 directory " + directoryName + " is empty or non-existing";
    }
    
    // Retrieve a list of all files in the directory
    let files: any[] = [];
    try {
        const listObjectsV2Result = await s3Client.listObjectsV2({
            Bucket: bucketName,
            Prefix: directoryName
        });
        files = listObjectsV2Result.Contents || [];
        console.log(files);
    } catch (err) {
        console.log("Error: listing files in a directory", err);
    }

    // Download the S3 directory to a local directory
    const localDirectory = "/tmp/scanjobs/";
    await Promise.all(files.map(async (file) => {
        const filePath = path.join(localDirectory, file.Key || "");
        const dirPath = path.dirname(filePath);
        
        // Create the local directory if it does not exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Function to turn the file's body into a string
        const streamToString = (stream: any) => {
            const chunks: any[] = [];
            return new Promise((resolve, reject) => {
                stream.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
            });
        }

        // Download the file and write it to the local directory
        (async () => {
            try {
                const response = await s3Client.send(new GetObjectCommand({
                    Bucket: bucketName,
                    Key: file.Key
                }));
                const bodyContents = await streamToString(response.Body);
                fs.writeFileSync(filePath, bodyContents as string);
            } catch (err) {
                console.log("Error: downloading a file", err);
            }
        })();
    }));
    return "Success: downloaded directory " + directoryName + " from S3";
}

// Is a S3 directory empty?
const isDirectoryEmpty = async (bucketName: string, directoryName: string): Promise<boolean> => {
    const listObjectsV2Result = await s3Client.listObjectsV2({
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
