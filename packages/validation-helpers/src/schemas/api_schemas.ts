// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';
import { DBScannerJobSchema } from './db_schemas';
import { ScannerJobResultSchema } from './scanner_agent_schemas';

//---------------- POST scan-results ----------------

export const PostScanResultsReq = z.object({
    purl: z.string({
        required_error: 'Purl is required'
    })
})

export const PostScanResultsRes = z.object({
    state: z.object({
        status: z.string(),
        id: z.nullable(z.string()),
    }),
    results: z.union([
        z.null(),
        z.object({
            licenses: z.array(z.object({
                license: z.string(),
                location: z.object({
                    path: z.string(),
                    start_line: z.number(),
                    end_line: z.number(),
                }),
                score: z.number(),
            })),
            copyrights: z.array(z.object({
                statement: z.string(),
                location: z.object({
                    path: z.string(),
                    start_line: z.number(),
                    end_line: z.number(),
                }),
            })),
        })
    ]),
})

//---------------- DELETE scan-results ----------------

export const DeleteScanResultsReq = z.object({
    purl: z.string({
        required_error: 'Purl is required'
    })
})

export const DeleteScanResultsRes = z.object({
    message: z.string()
})

//---------------- POST upload-url ----------------

export const PostUploadUrlReq = z.object({
    key: z.string({
        required_error: 'Key is required'
    })
        .trim()
        .min(1, 'Key cannot be empty'),
})

export const PostUploadUrlRes = z.object({
    success: z.boolean(),
    presignedUrl: z.string().optional(),
    message: z.string().optional()
})

//---------------- POST package ----------------

export const PostPackageReq = z.object({
    zipFileKey: z.string({
        required_error: 'Zip file key is required'
    })
        .trim()
        .min(1, 'Zip file key cannot be empty'),
    purl: z.string({
        required_error: 'Purl is required'
    })
        .trim()
        .min(1, 'Purl cannot be empty'),
})

export const PostPackageRes = z.object({
    packageId: z.number()
})

//---------------- POST job ----------------

export const PostJobReq = z.object({
    packageId: z.number({
        required_error: 'Package ID is required'
    })
})

export const PostJobRes = z.object({
    scannerJobId: z.string(),
    message: z.string()
})

//---------------- GET job-state ----------------

export const GetJobStateReq = z.string({
    required_error: "Scan job ID is required"
})

export const GetJobStateRes = z.object({
    state: z.string()
})

//---------------- PUT job-state ----------------

export const PutJobStateReq = z.object({
    state: z.
        string({
            required_error: 'State is required'
        })
        .trim()
        .min(1, 'State cannot be empty')
})

export const PutJobStateReqPathParams = z.string({
    required_error: "Scan job ID is required"
})

export const PutJobStateRes = z.object({
    message: z.string()
})

//---------------- POST job-results ----------------

export const PostJobResultsReq = z.object({
    id: z.
        string({
            required_error: 'Id is required'
        })
        .trim()
        .min(1, 'Id cannot be empty'),
    result: ScannerJobResultSchema
})

export const PostJobResultsRes = z.object({
    message: z.string()
})

//---------------- Error schema ----------------

export const ErrorSchema = z.object({
    message: z.string()
})