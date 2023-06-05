// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import * as schemas from "./schemas/scanner_agent_schemas";

export const scannerAgentApi = makeApi([
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
    }
]);