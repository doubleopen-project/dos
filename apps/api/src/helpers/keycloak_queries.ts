// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Zodios, ZodiosResponseByAlias } from "@zodios/core";
import { isAxiosError } from "axios";
import NodeCache from "node-cache";
import { keycloakAPI } from "validation-helpers";
import { CustomError } from "./custom_error";

const kcClient = new Zodios(
    process.env.KEYCLOAK_URL || "https://auth.dev.doubleopen.io/",
    keycloakAPI,
);

const cache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 60 });

type Token = ZodiosResponseByAlias<typeof keycloakAPI, "GetAccessToken">;

export const getAccessToken = async (): Promise<Token> => {
    let retries = 3;
    let token: { token: Token; expires_at: number } | undefined =
        cache.get("adminToken");

    const tokenExpired: boolean =
        token !== undefined && new Date(token.expires_at) < new Date();

    if (token && !tokenExpired) return token.token;

    if (token) {
        try {
            const accessToken = await kcClient.GetAccessToken(
                {
                    client_id: "admin-cli",
                    grant_type: "refresh_token",
                    refresh_token: token.token.refresh_token,
                    client_secret: process.env
                        .KEYCLOAK_ADMIN_CLIENT_SECRET as string,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                        realm: process.env.KEYCLOAK_REALM as string,
                    },
                },
            );
            cache.set("adminToken", {
                token: accessToken,
                expires_at: Date.now() + accessToken.expires_in * 1000,
            });
            return accessToken;
        } catch (error) {
            console.log("Failed to refresh token. Error: ", error);
            console.log("Getting new token...");
        }
    }

    while (retries > 0) {
        try {
            const accessToken = await kcClient.GetAccessToken(
                {
                    client_id: "admin-cli",
                    username: process.env.KEYCLOAK_ADMIN_USERNAME as string,
                    password: process.env.KEYCLOAK_ADMIN_PASSWORD as string,
                    grant_type: "password",
                    client_secret: process.env
                        .KEYCLOAK_ADMIN_CLIENT_SECRET as string,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                        realm: process.env.KEYCLOAK_REALM as string,
                    },
                },
            );
            token = {
                token: accessToken,
                expires_at: Date.now() + accessToken.expires_in * 1000,
            };
            break;
        } catch (error) {
            if (isAxiosError(error)) {
                retries--;
                if (error.response?.status === 504 && retries > 0) {
                    console.log(
                        "Failed to get access token due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to get access token due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else {
                    console.log(error);
                    throw new CustomError(
                        "Failed to get access token. Error: " + error.message,
                        500,
                    );
                }
            } else {
                console.log("Failed to get access token. Error: ", error);
                throw new CustomError(
                    "Failed to get access token. Error: " + error,
                    500,
                );
            }
        }
    }
    if (token) {
        cache.set("adminToken", token);
        return token.token;
    } else {
        throw new CustomError("Failed to get access token", 500);
    }
};

export const logoutUser = async (
    userId: string,
): Promise<{ message: string }> => {
    let retries = 3;
    let response = null;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            response = await kcClient.LogoutUser(undefined, {
                params: {
                    realm: process.env.KEYCLOAK_REALM as string,
                    id: userId,
                },
                headers: {
                    Authorization: "Bearer " + token.access_token,
                },
            });
            break;
        } catch (error) {
            if (isAxiosError(error)) {
                retries--;
                if (error.response?.status === 504 && retries > 0) {
                    console.log(
                        "Failed to logout user due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to logout user due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else {
                    console.log(error);
                    console.log(
                        "Failed to logout user. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to logout user. Error: " + error.message,
                        500,
                    );
                }
            } else {
                console.log("Failed to logout user. Error: ", error);
                throw new CustomError(
                    "Failed to logout user. Error: " + error,
                    500,
                );
            }
        }
    }
    if (!response) throw new CustomError("Failed to logout user", 500);
    return response;
};
