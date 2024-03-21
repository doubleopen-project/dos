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

import axios from "axios";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
    try {
        console.log("In refreshAccessToken");
        const keycloakUrlToRefreshToken = `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`;
        const keycloakParamsToRefreshToken = new URLSearchParams();
        const keycloakRefreshTokenBody = {
            refreshToken: token?.refreshToken,
        };

        keycloakParamsToRefreshToken.append(
            "client_id",
            process.env.KEYCLOAK_CLIENT_ID!,
        );
        keycloakParamsToRefreshToken.append("grant_type", "refresh_token");
        keycloakParamsToRefreshToken.append(
            "refresh_token",
            keycloakRefreshTokenBody.refreshToken,
        );

        const keycloakConfigToRefreshToken = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        let keycloakRefreshTokenResponse;
        let retries = 3;

        while (retries > 0) {
            try {
                keycloakRefreshTokenResponse = await axios.post(
                    keycloakUrlToRefreshToken,
                    keycloakParamsToRefreshToken,
                    keycloakConfigToRefreshToken,
                );
            } catch (error) {
                retries--;
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 504 && retries > 0) {
                        console.log(
                            "Failed to get access token due to gateway timeout. Retrying in five seconds...",
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, 5000),
                        );
                    } else if (error.code === "ETIMEDOUT" && retries > 0) {
                        console.log(
                            "Failed to get access token due to timeout error. Retrying in five seconds...",
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, 5000),
                        );
                    } else {
                        throw error;
                    }
                }
            }
        }

        if (!keycloakRefreshTokenResponse)
            throw new Error("Failed to get access token");

        const refreshedTokens = keycloakRefreshTokenResponse.data;

        return {
            ...token,
            accessToken: refreshedTokens.data.access_token,
            accessTokenExpired:
                Date.now() + refreshedTokens.data.expires_in * 1000,
            refreshToken:
                refreshedTokens.data.refresh_token ?? token.refreshToken,
            refreshTokenExpired:
                Date.now() + refreshedTokens.data.refresh_expires_in * 1000,
        };
    } catch (error) {
        //console.log(error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export default NextAuth({
    providers: [
        KeycloakProvider({
            id: "keycloak",
            name: "Keycloak",
            clientId: process.env.KEYCLOAK_CLIENT_ID || "",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
            issuer: process.env.KEYCLOAK_ISSUER || "",
            requestTokenUrl: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
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
                token.id_token = account.id_token;

                return token;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpired) {
                return token;
            }
            console.log("In jwt, access token expired");
            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        session({ session, token }) {
            if (token) {
                session.user = token.user;
                session.error = token.error;
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
                session.accessTokenExpired = token.accessTokenExpired;
            }

            return session;
        },
    },
});
