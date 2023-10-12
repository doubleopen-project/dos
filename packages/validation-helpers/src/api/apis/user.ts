// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import * as schemas from "../schemas/user_schemas";
import { errors } from "../errors";

export const userAPI = makeApi([
    {
        method: "get",
        path: "/user",
        description: "Get user",
        alias: "GetUser",
        response: schemas.GetUserRes,
        errors,
    },
    {
        method: "post",
        path: "/license-conclusion",
        description: "Add a new license conclusion",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostLicenseConclusionReq,
            },
        ],
        response: schemas.PostLicenseConclusionRes,
        errors,
    },
    {
        method: "put",
        path: "/license-conclusion/:id",
        description: "Update a license conclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: schemas.PutLicenseConclusionReqPathParams,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PutLicenseConclusionReq,
            },
        ],
        response: schemas.PutLicenseConclusionRes,
        errors,
    },
    {
        method: "delete",
        path: "/license-conclusion/:id",
        description: "Delete a license conclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: schemas.DeleteLicenseConclusionReqPathParams,
            },
        ],
        response: schemas.DeleteLicenseConclusionRes,
        errors,
    },
    {
        method: "post",
        path: "/filetree",
        alias: "GetFileTree",
        description: "Get file tree for specified purl",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostFileTreeReq,
            },
        ],
        response: schemas.PostFileTreeRes,
        errors,
    },
    {
        method: "get",
        path: "/packages",
        description: "Get packages",
        response: schemas.GetPackagesRes,
        errors,
    },
    {
        method: "post",
        path: "/file",
        alias: "GetFileData",
        description:
            "Get file download url, findings and conclusions. If sha256 is not provided, it will be searched by purl and path.",
        immutable: true,
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostFileReq,
            },
        ],
        response: schemas.PostFileRes,
        errors,
    },
]);
