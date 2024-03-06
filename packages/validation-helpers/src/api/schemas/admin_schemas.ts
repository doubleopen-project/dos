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

//-------------------- POST user --------------------

export const PostUserReq = z.object({
    username: getUsernameSchema(true),
    password: getPasswordSchema(true),
    role: z.enum(["ADMIN", "USER"]).optional(),
    subscription: z.enum(["SILVER", "GOLD"]).optional(),
    token: z.string().optional(),
});

export const PostUserRes = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["ADMIN", "USER"]),
    subscription: z.enum(["SILVER", "GOLD"]),
    token: z.string(),
});

//------------------- DELETE user -------------------

export const DeleteUserReqParamId = z.number({
    required_error: "Id is required",
});

export const DeleteUserRes = z.object({
    message: z.string(),
});

//------------------- PUT user -------------------

export const UpdateUserReq = z.object({
    kcUserId: z.string().uuid(),
});

export const UpdateUserRes = z.object({
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
