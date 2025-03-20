// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const QueryParamSortOrder = z.enum(["asc", "desc"]);

export const contract = c.router({
    getPackages: {
        method: "GET",
        path: "/v1/packages",
        summary: "Get all packages",
        query: z.object({
            pageSize: z.coerce.number().default(10),
            pageIndex: z.coerce.number().default(0),
            sortBy: z
                .enum([
                    "purl",
                    "name",
                    "version",
                    "type",
                    "namespace",
                    "createdAt",
                    "updatedAt",
                ])
                .default("updatedAt"),
            sortOrder: QueryParamSortOrder.default("desc"),
        }),
        responses: {
            200: z.object({
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
            }),
        },
    },
});
