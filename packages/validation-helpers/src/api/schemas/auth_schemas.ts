// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

//------------------ POST login/password -------------------

export const PostLoginPasswordReq = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    })
})

export const PostLoginPasswordRes = z.object({})

//------------------- POST logout --------------------

export const PostLogoutRes = z.object({
    message: z.string()
})
