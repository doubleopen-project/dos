// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

export const DBScannerJobSchema = z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    state: z.string(),
    ortVersion: z.string().optional().nullable(),
    scancodeVersion: z.string().optional().nullable(),
    duration: z.number().optional().nullable(),
    scanStartTS: z.coerce.date().optional().nullable(),
    scanEndTS: z.coerce.date().optional().nullable(),
    spdxLicenseListVersion: z.string().optional().nullable()
})

export type DBScannerJobType = z.infer<typeof CreateScannerJobSchema>

const CreateScannerJobSchema = z.object({
    state: z.string()
})

export type CreateScannerJobInput = z.infer<typeof CreateScannerJobSchema>

export const DBFileSchema = z.object({
    id: z.number(),
    sha256: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    scanned: z.boolean().optional(),
    scannerJobId: z.string().optional()
})

const CreateFileSchema = z.object({
    data: z.object({
        sha256: z.string(),
        scanned: z.boolean().optional(),
        scannerJobId: z.string().optional()
    })
})

export type CreateFileInput = z.infer<typeof CreateFileSchema>

const EditScannerJobSchema = z.object({
    id: z.string({
        required_error: 'Id is required'
    }),
    data: z.object({
        state: z.string().optional(),
        scannerName: z.string().optional(),
        scannerVersion: z.string().optional(),
        duration: z.number().optional(),
        scanStartTS: z.date().optional(),
        scanEndTS: z.date().optional(),
        spdxLicenseListVersion: z.string().optional(),
    })
})

export type EditScannerJobInput = z.infer<typeof EditScannerJobSchema>

const EditFileSchema = z.object({
    id: z.number({
        required_error: 'Id is required'
    }),
    data: z.object({
        scanned: z.boolean().optional(),
        scannerJobId: z.string().optional()
    })
})

export type EditFileInput = z.infer<typeof EditFileSchema>

const CreateLicenseFindingSchema = z.object({
    data: z.object({
        scanner: z.string(),
        licenseExpression: z.string(),
        startLine: z.number(),
        endLine: z.number(),
        score: z.number(),
        sha256: z.string()
    })
})

export type CreateLicenseFindingInput = z.infer<typeof CreateLicenseFindingSchema>