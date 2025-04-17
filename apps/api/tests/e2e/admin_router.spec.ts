// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import test, { APIRequestContext, expect } from "@playwright/test";
import { Zodios, ZodiosInstance } from "@zodios/core";
import { adminAPI } from "validation-helpers";
import { getAccessToken } from "./utils/get_access_token";

const baseUrl = process.env.CI ? "http://api:3001" : "http://localhost:5000";

test.describe("An admin should", () => {
    let adminZodios: ZodiosInstance<typeof adminAPI>;

    test.beforeAll(async () => {
        // Retrieve the access token for the admin user from Keycloak.
        const keycloakToken = await getAccessToken("test-admin", "test-admin");

        // Create a Zodios client for the admin API with the Keycloak token in the headers.
        adminZodios = new Zodios(`${baseUrl}/api/admin/`, adminAPI, {
            axiosConfig: {
                headers: {
                    Authorization: `Bearer ${keycloakToken}`,
                },
            },
        });
    });

    test("be able to retrieve packages", async () => {
        const response = await adminZodios.GetPackages({});
        expect(response).toBeDefined();
        expect(response.packages).toBeDefined();
        expect(response.packages.length).toBeGreaterThan(0);
    });
});

test.describe("Request should fail for a regular user with error code 403", () => {
    let apiContext: APIRequestContext;
    let keycloakToken;

    test.beforeAll(async ({ playwright }) => {
        // Retrieve the access token for the user from Keycloak.
        keycloakToken = await getAccessToken("test-user", "test-user");

        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/admin/`,
            extraHTTPHeaders: {
                Authorization: `Bearer ${keycloakToken}`,
            },
        });
    });

    test("GET /packages", async () => {
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(403);
    });
});

test.describe("Request should fail for a readonly user with error code 403", () => {
    let apiContext: APIRequestContext;
    let keycloakToken;

    test.beforeAll(async ({ playwright }) => {
        // Retrieve the access token for the readonly user from Keycloak.
        keycloakToken = await getAccessToken("readonly-user", "readonly-user");

        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/admin/`,
            extraHTTPHeaders: {
                Authorization: `Bearer ${keycloakToken}`,
            },
        });
    });

    test("GET /packages", async () => {
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(403);
    });
    test("GET /packages/count", async () => {
        const response = await apiContext.get("packages/count");
        expect(response.status()).toBe(403);
    });

    test.afterAll(async ({}) => {
        // Dispose all responses.
        await apiContext.dispose();
    });
});

test.describe("Request should fail for an unauthenticated user with error code 401", () => {
    let apiContext: APIRequestContext;

    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/admin/`,
        });
    });

    test("GET /packages", async () => {
        // Attempt to retrieve packages without authentication.
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(401);
    });

    test.afterAll(async ({}) => {
        // Dispose all responses.
        await apiContext.dispose();
    });
});
