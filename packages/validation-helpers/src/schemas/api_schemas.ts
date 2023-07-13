// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';
import { DBScannerJobSchema } from './db_schemas';
import { ScannerJobResultSchema } from './scanner_agent_schemas';

export const ApiPostScanResultsRequestBodySchema = z.object({
    //TODO: edit accordingly when implementing the scan-results endpoint
    purl: z.string({
        required_error: 'Purl is required'
    })
})

export const ApiPostScanResultsResponseBodySchema = z.object({
    //TODO: edit accordingly when implementing the scan-results endpoint
    results: z.union([
        z.string(), 
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

export const ApiPostPackageRequestBodySchema = z.object({
    zipFileKey: z.string({
        required_error: 'Zip file key is required'
    })
})

export const ApiPostPackageResponseBodySchema = z.object({
    folderName: z.string()
})

export const ApiPostJobRequestBodySchema = z.object({
    directory: z.
        string({
            required_error: 'Directory is required'
        })
        .trim()
        .min(1, 'Directory cannot be empty')
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

export const ApiGetJobStateRequestSchema = z.string({
	required_error: "Scan job ID is required"
})

export const ApiGetJobStateResponseBodySchema = z.object({
    state: z.string()
})
