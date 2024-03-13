// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import * as commonSchemas from "../api/schemas/common_schemas";
import { errors } from "./errors";
import * as schemas from "./schemas";

export const keycloakAPI = makeApi([
    {
        method: "post",
        path: "/realms/:realm/protocol/openid-connect/token",
        description: "Get auth token",
        alias: "GetAccessToken",
        parameters: [
            {
                name: "realm",
                type: "Path",
                schema: commonSchemas.PathParamString("realm"),
            },
            {
                name: "body",
                type: "Body",
                schema: schemas.GetAccessTokenReq,
            },
        ],
        response: schemas.GetAccessTokenResponse,
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
        response: schemas.LogoutUserResponse,
        errors,
    },
]);
