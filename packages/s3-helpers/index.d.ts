// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as _aws_sdk_client_s3 from "@aws-sdk/client-s3";
import { S3Client as S3Client$1 } from "@aws-sdk/client-s3";

declare const downloadFile: (
    s3Client: S3Client$1,
    bucketName: string,
    fileName: string,
    filePath: string,
) => Promise<boolean>;
declare const objectExistsCheck: (
    s3Client: S3Client$1,
    bucketName: string,
    key: string,
) => Promise<boolean | undefined>;
declare const getPresignedPutUrl: (
    s3Client: S3Client$1,
    bucketName: string,
    key: string,
) => Promise<string | undefined>;
declare const getPresignedGetUrl: (
    s3Client: S3Client$1,
    bucketName: string,
    key: string,
) => Promise<string | undefined>;
declare const uploadFile: (
    s3Client: S3Client$1,
    bucketName: string,
    fileName: string,
    fileContent: string | Buffer,
) => Promise<string | undefined>;
declare const saveFilesWithHashKey: (
    s3Client: S3Client$1,
    bucketName: string,
    fileHashesAndPaths: Array<{
        hash: string;
        path: string;
    }>,
    baseDir: string,
    jobId: string,
    jobStateMap: Map<string, string>,
) => Promise<boolean>;
declare const deleteFile: (
    s3Client: S3Client$1,
    bucketName: string,
    fileName: string,
) => Promise<boolean>;

declare const S3Client: (
    forcePathStyle: boolean,
    endpoint?: string,
    key?: string,
    secret?: string,
    region?: string,
) => _aws_sdk_client_s3.S3Client;

export {
    S3Client,
    deleteFile,
    downloadFile,
    getPresignedGetUrl,
    getPresignedPutUrl,
    objectExistsCheck,
    saveFilesWithHashKey,
    uploadFile,
};
