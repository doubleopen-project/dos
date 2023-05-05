// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { S3 } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client'

export const client: S3 = s3Client;

export * from "./s3Operations";