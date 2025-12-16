// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { parseSPDX } from "spdx-validation";
import { z } from "zod";

export const concludedLicenseExpressionSPDXSchema = z
    .string()
    .refine(
        (value) => {
            try {
                parseSPDX(value);
                return true;
            } catch (e) {
                return false;
            }
        },
        { message: "Invalid SPDX expression" },
    )
    .or(z.enum(["", "NONE", "NOASSERTION"]));
