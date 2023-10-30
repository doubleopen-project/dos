// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";
import { passwordStrength } from "check-password-strength";

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
