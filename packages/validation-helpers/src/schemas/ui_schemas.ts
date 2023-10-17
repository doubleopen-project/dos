// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const loginFormSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;
