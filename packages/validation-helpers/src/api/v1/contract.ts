// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const c = initContract();

const queryParamSortOrder = z.enum(["asc", "desc"]);

const error = z.object({
    message: z.string(),
});

const errors = {
    401: error,
    403: error,
    500: error,
};

//https://ts-rest.com/docs/core/#query-parameters
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
            sortOrder: queryParamSortOrder.default("desc"),
            name: z
                .string()
                .optional()
                .openapi({ description: "Filter by name (substring match)" }),
            namespace: z.string().optional().openapi({
                description: "Filter by namespace (substring match)",
            }),
            version: z.string().optional().openapi({
                description: "Filter by version (substring match)",
            }),
            type: z
                .string()
                .optional()
                .openapi({ description: "Filter by type (substring match)" }),
            purl: z
                .string()
                .optional()
                .openapi({ description: "Filter by purl (substring match)" }),
            createdAtGte: z.coerce.date().optional().openapi({
                description:
                    "Refine results to include only entries created on or after the specified date",
            }),
            createdAtLte: z.coerce.date().optional().openapi({
                description:
                    "Refine results to include only entries created on or before the specified date",
            }),
            updatedAtGte: z.coerce.date().optional().openapi({
                description:
                    "Refine results to include only entries updated on or after the specified date",
            }),
            updatedAtLte: z.coerce.date().optional().openapi({
                description:
                    "Refine results to include only entries updated on or before the specified date",
            }),
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
            ...errors,
        },
    },
});
