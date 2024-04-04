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

type RealmRole = ZodiosResponseByAlias<typeof keycloakAPI, "GetRealmRoles">[0];

type User = ZodiosResponseByAlias<typeof keycloakAPI, "GetUsers">[0];

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
                    client_secret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                        realm: process.env.KEYCLOAK_REALM!,
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
                    username: process.env.KEYCLOAK_ADMIN_USERNAME!,
                    password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
                    grant_type: "password",
                    client_secret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                        realm: process.env.KEYCLOAK_REALM!,
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
    let querySuccess = false;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            await kcClient.LogoutUser(undefined, {
                params: {
                    realm: process.env.KEYCLOAK_REALM!,
                    id: userId,
                },
                headers: {
                    Authorization: "Bearer " + token.access_token,
                },
            });
            querySuccess = true;
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
    if (!querySuccess) {
        throw new CustomError("Failed to logout user", 500);
    }
    return {
        message: "Logged out",
    };
};

export const createUser = async (data: {
    username: string;
    credentials: {
        type: string;
        value: string;
        temporary: boolean;
    }[];
    attributes: {
        dosApiToken: string;
    };
    enabled?: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    emailVerified?: boolean;
}): Promise<User> => {
    let retries = 3;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            await kcClient.CreateUser(data, {
                params: {
                    realm: process.env.KEYCLOAK_REALM!,
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
                        "Failed to create user due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to create user due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.response?.status === 401 && retries > 0) {
                    console.log(
                        "Failed to create user due to unauthorized error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.response?.status === 409) {
                    throw new CustomError(
                        "User with this username or email already exists",
                        400,
                    );
                } else {
                    console.log(error);
                    console.log(
                        "Failed to create user. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to create user. Error: " + error.message,
                        500,
                    );
                }
            } else {
                throw new CustomError(
                    "Failed to create user. Error: " + error,
                    500,
                );
            }
        }
    }

    const user = (await getUsers(data.username, undefined, true))[0];

    if (!user) {
        throw new CustomError("Failed to create user. User not found", 500);
    }
    return user;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
    let retries = 3;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            await kcClient.DeleteUser(undefined, {
                params: {
                    realm: process.env.KEYCLOAK_REALM!,
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
                        "Failed to delete user due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to delete user due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.response?.status === 404) {
                    throw new CustomError("User to delete not found", 404);
                } else {
                    console.log(error);
                    console.log(
                        "Failed to delete user. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to delete user. Error: " + error.message,
                        500,
                    );
                }
            } else {
                console.log("Failed to delete user. Error: ", error);
                throw new CustomError(
                    "Failed to delete user. Error: " + error,
                    500,
                );
            }
        }
    }
    return true;
};

export const getRealmRoles = async (): Promise<RealmRole[]> => {
    let retries = 3;
    let roles: RealmRole[] | null = null;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            roles = await kcClient.GetRealmRoles({
                params: {
                    realm: process.env.KEYCLOAK_REALM!,
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
                        "Failed to get realm roles due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to get realm roles due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else {
                    console.log(error);
                    console.log(
                        "Failed to get realm roles. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to get realm roles. Error: " + error.message,
                        500,
                    );
                }
            } else {
                console.log("Failed to get realm roles. Error: ", error);
                throw new CustomError(
                    "Failed to get realm roles. Error: " + error,
                    500,
                );
            }
        }
    }

    if (!roles) throw new CustomError("Failed to get realm roles", 500);

    return roles;
};

export const addRealmRolesToUser = async (
    userId: string,
    roleNames: string[],
): Promise<boolean> => {
    let roles: RealmRole[] | undefined = cache.get("realmRoles");
    if (!roles) {
        roles = await getRealmRoles();
        cache.set("realmRoles", roles);
    }

    roles = roles.filter((role) => roleNames.includes(role.name));

    let retries = 3;

    while (retries > 0) {
        try {
            const token = await getAccessToken();

            await kcClient.AddRealmRoleToUser(roles, {
                params: {
                    realm: process.env.KEYCLOAK_REALM!,
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
                        "Failed to add realm role to user due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to add realm role to user due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.response?.status === 404) {
                    throw new CustomError("User not found", 404);
                } else {
                    console.log(error);
                    console.log(
                        "Failed to add realm role to user. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to add realm role to user. Error: " +
                            error.message,
                        500,
                    );
                }
            } else {
                console.log("Failed to add realm role to user. Error: ", error);
                throw new CustomError(
                    "Failed to add realm role to user. Error: " + error,
                    500,
                );
            }
        }
    }
    return true;
};

export const getUsers = async (
    username?: string,
    dosApiToken?: string,
    exact?: boolean,
): Promise<User[]> => {
    let retries = 3;
    let users = null;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            users = await kcClient.GetUsers({
                params: {
                    realm: process.env.KEYCLOAK_REALM!,
                },
                queries: {
                    username: username,
                    exact: exact,
                    q: dosApiToken ? "dosApiToken:" + dosApiToken : undefined,
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
                        "Failed to get users due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to get users due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else {
                    console.log(error);
                    console.log(
                        "Failed to get users. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to get users. Error: " + error.message,
                        500,
                    );
                }
            } else {
                console.log("Failed to get users. Error: ", error);
                throw new CustomError(
                    "Failed to get users. Error: " + error,
                    500,
                );
            }
        }
    }
    if (!users) throw new CustomError("Failed to get users", 500);
    return users;
};

export const updateUser = async (
    userId: string,
    data: {
        username?: string;
        credentials?: {
            type: string;
            value: string;
            temporary: boolean;
        }[];
        realmRoles?: string[];
        attributes?: {
            dosApiToken?: string;
        };
        enabled?: boolean;
        firstName?: string;
        lastName?: string;
        email?: string;
        emailVerified?: boolean;
    },
): Promise<boolean> => {
    let retries = 3;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            await kcClient.UpdateUser(data, {
                params: {
                    realm: process.env.KEYCLOAK_REALM!,
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
                        "Failed to update user due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to update user due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.response?.status === 404) {
                    throw new CustomError("User to update not found", 404);
                } else if (error.response?.status === 409) {
                    throw new CustomError(
                        "User with this username or email already exists",
                        400,
                    );
                } else {
                    console.log(error);
                    console.log(
                        "Failed to update user. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to update user. Error: " + error.message,
                        500,
                    );
                }
            } else {
                console.log("Failed to update user. Error: ", error);
                throw new CustomError(
                    "Failed to update user. Error: " + error,
                    500,
                );
            }
        }
    }
    return true;
};
