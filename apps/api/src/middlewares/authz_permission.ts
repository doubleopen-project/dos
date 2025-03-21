// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { TsRestRequest } from "@ts-rest/express";
import { NextFunction, Request, Response } from "express";
import { authorizationByPermission } from "keycloak-authorization-services";
import log from "loglevel";
import { contract } from "validation-helpers";

const logLevel: log.LogLevelDesc =
    (process.env.LOG_LEVEL as log.LogLevelDesc) || "info"; // trace/debug/info/warn/error/silent

log.setLevel(logLevel);

export const authzPermission = (permission: {
    resource: string;
    scopes: string[];
}) => {
    const config = {
        baseUrl: process.env.KEYCLOAK_URL!,
        realm: process.env.KEYCLOAK_REALM!,
    };

    const options = {
        permission,
        audience: process.env.KEYCLOAK_CLIENT_ID_API!,
    };

    return async function customAuthorizationMiddleware(
        req: Request | TsRestRequest<typeof contract>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // Call the original authorization middleware with the provided parameters
            await new Promise<void>((resolve, reject) => {
                authorizationByPermission(config, options)(
                    req as Request,
                    res,
                    (error?: unknown) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    },
                );
            });
            log.trace("Permission granted");
            // If the original middleware succeeds, continue to the next middleware/route handler
            next();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Request failed with status code 401") {
                    log.error(error);
                    // If the error message is "Request failed with status code 401", send a 401 response
                    res.status(401).send({
                        message: "Unauthorized. Please check the access token.",
                    });
                } else if (
                    error.message === "Request failed with status code 403"
                ) {
                    log.trace("Permission denied");
                    let message =
                        "Forbidden. You do not have the permission to perform the action or access this resource.";
                    switch (req.method) {
                        case "GET":
                            message =
                                "Forbidden. You do not have the permission to access this resource.";
                            break;
                        case "POST":
                            message =
                                "Forbidden. You do not have the permission to create this resource.";
                            break;
                        case "PUT":
                            message =
                                "Forbidden. You do not have the permission to update this resource.";
                            break;
                        case "DELETE":
                            message =
                                "Forbidden. You do not have the permission to delete this resource.";
                            break;
                    }
                    // If the error message is "Request failed with status code 403", send a 403 response
                    res.status(403).send({
                        message: message,
                    });
                } else {
                    log.error(error);
                    res.status(500).send({
                        message:
                            "Internal server error: Error attempting to validate permission for request",
                    });
                }
            } else {
                log.error(error);
                // If the error not instance of Error, pass it to the next error handler
                res.status(500).send({
                    message:
                        "Internal server error: Error attempting to validate permission for request",
                });
            }
        }
    };
};
