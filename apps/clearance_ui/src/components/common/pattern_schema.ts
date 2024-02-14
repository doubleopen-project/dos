// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import isGlob from "is-glob";
import { z } from "zod";

export const patternGlobSchema = z
    .string()
    .min(1, "Pattern cannot be empty")
    .refine((pattern) => isGlob(pattern), {
        message: "Pattern is not a valid glob pattern",
    })
    .refine((pattern) => pattern !== "**", {
        message: "You cannot do a bulk conclusion for all files in a package",
    });
