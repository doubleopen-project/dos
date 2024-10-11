// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { S3 } from "@aws-sdk/client-s3";

export { S3 } from "@aws-sdk/client-s3";

declare const listBuckets: (s3Client: S3) => Promise<string | undefined>;
declare const listObjects: (
    s3Client: S3,
    bucketName: string,
) => Promise<string | undefined>;
declare const downloadFile: (
    s3Client: S3,
    bucketName: string,
    fileName: string,
    filePath: string,
) => Promise<boolean>;
declare const downloadDirectory: (
    s3Client: S3,
    bucketName: string,
    dirS3: string,
    baseDir: string,
) => Promise<string>;
declare const objectExistsCheck: (
    s3Client: S3,
    bucketName: string,
    key: string,
) => Promise<boolean | undefined>;
declare const getPresignedPutUrl: (
    s3Client: S3,
    bucketName: string,
    key: string,
) => Promise<string | undefined>;
declare const getPresignedGetUrl: (
    s3Client: S3,
    bucketName: string,
    key: string,
) => Promise<string | undefined>;
declare const uploadFile: (
    s3Client: S3,
    bucketName: string,
    fileName: string,
    fileContent: string | Buffer,
) => Promise<string | undefined>;
declare const saveFilesWithHashKey: (
    s3Client: S3,
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
    s3Client: S3,
    bucketName: string,
    fileName: string,
) => Promise<boolean>;

declare const S3Client: (
    forcePathStyle: boolean,
    endpoint?: string,
    key?: string,
    secret?: string,
    region?: string,
) => S3;

export {
    S3Client,
    deleteFile,
    downloadDirectory,
    downloadFile,
    getPresignedGetUrl,
    getPresignedPutUrl,
    listBuckets,
    listObjects,
    objectExistsCheck,
    saveFilesWithHashKey,
    uploadFile,
};
