// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import { errors } from "../errors";
import {
    PathParamIdInteger,
    PathParamPurl,
    PathParamSha256,
    PathParamString,
} from "../schemas/common_schemas";
import * as schemas from "../schemas/user_schemas";

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
        method: "put",
        path: "/user",
        description: "Update user data (for users to update their own data)",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PutUserReq,
            },
        ],
        response: schemas.PutUserRes,
        errors,
    },
    {
        method: "put",
        path: "/token",
        description:
            "Get new personal token for using DOS Scanner with ORT or through the API",
        response: schemas.PutTokenRes,
        errors,
    },
    {
        method: "get",
        path: "/license-conclusions",
        description: "Get all license conclusions",
        response: schemas.GetLicenseConclusionsRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/files/:sha256/license-conclusions/",
        description: "Get license conclusions for specified file",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: PathParamString("purl"),
            },
            {
                name: "sha256",
                type: "Path",
                schema: PathParamString("sha256"),
            },
        ],
        response: schemas.GetLicenseConclusionsForFileRes,
        errors,
    },
    {
        method: "post",
        path: "/packages/:purl/files/:sha256/license-conclusions",
        description: "Add a new license conclusion",
        alias: "PostLicenseConclusion",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: PathParamPurl,
            },
            {
                name: "sha256",
                type: "Path",
                schema: PathParamSha256,
            },
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
                schema: PathParamIdInteger,
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
                schema: PathParamIdInteger,
            },
        ],
        response: schemas.DeleteLicenseConclusionRes,
        errors,
    },
    {
        method: "get",
        path: "/bulk-curation",
        description: "Get all bulk curations",
        response: schemas.GetBulkCurationsRes,
        errors,
    },
    {
        method: "get",
        path: "/bulk-curation/:id",
        description: "Get bulk curation",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: PathParamIdInteger,
            },
        ],
        response: schemas.GetBulkCurationRes,
        errors,
    },
    {
        method: "post",
        path: "/bulk-curation",
        description: "Add a new bulk curation",
        alias: "PostBulkCuration",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostBulkCurationReq,
            },
        ],
        response: schemas.PostBulkCurationRes,
        errors,
    },
    {
        method: "put",
        path: "/bulk-curation/:id",
        description: "Update bulk curation",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: PathParamIdInteger,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PutBulkCurationReq,
            },
        ],
        response: schemas.PutBulkCurationRes,
        errors,
    },
    {
        method: "delete",
        path: "/bulk-curation/:id",
        description: "Delete a bulk curation",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: PathParamIdInteger,
            },
        ],
        response: schemas.DeleteBulkCurationRes,
        errors,
    },
    {
        method: "post",
        path: "/bulk-curations",
        description: "Get bulk curations for specified purl",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostBulkCurationsReq,
            },
        ],
        response: schemas.PostBulkCurationsRes,
        errors,
    },
    {
        method: "get",
        path: "/path-exclusion",
        description: "Get all path exclusions",
        response: schemas.GetPathExclusionsRes,
        errors,
    },
    {
        method: "post",
        path: "/path-exclusion",
        description: "Add a new path exclusion",
        alias: "PostPathExclusion",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostPathExclusionReq,
            },
        ],
        response: schemas.PostPathExclusionRes,
        errors,
    },
    {
        method: "delete",
        path: "/path-exclusion/:id",
        description: "Delete a path exclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: PathParamIdInteger,
            },
        ],
        response: schemas.DeletePathExclusionRes,
        errors,
    },
    {
        method: "post",
        path: "/path-exclusions",
        description: "Get path exclusions for specified purl",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostPathExclusionsReq,
            },
        ],
        response: schemas.PostPathExclusionsRes,
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
