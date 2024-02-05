// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import { errors } from "../errors";
import * as commonSchemas from "../schemas/common_schemas";
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
                schema: commonSchemas.PathParamString("purl"),
            },
            {
                name: "sha256",
                type: "Path",
                schema: commonSchemas.PathParamString("sha256"),
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
                schema: commonSchemas.PathParamPurl,
            },
            {
                name: "sha256",
                type: "Path",
                schema: commonSchemas.PathParamSha256,
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
                schema: commonSchemas.PathParamIdInteger,
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
                schema: commonSchemas.PathParamIdInteger,
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
                schema: commonSchemas.PathParamPurl,
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
                schema: commonSchemas.PathParamPurl,
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
                schema: commonSchemas.PathParamIdInteger,
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
                schema: commonSchemas.PathParamIdInteger,
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
                schema: commonSchemas.PathParamIdInteger,
            },
        ],
        response: schemas.DeleteBulkConclusionRes,
        errors,
    },
    {
        method: "get",
        path: "/path-exclusions",
        description: "Get all path exclusions",
        alias: "GetPathExclusions",
        response: schemas.GetPathExclusionsRes,
        errors,
    },
    {
        method: "get",
        path: "/path-exclusions/count",
        description: "Get count of path exclusions",
        alias: "GetPathExclusionsCount",
        parameters: [
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "pattern",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "reason",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "comment",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "put",
        path: "/path-exclusions/:id",
        description: "Edit a path exclusion",
        alias: "PutPathExclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PutPathExclusionReq,
            },
        ],
        response: schemas.PutPathExclusionRes,
        errors,
    },
    {
        method: "post",
        path: "/packages/:purl/path-exclusions",
        description: "Add a new path exclusion",
        alias: "PostPathExclusion",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
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
        path: "/path-exclusions/:id",
        description: "Delete a path exclusion",
        alias: "DeletePathExclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
        ],
        response: schemas.DeletePathExclusionRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/path-exclusions",
        description: "Get path exclusions for specified purl",
        alias: "GetPathExclusionsByPurl",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
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
                schema: commonSchemas.PathParamPurl,
            },
        ],
        response: schemas.PostFileTreeRes,
        errors,
    },
    {
        method: "get",
        path: "/packages",
        description: "Get packages",
        alias: "GetPackages",
        parameters: [
            {
                name: "pageSize",
                type: "Query",
                schema: commonSchemas.QueryParamPageSize,
            },
            {
                name: "pageIndex",
                type: "Query",
                schema: commonSchemas.QueryParamPageIndex,
            },
            {
                name: "sortBy",
                type: "Query",
                schema: schemas.QueryParamSortPkgBy,
            },
            {
                name: "sortOrder",
                type: "Query",
                schema: commonSchemas.QueryParamSortOrder,
            },
            {
                name: "name",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "namespace",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "version",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "type",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
        ],
        response: schemas.GetPackagesRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/count",
        description: "Get packages count",
        alias: "GetPackagesCount",
        parameters: [
            {
                name: "name",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "namespace",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "version",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "type",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
            },
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/filetrees/:path/files",
        alias: "GetFile",
        description:
            "Get file sha256 and S3 download url for file in path in package",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
            {
                name: "path",
                type: "Path",
                schema: commonSchemas.PathParamString("Path"),
            },
        ],
        response: schemas.GetFileRes,
        errors,
    },
    {
        method: "get",
        path: "/files/:sha256/license-findings",
        alias: "GetLicenseFindingsForFile",
        description: "Get license findings for specified file",
        parameters: [
            {
                name: "sha256",
                type: "Path",
                schema: commonSchemas.PathParamSha256,
            },
        ],
        response: schemas.GetLicenseFindingsForFileRes,
        errors,
    },
]);
