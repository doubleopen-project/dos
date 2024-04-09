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
        path: "/users",
        description: "Create user",
        alias: "CreateUser",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostUsersReq,
            },
        ],
        response: schemas.PostUsersRes,
        errors,
    },
    {
        method: "delete",
        path: "/users/:id",
        description: "Delete user",
        alias: "DeleteUser",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.DeleteUserRes,
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
