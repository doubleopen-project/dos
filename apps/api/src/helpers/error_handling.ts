// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Prisma } from "database";
import { dbErrorCodeResMessagesMap } from "./db_error_codes";
import * as dbQueries from "./db_queries";

export const getErrorCodeAndMessage = async (
    error: unknown,
): Promise<{ statusCode: number; message: string }> => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const errorObject = dbErrorCodeResMessagesMap.get(error.code);
        if (errorObject) {
            if (errorObject.requiresAction || errorObject.requiresTracking) {
                try {
                    await dbQueries.createSystemIssue({
                        message: errorObject.message,
                        severity: errorObject.severity || "UNKNOWN",
                        errorCode: error.code,
                        errorType: error.name,
                        details: error.stack,
                        info: JSON.stringify(error),
                    });
                    // Disable eslint rule for unused variable as the error needs to be caught, but not used.
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (err) {
                    console.log(
                        "Error: Unable to create system issue for database error: " +
                            error.code,
                    );
                }
            }
            return {
                statusCode: 500,
                message: "Internal server error. " + errorObject.message,
            };
        } else {
            return {
                statusCode: 500,
                message:
                    "Internal server error. Issue with database connection or query.",
            };
        }
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
        return {
            statusCode: 500,
            message:
                "Internal server error. Issue with Prisma client initialization.",
        };
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        return {
            statusCode: 500,
            message:
                "Internal server error. Prisma client needs to be restarted.",
        };
    } else if (
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientValidationError
    ) {
        return {
            statusCode: 500,
            message:
                "Internal server error. Issue with database connection or query.",
        };
    } else if (error instanceof Error) {
        return {
            statusCode: 500,
            message: "Internal server error. " + error.message,
        };
    }
    return { statusCode: 500, message: "Internal server error" };
};
