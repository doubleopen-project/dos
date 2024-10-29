// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// This is the Digital Ocean Spaces S3 client

import https from "https";
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

export const getS3Client = (
    forcePathStyle: boolean,
    endpoint?: string,
    key?: string,
    secret?: string,
    region?: string,
): S3Client => {
    return new S3Client({
        forcePathStyle: forcePathStyle,
        endpoint: endpoint || "http://localhost:9000",
        region: region || "us-east-1",
        credentials: {
            accessKeyId: key || "miniouser",
            secretAccessKey: secret || "miniopassword",
        },
        requestHandler: new NodeHttpHandler({
            httpsAgent: new https.Agent({
                keepAlive: true,
                maxSockets: 200,
            }),

            requestTimeout: 15000,
            connectionTimeout: 6000,
        }),
    });
};
