// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Request } from 'express';

export interface CustomRequest<T> extends Request {
    body: T
}

export interface ScannerJobInt {
    id: number | string;
    name: string;
    state: string;
    result?: string;
}

export interface PresignedUrlRequest {
    key: string;
}

export interface NewScannerJobRequest {
    directory: string;
    packageName: string;
    packageVersion: string;
    packageRegistry: string;
}

export interface ScannerAgentJobResponse {
    id: number | string,
    data: {
        directory: string;
    }
}