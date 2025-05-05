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
    {
        method: "get",
        path: "/packages",
        description: "Get packages. Alias: GetPackages",
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
                description: "Filter by name (substring match)",
            },
            {
                name: "namespace",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by namespace (substring match)",
            },
            {
                name: "version",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by version (substring match)",
            },
            {
                name: "type",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by type (substring match)",
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by purl (substring match)",
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
        ],
        response: schemas.GetPackagesRes,
        errors,
    },
    {
        method: "get",
        path: "/packages/count",
        description: "Get packages count. Alias: GetPackagesCount",
        alias: "GetPackagesCount",
        parameters: [
            {
                name: "name",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by name (substring match)",
            },
            {
                name: "namespace",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by namespace (substring match)",
            },
            {
                name: "version",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by version (substring match)",
            },
            {
                name: "type",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by type (substring match)",
            },
            {
                name: "purl",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by purl (substring match)",
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
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "get",
        path: "/clearance-items/distinct-users",
        description:
            "Get information about the distinct users that have made clearance items",
        response: schemas.GetDistinctUsersForItemsRes,
        errors,
    },
]);
