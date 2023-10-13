// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const loginFormSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const curationFormSchema = z.object({
    fileSha256: z.string(),
    detectedLicenseExpressionSPDX: z.string().optional(),
    concludedLicenseExpressionSPDX: z.string(),
    comment: z.string().optional(),
    contextPurl: z.string(),
});

export type CurationFormType = z.infer<typeof curationFormSchema>;
