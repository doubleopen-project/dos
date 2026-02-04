// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ApiScope } from "database";
import { baseUrl } from "../utils/constants";
import { APIRequestContext, testBase } from "./base";

type Fixtures = {
    validScanDataTokenContext: APIRequestContext;
    validClearanceDataTokenContext: APIRequestContext;
    revokedTokenContext: APIRequestContext;
    invalidTokenContext: APIRequestContext;
    noTokenContext: APIRequestContext;
    groupsContext: (clearanceGroupIds: number[]) => Promise<APIRequestContext>;
};

const scannerRouterBaseUrl = `${baseUrl}/api/`;

export const test = testBase.extend<Fixtures>({
    validScanDataTokenContext: async ({ playwright, seed }, use) => {
        const client = await seed.createApiClient();
        const token = await seed.createApiToken(client.apiClient.id, [
            ApiScope.SCAN_DATA,
        ]);
        const ctx = await playwright.request.newContext({
            baseURL: scannerRouterBaseUrl,
            extraHTTPHeaders: {
                Authorization: `Bearer ${token.tokenSecret}`,
            },
        });
        await use(ctx);
        await ctx.dispose();
    },

    validClearanceDataTokenContext: async ({ playwright, seed }, use) => {
        const client = await seed.createApiClient();
        const token = await seed.createApiToken(client.apiClient.id, [
            ApiScope.CLEARANCE_DATA,
        ]);
        const ctx = await playwright.request.newContext({
            baseURL: scannerRouterBaseUrl,
            extraHTTPHeaders: {
                Authorization: `Bearer ${token.tokenSecret}`,
            },
        });
        await use(ctx);
        await ctx.dispose();
    },

    revokedTokenContext: async ({ playwright, seed }, use) => {
        const client = await seed.createApiClient();
        const token = await seed.createApiToken(
            client.apiClient.id,
            [ApiScope.SCAN_DATA],
            undefined,
            false,
        );
        const ctx = await playwright.request.newContext({
            baseURL: scannerRouterBaseUrl,
            extraHTTPHeaders: {
                Authorization: `Bearer ${token.tokenSecret}`,
            },
        });
        await use(ctx);
        await ctx.dispose();
    },

    invalidTokenContext: async ({ playwright }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: scannerRouterBaseUrl,
            extraHTTPHeaders: {
                Authorization: `Bearer invalid.token.here`,
            },
        });
        await use(ctx);
        await ctx.dispose();
    },

    noTokenContext: async ({ playwright }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: scannerRouterBaseUrl,
        });
        await use(ctx);
        await ctx.dispose();
    },

    groupsContext: async ({ playwright, seed }, use) => {
        const createdContexts: APIRequestContext[] = [];

        await use(async (clearanceGroupIds) => {
            const client = await seed.createApiClient();
            const token = await seed.createApiToken(
                client.apiClient.id,
                [ApiScope.CLEARANCE_DATA],
                clearanceGroupIds,
            );

            const ctx = await playwright.request.newContext({
                baseURL: scannerRouterBaseUrl,
                extraHTTPHeaders: {
                    Authorization: `Bearer ${token.tokenSecret}`,
                },
            });
            createdContexts.push(ctx);
            return ctx;
        });

        for (const ctx of createdContexts) {
            await ctx.dispose();
        }
    },
});

export { expect } from "./base";
