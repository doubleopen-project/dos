// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import isGlob from "is-glob";
import { z } from "zod";
import { validateCurlyBracesInGlob } from "../helpers/validateCurlyBracesInGlob";

export const bcPatternGlobSchema = z
    .string({ required_error: "Pattern is required" })
    .min(1, "Pattern cannot be empty")
    .refine(
        (pattern) => {
            // Check if the pattern is a valid glob or matches a single file in a filepath:
            //   ([.\w-]+\/)* matches zero or more occurrences of a ".", "-", "\w" characters (directory) followed by a slash
            //   [.\w-]+ matches the file name with ".", "-", or "\w" allowed
            //   (\.\w+)? makes the file extension part optional
            return (
                isGlob(pattern) || /^([.\w-]+\/)*[.\w-]+(\.\w+)?$/.test(pattern)
            );
        },
        {
            message:
                "Pattern is not a valid glob pattern or a single file path",
        },
    )
    .refine((pattern) => pattern !== "**", {
        message: "You cannot do a bulk conclusion for all files in a package",
    });

export const pePatternGlobSchema = z
    .string({ required_error: "Pattern is required" })
    .min(1, "Pattern cannot be empty")
    .refine(
        (pattern) => {
            // Check that the pattern is a valid glob or matches a single file in a filepath:
            //   ([.\w-]+\/)* matches zero or more occurrences of a ".", "-", "\w" characters (directory) followed by a slash
            //   [.\w-]+ matches the file name with ".", "-", or "\w" allowed
            //   (\.\w+)? makes the file extension part optional
            return (
                isGlob(pattern) || /^([.\w-]+\/)*[.\w-]+(\.\w+)?$/.test(pattern)
            );
        },
        {
            message:
                "Pattern is not a valid glob pattern or a single file path",
        },
    )
    .refine(
        (pattern) => {
            // Check that whenever using curly braces in a glob pattern for path exclusion,
            // it always has a prepending non-empty path.
            return validateCurlyBracesInGlob(pattern);
        },
        {
            message:
                "This pattern cannot unfortunately be used at this stage. Possible reasons: 1) You cannot exclude more than one file from root directory at once; 2) You cannot exclude files from several directories at once",
        },
    )
    .refine((pattern) => pattern !== "**", {
        message: "You cannot do a path exclusion for all files in a package",
    });
