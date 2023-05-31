// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';
import { DBScannerJobSchema } from './db_schemas';
import { ScannerJobResultSchema } from './scanner_job_result_schema';

export const ApiPostScanResultsRequestBodySchema = z.object({
    //TODO: edit accordingly when implementing the scan-results endpoint
})

export const ApiPostScanResultsResponseBodySchema = z.object({
    //TODO: edit accordingly when implementing the scan-results endpoint
    Message: z.string()
})

export const ApiPostUploadUrlRequestBodySchema = z.object({
    key: z.string({
        required_error: 'Key is required'
    })
        .trim()
        .min(1, 'Key cannot be empty'),
})

export const ApiPostUploadUrlResponseBodySchema = z.object({
    success: z.boolean(),
    presignedUrl: z.string().optional(),
    message: z.string().optional()
})

export const ApiPostJobRequestBodySchema = z.object({
    directory: z.
        string({
            required_error: 'Directory is required'
        })
        .trim()
        .min(1, 'Directory cannot be empty'),
})

export const ApiPostJobResponseBodySchema = z.object({
    scannerJob: DBScannerJobSchema,
    message: z.string()
})

export const ApiPutJobStateRequestBodySchema = z.object({
    id: z.
        string({
            required_error: 'Id is required'
        })
        .trim()
        .min(1, 'Id cannot be empty'),
    state: z.
        string({
            required_error: 'State is required'
        })
        .trim()
        .min(1, 'State cannot be empty')
})

export const ApiPutJobStateResponseBodySchema = z.object({
    editedScannerJob: DBScannerJobSchema,
    message: z.string()
})

export const ApiPostJobResultsRequestBodySchema = z.object({
    id: z.
        string({
            required_error: 'Id is required'
        })
        .trim()
        .min(1, 'Id cannot be empty'),
    result: ScannerJobResultSchema
})

export const ApiPostJobResultsResponseBodySchema = z.object({
    message: z.string()
})

export const ErrorSchema = z.object({
    message: z.string()
})