// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { makeErrors } from "@zodios/core";
import z from "zod";

export const errors = makeErrors([
    {
        status: 400,
        description: "Bad request",
        schema: z.object({
            error: z.string(),
        }),
    },
]);

export const createUserErrors = makeErrors([
    {
        status: 409,
        description: "User with this username already exists",
        schema: z.object({
            error: z.string(),
        }),
    },
]);
