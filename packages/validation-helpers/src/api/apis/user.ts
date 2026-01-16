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
        alias: "PutUser",
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
        method: "get",
        path: "/user/clearance-groups",
        description: "Get clearance groups that the user has access to",
        alias: "GetUserClearanceGroups",
        response: schemas.GetUserClearanceGroupsRes,
        errors,
    },
    {
        method: "get",
        path: "/license-conclusions",
        alias: "GetLicenseConclusions",
        description: "Get license conclusions. Alias: GetLicenseConclusions",
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
                schema: schemas.QueryParamSortLCBy,
            },
            {
                name: "sortOrder",
                type: "Query",
                schema: commonSchemas.QueryParamSortOrder,
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description:
                    "Filter by purl (exact match). Use this to get the license conclusions affecting the files in the specified purl, regardless of whether the conclusions were made in the context of the purl or not.",
            },
            {
                name: "contextPurl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description:
                    "Filter by context purl. Use this to get only the license conclusions made in the context of the specified purl. Please note that if a purl is specified, and the local value is set to true, the context purl will be ignored, as it has to be the same as the purl.",
            },
            {
                name: "contextPurlStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by context purl strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by username",
            },
            {
                name: "usernameStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by username strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "detectedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by detected license (substring match)",
            },
            {
                name: "concludedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by concluded license (substring match)",
            },
            {
                name: "comment",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by comment (substring match)",
            },
            {
                name: "local",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description: "Filter by local value",
            },
            {
                name: "bulkConclusionId",
                type: "Query",
                schema: commonSchemas.QueryParamFilterInt,
                description: "Filter by bulk conclusion id",
            },
            {
                name: "hasBulkConclusionId",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Refine results to include only entries with or without a bulk conclusion id.",
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or after the specified date.",
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or before the specified date.",
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or after the specified date.",
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or before the specified date.",
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Filter by clearance group ids. If not specified, all license conclusions accessible to the user will be returned.",
            },
        ],
        response: schemas.GetLicenseConclusionsRes,
        errors,
    },
    {
        method: "get",
        path: "/license-conclusions/count",
        alias: "GetLicenseConclusionsCount",
        description:
            "Get count of license conclusions. Alias: GetLicenseConclusionsCount",
        parameters: [
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description:
                    "Filter by purl (exact match). Use this to get the count of all license conclusions affecting the files in the specified purl, regardless of whether the conclusions were made in the context of the purl or not.",
            },
            {
                name: "contextPurl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description:
                    "Filter by context purl. Use this to get the count of only the license conclusions made in the context of the specified purl. Please note that if a purl is specified, and the local value is set to true, the context purl will be ignored, as it has to be the same as the purl.",
            },
            {
                name: "contextPurlStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by context purl strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by username",
            },
            {
                name: "usernameStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by username strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "detectedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by detected license (substring match)",
            },
            {
                name: "concludedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by concluded license (substring match)",
            },
            {
                name: "comment",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by comment (substring match)",
            },
            {
                name: "local",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description: "Filter by local value",
            },
            {
                name: "bulkConclusionId",
                type: "Query",
                schema: commonSchemas.QueryParamFilterInt,
                description: "Filter by bulk conclusion id",
            },
            {
                name: "hasBulkConclusionId",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Refine count to include only entries with or without a bulk conclusion id.",
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine count to include only entries created on or after the specified date.",
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine count to include only entries created on or before the specified date.",
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine count to include only entries updated on or after the specified date.",
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine count to include only entries updated on or before the specified date.",
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Refine count by clearance group ids. If not specified, all license conclusions accessible to the user will be counted.",
            },
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "get",
        path: "/license-conclusions/:id/affected-files",
        description:
            "Get affected files for specified license conclusion. Alias: GetAffectedFilesForLicenseConclusion",
        alias: "GetAffectedFilesForLicenseConclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description:
                    "Filter by purl (exact match). Use this to get also a list of files affected in this specific package.",
            },
        ],
        response: schemas.GetAffectedFilesForLicenseConclusionRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/files/:sha256/license-conclusions/",
        description:
            "Get license conclusions for specified file in specified package. Alias: GetLicenseConclusionsForFileInPackage",
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
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Filter by clearance group ids. If not specified, all license conclusions accessible to the user will be returned.",
            },
        ],
        response: schemas.GetLicenseConclusionsForFileRes,
        errors,
    },
    {
        method: "post",
        path: "/packages/:purl/files/:sha256/license-conclusions",
        description:
            "Add a new license conclusion. Alias: PostLicenseConclusion",
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
        description: "Edit a license conclusion. Alias: PutLicenseConclusion",
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
        description:
            "Delete a license conclusion. Alias: DeleteLicenseConclusion",
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
        description:
            "Get bulk conclusions for specified purl. Returns both bulk conclusions made in this package, and bulk conclusions made in other packages, that affect files in this package. Alias: GetBulkConclusionsByPurl",
        alias: "GetBulkConclusionsByPurl",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Filter by clearance group ids. If not specified, all bulk conclusions accessible to the user will be returned.",
            },
        ],
        response: schemas.GetBulkConclusionsByPurlRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/bulk-conclusions/count",
        description:
            "Get count of bulk conclusions for specified purl. Returns count of both bulk conclusions made in this package, and bulk conclusions made in other packages, that affect files in this package. Alias: GetBulkConclusionsCountByPurl",
        alias: "GetBulkConclusionsCountByPurl",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Refine count by clearance group ids. If not specified, all bulk conclusions accessible to the user will be counted.",
            },
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "post",
        path: "/packages/:purl/bulk-conclusions",
        description: "Add a new bulk conclusion. Alias: PostBulkConclusion",
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
        description: "Get bulk conclusions. Alias: GetBulkConclusions",
        alias: "GetBulkConclusions",
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
                schema: schemas.QueryParamSortBCBy,
            },
            {
                name: "sortOrder",
                type: "Query",
                schema: commonSchemas.QueryParamSortOrder,
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description:
                    "Filter by purl. Will return the bulk conclusions made in the specified package",
            },
            {
                name: "purlStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by purl strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by username",
            },
            {
                name: "usernameStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by username strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "pattern",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by pattern (substring match)",
            },
            {
                name: "detectedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by detected license (substring match)",
            },
            {
                name: "concludedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by concluded license (substring match)",
            },
            {
                name: "comment",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by comment (substring match)",
            },
            {
                name: "local",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description: "Filter by local",
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or after the specified date.",
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or before the specified date.",
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or after the specified date.",
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or before the specified date.",
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Filter by clearance group ids. If not specified, all bulk conclusions accessible to the user will be returned.",
            },
        ],
        response: schemas.GetBulkConclusionsRes,
        errors,
    },
    {
        method: "get",
        path: "/bulk-conclusions/count",
        description:
            "Get count of bulk conclusions. Alias: GetBulkConclusionsCount",
        alias: "GetBulkConclusionsCount",
        parameters: [
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by purl",
            },
            {
                name: "purlStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by purl strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by username",
            },
            {
                name: "usernameStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by username strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "pattern",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by pattern (substring match)",
            },
            {
                name: "detectedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by detected license (substring match)",
            },
            {
                name: "concludedLicense",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by concluded license (substring match)",
            },
            {
                name: "comment",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by comment (substring match)",
            },
            {
                name: "local",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description: "Filter by local",
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or after the specified date.",
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or before the specified date.",
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or after the specified date.",
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or before the specified date.",
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Refine count by clearance group ids. If not specified, all bulk conclusions accessible to the user will be counted.",
            },
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "get",
        path: "/bulk-conclusions/:id/affected-files",
        description:
            "Get affected files for specified bulk conclusion. Alias: GetAffectedFilesForBulkConclusion",
        alias: "GetAffectedFilesForBulkConclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description:
                    "Filter by purl (exact match). Use this to get also a list of files affected in this specific package.",
            },
        ],
        response: schemas.GetAffectedFilesForBulkConclusionRes,
        errors,
    },
    {
        method: "get",
        path: "/bulk-conclusions/:id",
        description: "Get bulk conclusion by id. Alias: GetBulkConclusionById",
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
        description: "Edit bulk conclusion. Alias: PutBulkConclusion",
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
        description: "Delete a bulk conclusion. Alias: DeleteBulkConclusion",
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
        description: "Get path exclusions. Alias: GetPathExclusions",
        alias: "GetPathExclusions",
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
                schema: schemas.QueryParamSortPEBy,
            },
            {
                name: "sortOrder",
                type: "Query",
                schema: commonSchemas.QueryParamSortOrder,
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by purl",
            },
            {
                name: "purlStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by purl strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by username",
            },
            {
                name: "usernameStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by username strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "pattern",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by pattern (substring match)",
            },
            {
                name: "reason",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by reason (substring match)",
            },
            {
                name: "comment",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by comment (substring match)",
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or after the specified date.",
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or before the specified date.",
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or after the specified date.",
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or before the specified date.",
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Filter by clearance group ids. If not specified, all path exclusions accessible to the user will be returned.",
            },
        ],
        response: schemas.GetPathExclusionsRes,
        errors,
    },
    {
        method: "get",
        path: "/path-exclusions/count",
        description:
            "Get count of path exclusions. Alias: GetPathExclusionsCount",
        alias: "GetPathExclusionsCount",
        parameters: [
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by purl",
            },
            {
                name: "purlStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by purl strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by username",
            },
            {
                name: "usernameStrict",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
                description:
                    "Choose whether to filter by username strictly (exact match) or not (substring match). Defaults to false.",
            },
            {
                name: "pattern",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by pattern (substring match)",
            },
            {
                name: "reason",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by reason (substring match)",
            },
            {
                name: "comment",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by comment (substring match)",
            },
            {
                name: "createdAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or after the specified date.",
            },
            {
                name: "createdAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries created on or before the specified date.",
            },
            {
                name: "updatedAtGte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or after the specified date.",
            },
            {
                name: "updatedAtLte",
                type: "Query",
                schema: commonSchemas.QueryParamFilterDate,
                description:
                    "Refine results to include only entries updated on or before the specified date.",
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Refine count by clearance group ids. If not specified, all path exclusions accessible to the user will be counted.",
            },
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "get",
        path: "/path-exclusions/:id/affected-files",
        description:
            "Get affected files for specified path exclusion. Alias: GetAffectedFilesForPathExclusion",
        alias: "GetAffectedFilesForPathExclusion",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
        ],
        response: schemas.GetAffectedFilesForPathExclusionRes,
        errors,
    },
    {
        method: "put",
        path: "/path-exclusions/:id",
        description: "Edit a path exclusion. Alias: PutPathExclusion",
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
        description: "Add a new path exclusion. Alias: PostPathExclusion",
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
        description: "Delete a path exclusion. Alias: DeletePathExclusion",
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
        description:
            "Get path exclusions for specified purl. Alias: GetPathExclusionsByPurl",
        alias: "GetPathExclusionsByPurl",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
            {
                name: "clearanceGroupIds",
                type: "Query",
                schema: commonSchemas.QueryParamFilterListOfInts,
                description:
                    "Filter by clearance group ids. If not specified, all path exclusions accessible to the user will be returned.",
            },
        ],
        response: schemas.GetPathExclusionsForPkgRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/filetrees",
        alias: "GetFileTree",
        description: "Get file tree for specified purl. Alias: GetFileTree",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
        ],
        response: schemas.GetFileTreeRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl",
        description: "Get package information by purl. Alias: GetPackage",
        alias: "GetPackage",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
        ],
        response: schemas.GetPackageRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/:purl/filetrees/:path/files",
        alias: "GetFile",
        description:
            "Get file sha256 and S3 download url for file in path in package. Alias: GetFile",
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
        path: "/packages/:purl/license-findings",
        alias: "GetLicenseFindingsForPackage",
        description:
            "Get license findings for specified package. Alias: GetLicenseFindingsForPackage",
        parameters: [
            {
                name: "purl",
                type: "Path",
                schema: commonSchemas.PathParamPurl,
            },
        ],
        response: schemas.GetLicenseFindingsForPackageRes,
        errors,
    },
    {
        method: "get",
        path: "/files/:sha256/license-findings",
        alias: "GetLicenseFindingsForFile",
        description:
            "Get license findings for specified file. Alias: GetLicenseFindingsForFile",
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
