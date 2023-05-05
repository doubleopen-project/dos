// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// This is the Digital Ocean Spaces S3 client

import { S3 } from '@aws-sdk/client-s3';

export const s3Client: S3 = new S3({
    forcePathStyle: false,
    endpoint: process.env.SPACES_ENDPOINT,
    region: "us-east-1",
    credentials: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        accessKeyId: process.env.SPACES_KEY!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secretAccessKey: process.env.SPACES_SECRET!
    }
});