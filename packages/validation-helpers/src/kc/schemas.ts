// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const GetAccessTokenResponse = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_expires_in: z.number(),
    refresh_token: z.string(),
    token_type: z.literal("Bearer"),
    "not-before-policy": z.number(),
    session_state: z.string(),
    scope: z.string(),
});

export const GetAccessTokenReq = z.union([
    z.object({
        client_id: z.string(),
        username: z.string(),
        password: z.string(),
        grant_type: z.literal("password"),
        client_secret: z.string(),
    }),
    z.object({
        client_id: z.string(),
        grant_type: z.literal("refresh_token"),
        refresh_token: z.string(),
        client_secret: z.string().optional(),
    }),
]);

export const LogoutUserResponse = z.object({
    message: z.string(),
});
