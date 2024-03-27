// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Zodios } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";
import { adminAPI, authAPI, keycloakAPI, userAPI } from "validation-helpers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";

export const authZodios = new Zodios(baseUrl + "auth/", authAPI);
export const authHooks = new ZodiosHooks("authApi", authZodios);

export const adminZodios = new Zodios(baseUrl + "admin/", adminAPI);
export const adminHooks = new ZodiosHooks("adminApi", adminZodios);

export const userZodios = new Zodios(baseUrl + "user/", userAPI);
export const userHooks = new ZodiosHooks("userApi", userZodios);

export const kcZodios = new Zodios(
    process.env.KEYCLOAK_URL || "https://auth.dev.doubleopen.io",
    keycloakAPI,
);
export const kcHooks = new ZodiosHooks("keycloakApi", kcZodios);
