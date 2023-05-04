// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3client: S3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    forcePathStyle: false,
    credentials: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

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
