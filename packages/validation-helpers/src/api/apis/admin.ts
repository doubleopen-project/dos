// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import * as schemas from "../schemas/admin_schemas";
import { errors } from "../errors";

export const adminAPI = makeApi([
    {
        method: "delete",
        path: "/scan-results",
        description: "Delete scan results for specified purl",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.DeleteScanResultsReq,
            },
        ],
        response: schemas.DeleteScanResultsRes,
        errors,
    },
    {
        method: "post",
        path: "/user",
        description: "Add user",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostUserReq,
            },
        ],
        response: schemas.PostUserRes,
        errors,
    },
    {
        method: "delete",
        path: "/user",
        description: "Delete user",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.DeleteUserReq,
            },
        ],
        response: schemas.DeleteUserRes,
        errors,
    },
]);
