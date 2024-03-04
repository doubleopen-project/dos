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

import axios, { AxiosError } from "axios";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { IKeycloakRefreshTokenApiResponse } from "@/pages/api/auth/keycloakRefreshToken";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
    try {
        const refreshedTokens =
            await axios.post<IKeycloakRefreshTokenApiResponse>(
                "http://localhost:3000/api/auth/keycloakRefreshToken",
                {
                    refreshToken: token?.refreshToken,
                },
            );

        if (refreshedTokens.status !== 200) {
            throw refreshedTokens;
        }

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

async function doFinalSignoutHandshake(token: JWT) {
    const { id_token } = token;

    try {
        // Add the id_token_hint to the query string
        const params = new URLSearchParams();
        params.append("id_token_hint", id_token);
        const { status, statusText } = await axios.get(
            `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params.toString()}`,
        );

        // The response body should contain a confirmation that the user has been logged out
        console.log("Completed post-logout handshake", status, statusText);
    } catch (e: unknown) {
        console.error(
            "Unable to perform post-logout handshake",
            (e as AxiosError)?.code || e,
        );
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

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        session({ session, token }) {
            if (token) {
                session.user = token.user;
                session.error = token.error;
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
            }

            return session;
        },
    },
    events: {
        signOut({ token }) {
            doFinalSignoutHandshake(token);
        },
    },
});
