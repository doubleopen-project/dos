// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

declare namespace Express {
    export interface Request {
        hasRequiredRoles: boolean;
        kauth: {
            grant: {
                access_token: {
                    token: string;
                    clientId: string;
                    header: {
                        alg: string;
                        typ: string;
                        kid: string;
                    };
                    content: {
                        exp: number;
                        iat: number;
                        jti: string;
                        iss: string;
                        aud: string;
                        sub: string;
                        typ: string;
                        azp: string;
                        session_state: string;
                        acr: string;
                        "allowed-origins": string[];
                        realm_access: {
                            roles: string[];
                        };
                        resource_access: {
                            [process.env.KEYCLOAK_CLIENT_ID_API ||
                                "dos-dev-api"]: {
                                roles: string[];
                            };
                            account: {
                                roles: string[];
                            };
                        };
                        scope: string;
                        sid: string;
                        email_verified: boolean;
                        preferred_username: string;
                        email: string;
                        given_name: string;
                        family_name: string;
                    };
                    signature: Buffer | unknown;
                    signed: string;
                };
            };
        };
    }
}
