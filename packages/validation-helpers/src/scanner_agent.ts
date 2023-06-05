// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import * as schemas from "./schemas/scanner_agent_schemas";

export const scannerAgentApi = makeApi([
    {
        method: "get",
        path: "/",
        description: "Root endpoint",
        response: schemas.ScannerRootResponseSchema,
        errors: [
            {
                status: 500,
                description: "Internal server error",
                schema: schemas.ErrorSchema
            }
        ]
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
        errors: [
            {
                status: 500,
                description: "Internal server error",
                schema: schemas.ErrorSchema
            },
            {
                status: 400,
                description: "Bad request",
                schema: schemas.ErrorSchema
            }
        ]
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
        errors: [
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
                status: 404,
                description: "No such job in the work queue",
                schema: schemas.ErrorSchema
            }
        ]
    },
]);