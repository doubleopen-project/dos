// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { authConfig } from "common-helpers";
import genFunc from "connect-pg-simple";
import type { Request, Response } from "express";
import session from "express-session";
import Keycloak, {
    KeycloakConfig,
    Keycloak as KeycloakType,
} from "keycloak-connect";

let _keycloak: KeycloakType;

const PostgresqlStore = genFunc(session);

const memoryStore = new PostgresqlStore({
    conString: process.env.DATABASE_URL,
    tableName: "Session",
});

const keycloakConfig: KeycloakConfig = {
    realm: authConfig.realm,
    resource: authConfig.clientIdAPI,
    "auth-server-url": authConfig.url,
    "bearer-only": true,
    "confidential-port": 0,
    "ssl-required": "external",
};

Keycloak.prototype.accessDenied = async (
    request: Request,
    response: Response,
) => {
    //console.log(request.headers.authorization);
    if (!request.headers.authorization) {
        return response.status(401).json({
            errorCode: "token.empty",
            message: "Token is missing.",
        });
    }

    if (!request.kauth?.grant) {
        return response.status(401).json({
            errorCode: "token.invalid",
            message:
                "You are not authorized to access this resource, please check the sent token and make sure it is a valid token.",
        });
    }

    _keycloak.storeGrant(
        request.kauth.grant as unknown as Keycloak.Grant,
        request,
        response,
    );

    const getGrant = await _keycloak.getGrant(request, response);

    if (getGrant.isExpired()) {
        return response.status(401).json({
            errorCode: "token.expired",
            message: "Expired token, please enter a valid token to continue.",
        });
    }

    if (!request.hasRequiredRoles) {
        return response.status(403).json({
            errorCode: "roles.required",
            message:
                "You do not have the required roles to access this resource.",
        });
    }

    return response.status(401).json({
        errorCode: "token.invalid",
        message: "Invalid token, enter a new token.",
    });
};

function getKeycloak(): KeycloakType {
    if (!_keycloak) {
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
    return _keycloak;
}

export { getKeycloak, memoryStore };
