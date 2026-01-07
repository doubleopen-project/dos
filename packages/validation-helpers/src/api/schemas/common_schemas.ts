// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { passwordStrength } from "check-password-strength";
import { PackageURL } from "packageurl-js";
import { z } from "zod";

export const getUsernameSchema = (required: boolean) => {
    const requiredObject = required
        ? { required_error: "Username is required" }
        : undefined;

    return z
        .string(requiredObject)
        .trim()
        .min(1, "Username cannot be empty")
        .max(20, "Username cannot be longer than 20 characters")
        .refine((username) => !username.includes(" "), {
            message: "Username cannot contain spaces",
        })
        .refine((username) => username.match(/^[a-z0-9]+$/i), {
            message:
                "Username must be alphanumeric ie. contain only letters and numbers",
        })
        .refine(
            (username) =>
                username.toLowerCase() !== "admin" &&
                username.toLowerCase() !== "root",
            {
                message: "The chosen username is not allowed",
            },
        );
};

export const getPasswordSchema = (required: boolean) => {
    const requiredObject = required
        ? { required_error: "Password is required" }
        : undefined;
    return z
        .string(requiredObject)
        .trim()
        .min(8, "Password has to be at least 8 characters long")
        .refine((password) => passwordStrength(password).id > 1, {
            message: "Password is too weak",
        });
};

export const sha256Schema = (required: boolean) => {
    const requiredObject = required
        ? { required_error: "Sha256 is required" }
        : undefined;
    return z
        .string(requiredObject)
        .trim()
        .min(64, "Sha256 has to be 64 characters long")
        .max(64, "Sha256 has to be 64 characters long")
        .refine((sha256) => sha256.match(/^[a-f0-9]+$/i), {
            message: "Sha256 must be hexadecimal",
        });
};

export const purlSchema = (required: boolean) => {
    const requiredObject = required
        ? { required_error: "Purl is required" }
        : undefined;
    return z
        .string(requiredObject)
        .trim()
        .min(1, "Purl cannot be empty")
        .refine(
            (purl) => {
                try {
                    PackageURL.fromString(
                        purl.replace(/%2F/g, "/").replace(/\/@/g, "/%40"),
                    );
                    return true;
                    // Disable eslint rule for unused variable as the error needs to be caught, but not used.
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    return false;
                }
            },
            { message: "Purl is not valid" },
        );
};

//------------------ Common path params -------------------

export const PathParamIdInteger = z.number({
    required_error: "Id is required",
});

export const PathParamString = (name: string) =>
    z.string({
        required_error: `${name} is required`,
    });

export const PathParamSha256 = z.string({
    required_error: "Sha256 is required",
});

export const PathParamPurl = z.string({
    required_error: "Purl is required",
});

export const PathParamUuid = z
    .string({
        required_error: "Id is required",
    })
    .uuid();

//------------------ Common query params -------------------

export const QueryParamFilterValue = z.string().optional();
export const QueryParamPageSize = z.number().optional();
export const QueryParamPageIndex = z.number().optional();
export const QueryParamSortOrder = z.enum(["asc", "desc"]).optional();
export const QueryParamFilterDate = z.coerce.date().optional();
export const QueryParamFilterBoolean = z.boolean().optional();
export const QueryParamFilterInt = z.number().optional();

export const QueryParamFilterListOfInts = z
    // Accept either a string or a number (to handle cases where the input is a single number)
    .preprocess((v) => {
        if (typeof v === "number") return String(v);
        if (typeof v === "string") return v.trim();
        return v;
    }, z.string())
    // Validate that the string is a comma-separated list of integers
    .refine(
        (value) =>
            value
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean)
                .every((p) => /^\d+$/.test(p)),
        { message: "Expected comma-separated integers, e.g. '1,2,3'" },
    )
    // Transform the validated string into an array of integers
    .transform((value) =>
        value
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
            .map(Number),
    )
    .optional();

//------------------ Common response body -------------------

export const GetCountRes = z.object({
    count: z.number(),
});

export const EmptyResponse = z.void();
