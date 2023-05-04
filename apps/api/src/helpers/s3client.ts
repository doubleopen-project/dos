// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3client = (): S3Client => {
    if(!process.env.S3_ENDPOINT) {
        throw new Error("S3_ENDPOINT environment variable is missing");
    }
    if(!process.env.S3_REGION) {
        throw new Error("S3_REGION environment variable is missing");
    }
    if(!process.env.S3_ACCESS_KEY_ID) {
        throw new Error("S3_ACCESS_KEY_ID environment variable is missing");
    }
    if(!process.env.S3_SECRET_ACCESS_KEY) {
        throw new Error("S3_SECRET_ACCESS_KEY environment variable is missing");
    }

    return new S3Client({
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: false,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
}

export const getPresignedPutUrl = async (key: string, bucket: string, client: S3Client): Promise<string | undefined> => {
    try {
        //TODO: Check that the object doesn't already exist
        const command: PutObjectCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        const url: string = await getSignedUrl(client, command);
        return url;
        
    } catch (error) {
        console.log(error);
        return undefined;
    }
};
