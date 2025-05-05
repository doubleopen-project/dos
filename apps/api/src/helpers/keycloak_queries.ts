// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Zodios, ZodiosResponseByAlias } from "@zodios/core";
import { isAxiosError } from "axios";
import { authConfig } from "common-helpers";
import NodeCache from "node-cache";
import { keycloakAPI, type ClientCredentialsToken } from "validation-helpers";
import { CustomError } from "./custom_error";

const kcClient = new Zodios(authConfig.url, keycloakAPI);

const cache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 60 });

type RealmRole = ZodiosResponseByAlias<typeof keycloakAPI, "GetRealmRoles">[0];

type User = ZodiosResponseByAlias<typeof keycloakAPI, "GetUsers">[0];

export const getAccessToken = async (): Promise<ClientCredentialsToken> => {
    let retries = 3;
    let token:
        | { token: ClientCredentialsToken; expires_at: number }
        | undefined = cache.get("adminToken");

    const tokenExpired: boolean =
        token !== undefined && new Date(token.expires_at) < new Date();

    if (token && !tokenExpired) return token.token;

    while (retries > 0) {
        try {
            const accessToken = (await kcClient.PostToken(
                {
                    client_id: authConfig.clientIdAPI,
                    grant_type: "client_credentials",
                    client_secret: authConfig.clientSecretAPI,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                        realm: authConfig.realm,
                    },
                },
            )) as ClientCredentialsToken; // The endpoint provides a union type, but we know it's a ClientCredentialsToken with this type of request
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
                    realm: authConfig.realm,
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
                    realm: authConfig.realm,
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
                    realm: authConfig.realm,
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
                    realm: authConfig.realm,
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
                    realm: authConfig.realm,
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
                    realm: authConfig.realm,
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
                    realm: authConfig.realm,
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

export const getUser = async (id: string): Promise<User | null> => {
    let retries = 3;
    let user: User | null = null;

    while (retries > 0) {
        try {
            const token = await getAccessToken();
            user = await kcClient.GetUserById({
                params: {
                    realm: authConfig.realm,
                    id: id,
                },
                headers: {
                    Authorization: "Bearer " + token.access_token,
                },
            });
            break;
        } catch (error) {
            if (isAxiosError(error)) {
                retries--;
                if (error.response?.status === 404) {
                    break;
                } else if (error.response?.status === 504 && retries > 0) {
                    console.log(
                        "Failed to get user due to gateway timeout. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else if (error.code === "ETIMEDOUT" && retries > 0) {
                    console.log(
                        "Failed to get user due to timeout error. Retrying in 2 seconds...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } else {
                    console.log(error);
                    console.log(
                        "Failed to get user. Keycloak responded with status code " +
                            error.response?.status,
                    );
                    throw new CustomError(
                        "Failed to get user. Error: " + error.message,
                        500,
                    );
                }
            }
        }
    }

    return user;
};
