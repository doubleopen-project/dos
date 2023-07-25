// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { S3 } from '@aws-sdk/client-s3';

declare const listBuckets: () => Promise<string | undefined>;
declare const listObjects: (bucketName: string) => Promise<string | undefined>;
declare const downloadFile: (bucketName: string, fileName: string, filePath: string) => Promise<boolean>;
declare const downloadDirectory: (bucketName: string, dirS3: string, baseDir: string) => Promise<string>;
declare const objectExistsCheck: (key: string) => Promise<boolean | undefined>;
declare const getPresignedPutUrl: (key: string) => Promise<string | undefined>;
declare const uploadFile: (bucketName: string, fileName: string, fileContent: string | Buffer) => Promise<string | undefined>;
declare const saveFiles: (filePaths: string[], baseDir: string) => Promise<boolean>;
declare const saveFilesWithHashKey: (fileHashesAndPaths: Array<{
    hash: string;
    path: string;
}>, baseDir: string) => Promise<boolean>;

declare const client: S3;

export { client, downloadDirectory, downloadFile, getPresignedPutUrl, listBuckets, listObjects, objectExistsCheck, saveFiles, saveFilesWithHashKey, uploadFile };
