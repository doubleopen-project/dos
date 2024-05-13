// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ZodiosError } from "@zodios/core";
import { isAxiosError } from "axios";
import { ZodError } from "zod";

export const getErrorMessage = (error: unknown) => {
    let msg = "";

    if (error instanceof ZodiosError) {
        if (error.cause instanceof ZodError) {
            for (const err of error.cause.errors) {
                msg +=
                    "Error in field '" + err.path + "': " + err.message + "\n";
            }
        } else {
            msg = error.cause?.message || error.message;
        }
    } else if (isAxiosError(error)) {
        msg = error.response?.data.message;
        if (!msg || msg.trim() === "") {
            msg = error.message;
        }
    } else if (error instanceof Error) {
        msg = error.message;
    } else {
        msg = "An unknown error occurred.";
    }
    return msg;
};
