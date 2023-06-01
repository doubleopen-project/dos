// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

export const DBScannerJobSchema = z
.object({
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

const CreateScannerJobSchema = z.object({
    state: z.string()
})

export type CreateScannerJobInput = z.infer<typeof CreateScannerJobSchema>

export const DBFileSchema = z
.object({
  id: z.number(),
  sha256: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
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

const ScannerJobUpdateData = z.object({
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

export type EditScannerJobInput = z.infer<typeof ScannerJobUpdateData>