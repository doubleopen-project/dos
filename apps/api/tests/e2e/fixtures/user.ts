// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { baseUrl } from "../utils/constants";
import { APIRequestContext, testBase } from "./base";

type Fixtures = {
    adminContext: APIRequestContext;
    userContext: APIRequestContext;
    noGroupsUserContext: APIRequestContext;
    unauthenticatedContext: APIRequestContext;
};

const userRouterBaseUrl = `${baseUrl}/api/user/`;

export const test = testBase.extend<Fixtures>({
    adminContext: async ({ playwright, adminUser }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: userRouterBaseUrl,
            extraHTTPHeaders: { Authorization: `Bearer ${adminUser.token}` },
        });
        await use(ctx);
        await ctx.dispose();
    },

    userContext: async ({ playwright, regularUser }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: userRouterBaseUrl,
            extraHTTPHeaders: { Authorization: `Bearer ${regularUser.token}` },
        });
        await use(ctx);
        await ctx.dispose();
    },

    noGroupsUserContext: async ({ playwright, noGroupsUser }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: userRouterBaseUrl,
            extraHTTPHeaders: { Authorization: `Bearer ${noGroupsUser.token}` },
        });
        await use(ctx);
        await ctx.dispose();
    },

    unauthenticatedContext: async ({ playwright }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: userRouterBaseUrl,
        });
        await use(ctx);
        await ctx.dispose();
    },
});

export { expect } from "./base";
