// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { dosApi, authAPI, userAPI } from "validation-helpers";
import { Zodios } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";


const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

export const zodios = new Zodios(baseUrl, dosApi);
export const zodiosHooks = new ZodiosHooks("dosApi", zodios);

export const authZodios = new Zodios(baseUrl + 'auth/', authAPI);
export const authHooks = new ZodiosHooks("authApi", authZodios);

export const userZodios = new Zodios(baseUrl + 'user/', userAPI);
export const userHooks = new ZodiosHooks("userApi", userZodios);