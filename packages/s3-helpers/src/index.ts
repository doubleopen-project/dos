// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { getS3Client, type S3 } from "./s3Client";

export const S3Client = getS3Client;
export * from "./s3Operations";
export type { S3 };
