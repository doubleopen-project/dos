// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Zodios } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";
import { adminAPI, authAPI, userAPI } from "validation-helpers";
import { getAccessToken } from "@/lib/authTokenManager";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL not set");
}

export const authZodios = new Zodios(baseUrl + "auth/", authAPI);

authZodios.axios.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Error in request interceptor", error);
        return Promise.reject(error);
    },
);
export const authHooks = new ZodiosHooks("authApi", authZodios);

export const adminZodios = new Zodios(baseUrl + "admin/", adminAPI);
adminZodios.axios.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Error in request interceptor", error);
        return Promise.reject(error);
    },
);
export const adminHooks = new ZodiosHooks("adminApi", adminZodios);

export const userZodios = new Zodios(baseUrl + "user/", userAPI);
userZodios.axios.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Error in request interceptor", error);
        return Promise.reject(error);
    },
);
export const userHooks = new ZodiosHooks("userApi", userZodios);
