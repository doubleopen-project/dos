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
        path: "/curators",
        description: "Get the curators that have made clearance items",
        alias: "GetCurators",
        response: schemas.GetCuratorsRes,
        errors,
    },
    {
        method: "post",
        path: "/curators",
        description: "Create a new curator account",
        alias: "PostCurator",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostCuratorReq,
            },
        ],
        response: schemas.PostCuratorRes,
        errors,
    },
    {
        method: "put",
        path: "/clearance-items/reassign",
        description: "Reassign clearance items to a new user ID",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PutReassignClearanceItemsReq,
            },
        ],
        response: schemas.PutReassignClearanceItemsRes,
        errors,
    },
    {
        method: "post",
        path: "/clearance-groups",
        description: "Create a new clearance group",
        alias: "PostClearanceGroup",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostClearanceGroupReq,
            },
        ],
        response: schemas.ClearanceGroup,
        errors,
    },
    {
        method: "patch",
        path: "/clearance-groups/:id",
        description: "Update a clearance group",
        alias: "UpdateClearanceGroup",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PatchClearanceGroupReq,
            },
        ],
        response: schemas.ClearanceGroup,
        errors,
    },
    {
        method: "delete",
        path: "/clearance-groups/:id",
        description: "Delete a clearance group",
        alias: "DeleteClearanceGroup",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
        ],
        status: 204,
        response: commonSchemas.EmptyResponse,
        errors,
    },
    {
        method: "get",
        path: "/clearance-groups",
        description: "Get clearance groups",
        alias: "GetClearanceGroups",
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
                schema: schemas.QueryParamClearanceGroupSortBy,
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
        ],
        response: schemas.GetClearanceGroupsRes,
        errors,
    },
    {
        method: "get",
        path: "/clearance-groups/count",
        description: "Get clearance groups count",
        alias: "GetClearanceGroupsCount",
        parameters: [
            {
                name: "name",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
                description: "Filter by name (substring match)",
            },
        ],
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "get",
        path: "/clearance-groups/:id",
        description: "Get clearance group by ID",
        alias: "GetClearanceGroupById",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
        ],
        response: schemas.ClearanceGroupWithCurators,
        errors,
    },
    {
        method: "post",
        path: "/clearance-groups/:id/curators",
        description: "Add curators to a clearance group",
        alias: "AddCuratorsToClearanceGroup",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PostCuratorsToClearanceGroupReq,
            },
        ],
        response: schemas.ClearanceGroupWithCurators,
        errors,
    },
    {
        method: "delete",
        path: "/clearance-groups/:groupId/curators/:curatorId",
        description: "Remove a curator from a clearance group",
        alias: "RemoveCuratorFromClearanceGroup",
        parameters: [
            {
                name: "groupId",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "curatorId",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.ClearanceGroupWithCurators,
        errors,
    },
    {
        method: "post",
        path: "/clearance-groups/:groupId/assign-items",
        description: "Assign clearance items of a curator to a clearance group",
        alias: "AssignClearanceItemsToClearanceGroup",
        parameters: [
            {
                name: "groupId",
                type: "Path",
                schema: commonSchemas.PathParamIdInteger,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PostAssignClearanceItemsToClearanceGroupReq,
            },
        ],
        response: schemas.PostAssignClearanceItemsToClearanceGroupRes,
        errors,
    },
    {
        method: "post",
        path: "/api-clients",
        description: "Create API client",
        alias: "CreateApiClient",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostApiClientsReq,
            },
        ],
        response: schemas.ApiClient,
        errors,
    },
    {
        method: "patch",
        path: "/api-clients/:id",
        description: "Update API client",
        alias: "UpdateApiClient",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PatchApiClientsReq,
            },
        ],
        response: schemas.ApiClient,
        errors,
    },
    {
        method: "delete",
        path: "/api-clients/:id",
        description: "Delete API client",
        alias: "DeleteApiClient",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        status: 204,
        response: commonSchemas.EmptyResponse,
        errors,
    },
    {
        method: "get",
        path: "/api-clients",
        description: "Get API clients",
        alias: "GetApiClients",
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
                schema: schemas.QueryParamApiClientSortBy,
            },
            {
                name: "sortOrder",
                type: "Query",
                schema: commonSchemas.QueryParamSortOrder,
            },
        ],
        response: schemas.ApiClientList,
        errors,
    },
    {
        method: "get",
        path: "/api-clients/count",
        description: "Get API clients count",
        alias: "GetApiClientsCount",
        response: commonSchemas.GetCountRes,
        errors,
    },
    {
        method: "get",
        path: "/api-clients/:id",
        description: "Get API client by ID",
        alias: "GetApiClientById",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.ApiClientWithTokens,
        errors,
    },
    {
        method: "post",
        path: "/api-clients/:id/api-tokens",
        description: "Create API token",
        alias: "CreateApiToken",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PostApiClientTokensReq,
            },
        ],
        response: schemas.PostApiClientTokensRes,
        errors,
    },
    {
        method: "post",
        path: "/api-tokens/:id/rotate",
        description: "Generate a new token and invalidate the old one",
        alias: "RotateApiToken",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.RotateTokenRes,
        errors,
    },
    {
        method: "post",
        path: "/api-tokens/:id/revoke",
        description: "Revoke an API token",
        alias: "RevokeApiToken",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.ApiTokenWithClearanceGroupsAndScopes,
        errors,
    },
    {
        method: "patch",
        path: "/api-tokens/:id",
        description: "Update an API token",
        alias: "UpdateApiToken",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PatchApiTokensReq,
            },
        ],
        response: schemas.ApiTokenWithClearanceGroupsAndScopes,
        errors,
    },
    {
        method: "get",
        path: "/api-tokens/:id",
        description:
            "Get API token details by ID. Does not return the token value.",
        alias: "GetApiTokenById",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.ApiTokenWithClearanceGroupsAndScopes,
        errors,
    },
]);
