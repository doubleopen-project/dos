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
        alias: "GetLicenseConclusions",
        description: "Get all license conclusions",
        response: schemas.GetLicenseConclusionsRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/files/:sha256/license-conclusions/",
        description:
            "Get license conclusions for specified file in specified package",
        alias: "GetLicenseConclusionsForFileInPackage",
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
        path: "/license-conclusions/:id",
        description: "Edit a license conclusion",
        alias: "PutLicenseConclusion",
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
        path: "/license-conclusions/:id",
        description: "Delete a license conclusion",
        alias: "DeleteLicenseConclusion",
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
        path: "/packages/:purl/bulk-conclusions",
        description: "Get bulk conclusions for specified purl",
        alias: "GetBulkConclusionsByPurl",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: PathParamPurl,
            },
        ],
        response: schemas.GetBulkConclusionsByPurlRes,
        errors,
    },
    {
        method: "post",
        path: "/packages/:purl/bulk-conclusions",
        description: "Add a new bulk conclusion",
        alias: "PostBulkConclusion",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: PathParamPurl,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PostBulkConclusionReq,
            },
        ],
        response: schemas.PostBulkConclusionRes,
        errors,
    },
    {
        method: "get",
        path: "/bulk-conclusions",
        description: "Get all bulk conclusions",
        alias: "GetBulkConclusions",
        response: schemas.GetBulkConclusionsRes,
        errors,
    },

    {
        method: "get",
        path: "/bulk-conclusions/:id",
        description: "Get bulk conclusion by id",
        alias: "GetBulkConclusionById",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: PathParamIdInteger,
            },
        ],
        response: schemas.GetBulkConclusionRes,
        errors,
    },

    {
        method: "put",
        path: "/bulk-conclusions/:id",
        description: "Edit bulk conclusion",
        alias: "PutBulkConclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: PathParamIdInteger,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PutBulkConclusionReq,
            },
        ],
        response: schemas.PutBulkConclusionRes,
        errors,
    },
    {
        method: "delete",
        path: "/bulk-conclusions/:id",
        description: "Delete a bulk conclusion",
        alias: "DeleteBulkConclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: PathParamIdInteger,
            },
        ],
        response: schemas.DeleteBulkConclusionRes,
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
        method: "get",
        path: "/packages/:purl/filetrees",
        alias: "GetFileTree",
        description: "Get file tree for specified purl",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: PathParamPurl,
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
