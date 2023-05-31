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