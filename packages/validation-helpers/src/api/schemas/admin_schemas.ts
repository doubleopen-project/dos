// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";
import { getPasswordSchema, getUsernameSchema } from "./common_schemas";

//---------------- DELETE scan-results ----------------

export const DeleteScanResultsReq = z.object({
    purl: z.string({
        required_error: "Purl is required",
    }),
});

export const DeleteScanResultsRes = z.object({
    message: z.string(),
});

//------------------- POST users -------------------

export const PostUsersReq = z.object({
    username: getUsernameSchema(true),
    password: getPasswordSchema(true),
    passwordIsTemporary: z.boolean().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
    dosApiToken: z.string().optional(),
});

export const PostUsersRes = z.object({
    id: z.string().uuid(),
    username: z.string(),
    dosApiToken: z.string().optional(),
    realmRoles: z.array(z.string()),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
    requiredActions: z.array(z.string()).optional(),
});

//------------------- DELETE user -------------------

export const DeleteUserRes = z.object({
    message: z.string(),
});

//----------------- POST purl-cleanup ----------------

export const PostPurlCleanupReq = z.object({
    options: z
        .object({
            dryRun: z.boolean().optional(),
            pkgNameStartsWith: z.string().optional(),
            allPhases: z.boolean().optional(),
            transferPathExclusions: z.boolean().optional(),
            transferBulkConclusions: z.boolean().optional(),
            changeContextPurls: z.boolean().optional(),
            deleteOldPurlBookmarks: z.boolean().optional(),
        })
        .optional(),
});

export const PostPurlCleanupRes = z.object({
    message: z.string(),
    optionDescriptions: z.object({
        dryRun: z.string(),
        pkgNameStartsWith: z.string(),
        allPhases: z.string(),
        transferPathExclusions: z.string(),
        transferBulkConclusions: z.string(),
        changeContextPurls: z.string(),
        deleteOldPurlBookmarks: z.string(),
    }),
});

//------------------ GET packages -------------------
export const QueryParamSortPkgBy = z
    .enum([
        "purl",
        "name",
        "version",
        "type",
        "namespace",
        "createdAt",
        "updatedAt",
    ])
    .optional();

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

//---------------- GET distinct user IDs ----------------

export const GetDistinctUsersForItemsRes = z.object({
    users: z.array(
        z.object({ id: z.string(), username: z.string().optional() }),
    ),
});
