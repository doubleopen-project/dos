// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const PostTokenReq = z.union([
    z.object({
        client_id: z.string(),
        grant_type: z.literal("client_credentials"),
        client_secret: z.string(),
    }),
    z.object({
        client_id: z.string(),
        grant_type: z.literal("refresh_token"),
        refresh_token: z.string(),
        client_secret: z.string().optional(),
    }),
    z.object({
        grant_type: z.literal("urn:ietf:params:oauth:grant-type:uma-ticket"),
        audience: z.string(),
        response_mode: z.enum(["permissions", "decision", "token"]),
        permission: z.string().optional(),
    }),
]);

const TokenResponse = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_expires_in: z.number(),
    refresh_token: z.string(),
    token_type: z.literal("Bearer"),
    "not-before-policy": z.number(),
    session_state: z.string(),
    scope: z.string(),
});

const ClientCredentialsTokenResponse = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_expires_in: z.number(),
    token_type: z.literal("Bearer"),
    "not-before-policy": z.number(),
    scope: z.string(),
});

const PermissionResponse = z.array(
    z.object({
        scopes: z.array(z.string()),
        rsid: z.string(),
        rsname: z.string(),
    }),
);

export const PostTokenRes = z.union([
    TokenResponse,
    ClientCredentialsTokenResponse,
    PermissionResponse,
]);

export type Token = z.infer<typeof TokenResponse>;
export type ClientCredentialsToken = z.infer<
    typeof ClientCredentialsTokenResponse
>;
export type Permissions = z.infer<typeof PermissionResponse>;

export const CreateUserReq = z.object({
    username: z.string(),
    credentials: z.array(
        z.object({
            type: z.string(),
            value: z.string(),
            temporary: z.boolean(),
        }),
    ),
    attributes: z.object({
        dosApiToken: z.string(),
    }),
    enabled: z.boolean().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    emailVerified: z.boolean().optional(),
});

export const UndefinedResponse = z.undefined();

const UserRepresentation = z.object({
    id: z.string(),
    username: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    attributes: z
        .object({
            dosApiToken: z.array(z.string()).optional(),
        })
        .optional(),
    requiredActions: z.array(z.string()).optional(),
});

export const GetUsersResponse = z.array(UserRepresentation);

export const RealmRole = z.object({
    id: z.string(),
    name: z.string(),
    clientRole: z.boolean(),
    composite: z.boolean(),
    containerId: z.string(),
    description: z.string().optional(),
});

export const RealmRolesArray = z.array(RealmRole);

export const UpdateUserReq = z.object({
    username: z.string().optional(),
    credentials: z
        .array(
            z.object({
                type: z.string(),
                value: z.string(),
                temporary: z.boolean(),
            }),
        )
        .optional(),
    attributes: z
        .object({
            dosApiToken: z.string().optional(),
        })
        .optional(),
    realmRoles: z.array(z.string()).optional(),
    enabled: z.boolean().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    emailVerified: z.boolean().optional(),
});

export const ResetUserPasswordReq = z.object({
    type: z.string(),
    value: z.string(),
    temporary: z.boolean(),
});

export const GetUserByIdResponse = UserRepresentation;

export const GetUserInfoResponse = z.object({
    sub: z.string(),
    resource_access: z.record(
        z.string(),
        z.object({
            roles: z.array(z.string()),
        }),
    ),
    email_verified: z.boolean(),
    realm_access: z.object({
        roles: z.array(z.string()),
    }),
    name: z.string(),
    preferred_username: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    email: z.string(),
});
