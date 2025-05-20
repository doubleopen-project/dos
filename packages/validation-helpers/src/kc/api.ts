// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import * as commonSchemas from "../api/schemas/common_schemas";
import { createUserErrors, errors } from "./errors";
import * as schemas from "./schemas";

export const keycloakAPI = makeApi([
    {
        method: "post",
        path: "/realms/:realm/protocol/openid-connect/token",
        description:
            "Get auth token, refresh token, or get permissions with access token",
        alias: "PostToken",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.PostTokenReq,
            },
        ],
        response: schemas.PostTokenRes,
        errors,
    },
    {
        method: "post",
        path: "/admin/realms/:realm/users/:id/logout",
        description: "Logout user",
        alias: "LogoutUser",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamString("id"),
            },
        ],
        response: schemas.UndefinedResponse,
        errors,
    },
    {
        method: "post",
        path: "/admin/realms/:realm/users",
        description: "Create user",
        alias: "CreateUser",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.CreateUserReq,
            },
        ],
        response: schemas.UndefinedResponse,
        createUserErrors,
    },
    {
        method: "get",
        path: "/admin/realms/:realm/users",
        description: "Get users",
        alias: "GetUsers",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "username",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
            {
                name: "exact",
                type: "Query",
                schema: commonSchemas.QueryParamFilterBoolean,
            },
            {
                name: "q",
                type: "Query",
                schema: commonSchemas.QueryParamFilterValue,
            },
        ],
        response: schemas.GetUsersResponse,
        errors,
    },
    {
        method: "delete",
        path: "/admin/realms/:realm/users/:id",
        description: "Delete user",
        alias: "DeleteUser",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.UndefinedResponse,
        errors,
    },
    {
        method: "get",
        path: "/admin/realms/:realm/roles",
        description: "Get realm roles",
        alias: "GetRealmRoles",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
        ],
        response: schemas.RealmRolesArray,
        errors,
    },
    {
        method: "post",
        path: "/admin/realms/:realm/users/:id/role-mappings/realm",
        description: "Add realm role to user",
        alias: "AddRealmRoleToUser",

        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.RealmRolesArray,
            },
        ],
        response: schemas.UndefinedResponse,
        errors,
    },
    {
        method: "put",
        path: "/admin/realms/:realm/users/:id",
        description: "Update user",
        alias: "UpdateUser",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.UpdateUserReq,
            },
        ],
        response: schemas.UndefinedResponse,
        errors,
    },
    {
        method: "put",
        path: "/admin/realms/:realm/users/:id/reset-password",
        description: "Reset user password",
        alias: "ResetUserPassword",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.ResetUserPasswordReq,
            },
        ],
        response: schemas.UndefinedResponse,
        errors,
    },
    {
        method: "get",
        path: "/admin/realms/:realm/users/:id",
        description: "Get user by ID",
        alias: "GetUserById",
        response: schemas.GetUserByIdResponse,
        errors,
    },
    {
        method: "get",
        path: "/realms/:realm/protocol/openid-connect/userinfo",
        description: "Get user info",
        alias: "GetUserInfo",
        response: schemas.GetUserInfoResponse,
        errors,
    },
]);
