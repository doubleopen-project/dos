// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import { errors } from "../errors";
import * as schemas from "../schemas/admin_schemas";
import * as commonSchemas from "../schemas/common_schemas";

export const adminAPI = makeApi([
    {
        method: "delete",
        path: "/scan-results",
        description:
            "Delete scan results and other data for specified purl. Doesn't delete files and related data if files are in other packages",
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
        alias: "AddUser",
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
        path: "/user/:id",
        description: "Delete user",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: schemas.DeleteUserReqParamId,
            },
        ],
        response: schemas.DeleteUserRes,
        errors,
    },
    {
        method: "put",
        path: "/user/:id",
        description: "Update user",
        alias: "updateUser",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.UpdateUserReq,
            },
        ],
        response: schemas.UpdateUserRes,
        errors,
    },
    {
        method: "post",
        path: "/purl-cleanup",
        description:
            "Remove old purl bookmarks. Get detailed descriptions of options by making this query with an empty body.",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostPurlCleanupReq,
            },
        ],
        response: schemas.PostPurlCleanupRes,
        errors,
    },
]);
