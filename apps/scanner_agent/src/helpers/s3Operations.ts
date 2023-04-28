// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// All needed file operations for Digital Ocean Spaces

import { ListBucketsCommand, ListObjectsCommand, ListObjectsCommandInput, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { s3Client } from '../models/s3Client';

// List all buckets in the account
export const listBuckets = async (): Promise<string | undefined> => {
    try {
        const data = await s3Client.send(new ListBucketsCommand({}));
        //console.log("Success listBuckets():", data.Buckets);
        return JSON.stringify(data.Buckets);
    } catch (err) {
        console.log("Error: trying to return a list of S3 buckets", err);
    }
};

// List all objects (files, directories) in a bucket
export const listObjects = async (bucketName: string): Promise<string | undefined> => {
    const bucketParams: ListObjectsCommandInput = { Bucket: bucketName };
    try {
        const data = await s3Client.send(new ListObjectsCommand(bucketParams));
        //console.log("Success listObjects():", data.Contents);
        return JSON.stringify(data.Contents);
    } catch (err) {
        console.log("Error: trying to return a list of S3 bucket objects", err);
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
        console.log("Error: trying to upload a file to S3 bucket", err);
    }
}

