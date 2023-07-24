// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi, makeErrors } from "@zodios/core";
import * as schemas from "./schemas/scanner_agent_schemas";

const errors = makeErrors([
    {
        status: 500,
        description: "Internal server error",
        schema: schemas.ErrorSchema
    },
    {
        status: 400,
        description: "Bad request",
        schema: schemas.ErrorSchema
    },
    {
        status: 401,
        description: "No token provided",
        schema: schemas.ErrorSchema
    },
    {
        status: 403,
        description: "Token is invalid",
        schema: schemas.ErrorSchema
    },
    {
        status: 404,
        description: "No such job in the work queue",
        schema: schemas.ErrorSchema
    }
]);

export const scannerAgentApi = makeApi([
    {
        method: "get",
        path: "/",
        description: "Root endpoint",
        response: schemas.ScannerRootResponseSchema,
        errors
    },
    {
        method: "get",
        path: "/jobs",
        description: "List all jobs",
        response: schemas.ScannerJoblistResponseBodySchema,
        errors
    },
    {
        method: "post",
        path: "/job",
        description: "Add scanner job",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.ScannerJobRequestBodySchema
            }
        ],
        response: schemas.ScannerJobResponseBodySchema,
        errors
    },
    {
        method: "get",
        path: "/job/:id",
        description: "Get scanner job status",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: schemas.ScannerJobInfoRequestSchema
            }
        ],
        response: schemas.ScannerJobInfoResponseBodySchema,
        errors
    },
]);