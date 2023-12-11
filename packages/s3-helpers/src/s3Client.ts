// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// This is the Digital Ocean Spaces S3 client

import { S3 } from "@aws-sdk/client-s3";

export const getS3Client = (
    forcePathStyle: boolean,
    endpoint?: string,
    key?: string,
    secret?: string,
): S3 => {
    return new S3({
        forcePathStyle: forcePathStyle,
        endpoint: endpoint || "http://localhost:9000",
        region: "us-east-1",
        credentials: {
            accessKeyId: key || "miniouser",
            secretAccessKey: secret || "miniopassword",
        },
    });
};
