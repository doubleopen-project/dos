// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const GetPackagesRes = z.object({
    packages: z.array(
        z.object({
            purl: z.string(),
            updatedAt: z.coerce.date(),
            name: z.string(),
            version: z.nullable(z.string()),
            type: z.string(),
            namespace: z.nullable(z.string()),
            qualifiers: z.nullable(z.string()),
            subpath: z.nullable(z.string()),
        }),
    ),
});
