/*
 * Next-auth setup based on the example from <https://github.com/Sup3r-Us3r/keycloak-nextjs-nodejs/>
 * which is licensed under MIT and includes the following copyright holder:
 * SPDX-FileCopyrightText: 2022 Mayderson
 *
 *
 * SPDX-FileCopyrightText: 2024 Double Open
 *
 * SPDX-License-Identifier: MIT
 */

import { Zodios } from "@zodios/core";
import { isAxiosError } from "axios";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import { keycloakAPI, type Token } from "validation-helpers";

const keycloakUrl = process.env.KEYCLOAK_URL;

if (!keycloakUrl) {
    throw new Error("KEYCLOAK_URL not set");
}

const keycloakRealm = process.env.KEYCLOAK_REALM;

if (!keycloakRealm) {
    throw new Error("KEYCLOAK_REALM not set");
}

const keycloakClientIdUi = process.env.KEYCLOAK_CLIENT_ID_UI;

if (!keycloakClientIdUi) {
    throw new Error("KEYCLOAK_CLIENT_ID_UI not set");
}

const keycloakClientSecretUi = process.env.KEYCLOAK_CLIENT_SECRET_UI;

if (!keycloakClientSecretUi) {
    throw new Error("KEYCLOAK_CLIENT_SECRET_UI not set");
}

const kcClient = new Zodios(keycloakUrl, keycloakAPI);

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
    let retries = 3;
    if (!keycloakClientIdUi) {
        throw new Error("KEYCLOAK_CLIENT_ID_UI not set");
    }
    if (!keycloakRealm) {
        throw new Error("KEYCLOAK_REALM not set");
    }

    while (retries > 0) {
        try {
            const refreshedTokens = (await kcClient.PostToken(
                {
                    client_id: keycloakClientIdUi,
                    grant_type: "refresh_token",
                    refresh_token: token.refreshToken,
                    client_secret: keycloakClientSecretUi,
                },
                {
                    params: {
                        realm: keycloakRealm,
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            )) as Token; // The endpoint provides a union type, but we know it's a Token with this type of request

            return {
                ...token,
                accessToken: refreshedTokens.access_token,
                accessTokenExpired:
                    Date.now() + refreshedTokens.expires_in * 1000,
                refreshToken: refreshedTokens.refresh_token,
                refreshTokenExpired:
                    Date.now() + refreshedTokens.refresh_expires_in * 1000,
            };
        } catch (error) {
            retries--;
            if (isAxiosError(error)) {
                if (error.response?.status === 504 && retries > 0) {
                    console.log(
                        "Failed to refresh token due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to refresh token due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (
                    error.response?.status === 400 &&
                    error.response.data.error_description ===
                        "Session not active"
                ) {
                    console.log("Session not active");
                    return {
                        ...token,
                        error: "SessionNotActiveError",
                    };
                } else if (
                    error.response?.status === 400 &&
                    error.response.data.error_description ===
                        "Token is not active"
                ) {
                    console.log("Token is not active");
                    return {
                        ...token,
                        error: "TokenNotActiveError",
                    };
                } else {
                    console.log(error);
                    return {
                        ...token,
                        error: "RefreshAccessTokenError",
                    };
                }
            } else {
                console.log(error);
                return {
                    ...token,
                    error: "RefreshAccessTokenError",
                };
            }
        }
    }

    return {
        ...token,
        error: "RefreshAccessTokenError",
    };
}

export default NextAuth({
    providers: [
        KeycloakProvider({
            id: "keycloak",
            name: "Keycloak",
            clientId: keycloakClientIdUi,
            clientSecret: keycloakClientSecretUi,
            issuer: `${keycloakUrl}/realms/${keycloakRealm}`,
            requestTokenUrl: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/auth`,
            authorization: {
                params: {
                    scope: "openid email profile",
                },
            },
            checks: ["pkce", "state"],
            idToken: true,
            profile(profile) {
                return {
                    id: profile.sub,
                    ...profile,
                };
            },
        }),
    ],
    //debug: true,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: undefined,
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            return Promise.resolve(url.startsWith(baseUrl) ? url : baseUrl);
        },
        async signIn({ account, user }) {
            if (account && user) {
                return true;
            } else {
                return false;
            }
        },
        jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                // Add access_token, refresh_token and expirations to the token right after signin
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpired = account.expires_at! * 1000;
                token.refreshTokenExpired =
                    Date.now() + account.refresh_expires_in! * 1000;
                token.user = user;

                return token;
            }

            // Return previous token if the access token has not expired yet / will not expire before the next refetch
            const refetchInterval =
                parseInt(process.env.REFETCH_INTERVAL as string) || 60;

            if (
                Date.now() + refetchInterval * 1000 <
                token.accessTokenExpired
            ) {
                return token;
            }
            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        session({ session, token }) {
            if (token) {
                session.user = token.user;
                session.error = token.error;
                session.accessToken = token.accessToken;
            }

            return session;
        },
    },
});
