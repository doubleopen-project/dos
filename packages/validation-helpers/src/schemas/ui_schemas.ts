// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const loginFormSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const userDataFormSchema = z.object({
    username: z.string(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
});
