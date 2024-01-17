// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import { errors } from "../errors";
import * as schemas from "../schemas/admin_schemas";

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
        method: "post",
        path: "/purl-cleanup",
        description: "Remove old purl bookmarks",
        response: schemas.PostPurlCleanupRes,
        errors,
    },
]);
