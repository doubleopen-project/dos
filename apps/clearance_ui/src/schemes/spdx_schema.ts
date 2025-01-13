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
                // Disable eslint rule for unused variable as the error needs to be caught, but not used.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                return false;
            }
        },
        { message: "Invalid SPDX expression" },
    )
    .or(z.enum(["", "NONE", "NOASSERTION"]));
