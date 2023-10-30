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
    message: z.string(),
});

//------------------- DELETE user -------------------

export const DeleteUserReqParamId = z.number({
    required_error: "Id is required",
});

export const DeleteUserRes = z.object({
    message: z.string(),
});
