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
    packageName: z.string(),
    packageVersion: z.string(),
    packageRegistry: z.string(),
    ortVersion: z.string().optional().nullable(),
    scancodeVersion: z.string().optional().nullable(),
})