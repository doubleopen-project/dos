// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Zodios } from "@zodios/core";
import { isAxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import NodeCache from "node-cache";
import { keycloakAPI, type Permissions } from "validation-helpers";

// Use a cache to store the permissions for a short time
const cache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 60 });

const keycloakUrl = process.env.KEYCLOAK_URL;

if (!keycloakUrl) {
    throw new Error("KEYCLOAK_URL not set");
}

const kcClient = new Zodios(keycloakUrl, keycloakAPI);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Permissions>,
) {
    try {
        const keycloakClientIdApi = process.env.KEYCLOAK_CLIENT_ID_API;

        if (!keycloakClientIdApi) {
            throw new Error("KEYCLOAK_CLIENT_ID_API not set");
        }

        const keycloakRealm = process.env.KEYCLOAK_REALM;

        if (!keycloakRealm) {
            throw new Error("KEYCLOAK_REALM not set");
        }
        // Check if the permissions are in the cache
        let permissions: Permissions | undefined = cache.get(
            req.headers.authorization as string,
        );

        if (!permissions) {
            permissions = (await kcClient.PostToken(
                {
                    grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
                    audience: keycloakClientIdApi,
                    response_mode: "permissions",
                },
                {
                    params: {
                        realm: keycloakRealm,
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: req.headers.authorization,
                    },
                },
            )) as Permissions; // The endpoint provides a union type, but we know it's a Permissions with this type of request

            // Store the permissions in the cache
            cache.set(req.headers.authorization as string, permissions);
        }

        res.status(200).json(permissions);
    } catch (error) {
        if (isAxiosError(error)) {
            res.status(error.response?.status || 500).json(
                error.response?.data || { message: error.message },
            );
        } else {
            return NextResponse.json(
                { message: "Internal server error: Unknown error" },
                { status: 500 },
            );
        }
    }
}
