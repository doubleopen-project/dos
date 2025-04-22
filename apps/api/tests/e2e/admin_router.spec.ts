// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import test, { APIRequestContext, expect } from "@playwright/test";
import { getAccessToken } from "./utils/get_access_token";

const baseUrl = process.env.CI ? "http://api:3001" : "http://localhost:5000";

test.describe("API lets authenticated admins to", () => {
    let keycloakToken: string;
    let apiContext: APIRequestContext;

    test.beforeAll(async ({ playwright }) => {
        // Retrieve the access token for the admin user from Keycloak.
        keycloakToken = await getAccessToken("test-admin", "test-admin");
        expect(keycloakToken).toBeDefined();

        // Create a new API context for the admin API with the Keycloak token in the headers.
        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/admin/`,
            extraHTTPHeaders: {
                Authorization: `Bearer ${keycloakToken}`,
            },
        });
    });

    test.afterAll(async () => {
        // Dispose of the API context to clean up resources.
        await apiContext.dispose();
    });

    test("retrieve packages", async () => {
        const packagesRes = await apiContext.get("packages");
        expect(packagesRes.ok()).toBe(true);

        const packages = await packagesRes.json();
        expect(packages.packages.length).toBeGreaterThan(0);
    });

    test("retrieve count for packages", async () => {
        const packagesCountRes = await apiContext.get("packages/count");
        expect(packagesCountRes.ok()).toBe(true);

        const packagesCount = await packagesCountRes.json();
        expect(packagesCount.count).toBeGreaterThan(0);
    });
});

test.describe("API doesn't let authenticated regular users to", () => {
    let apiContext: APIRequestContext;
    let keycloakToken;

    test.beforeAll(async ({ playwright }) => {
        // Retrieve the access token for the user from Keycloak.
        keycloakToken = await getAccessToken("test-user", "test-user");
        expect(keycloakToken).toBeDefined();

        // Create a new API context for the admin API with the Keycloak token in the headers.
        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/admin/`,
            extraHTTPHeaders: {
                Authorization: `Bearer ${keycloakToken}`,
            },
        });
    });

    test.afterAll(async () => {
        // Dispose of the API context to clean up resources.
        await apiContext.dispose();
    });

    test("retrieve packages", async () => {
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(403);
    });

    test("retrieve count for packages", async () => {
        const response = await apiContext.get("packages/count");
        expect(response.status()).toBe(403);
    });
});

test.describe("API doesn't let readonly users to", () => {
    let apiContext: APIRequestContext;
    let keycloakToken;

    test.beforeAll(async ({ playwright }) => {
        // Retrieve the access token for the readonly user from Keycloak.
        keycloakToken = await getAccessToken("test-readonly", "test-readonly");
        expect(keycloakToken).toBeDefined();

        // Create a new API context for the admin API with the Keycloak token in the headers.
        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/admin/`,
            extraHTTPHeaders: {
                Authorization: `Bearer ${keycloakToken}`,
            },
        });
    });

    test.afterAll(async () => {
        // Dispose all responses.
        await apiContext.dispose();
    });

    test("retrieve packages", async () => {
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(403);
    });
    test("retrieve count for packages", async () => {
        const response = await apiContext.get("packages/count");
        expect(response.status()).toBe(403);
    });
});

test.describe("API doesn't let unauthenticated users to", () => {
    let apiContext: APIRequestContext;

    test.beforeAll(async ({ playwright }) => {
        // Create a new API context for the admin API without authentication.
        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/admin/`,
        });
    });

    test.afterAll(async () => {
        // Dispose all responses.
        await apiContext.dispose();
    });

    test("retrieve packages", async () => {
        // Attempt to retrieve packages without authentication.
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(401);
    });

    test("retrieve count for packages", async () => {
        // Attempt to retrieve package count without authentication.
        const response = await apiContext.get("packages/count");
        expect(response.status()).toBe(401);
    });
});
