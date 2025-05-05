// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import test, { APIRequestContext, expect } from "@playwright/test";
import {
    createLicenseConclusion,
    deleteLicenseConclusion,
} from "../../src/helpers/db_queries";
import { getUsers } from "../../src/helpers/keycloak_queries";
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

test.describe("API lets authenticated admins to", () => {
    let keycloakToken: string;
    let adminUserId: string;
    let apiContext: APIRequestContext;
    const testPurl =
        "pkg:npm/dos-monorepo@0.0.0?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Fdoubleopen-project%2Fdos.git&vcs_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6&resolved_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6";
    const licenseConclusionIds: number[] = [];

    test.beforeAll(async ({ playwright }) => {
        const adminUser = await getUsers("test-admin");
        expect(adminUser).toBeDefined();
        expect(adminUser.length).toBe(1);
        adminUserId = adminUser[0].id;

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

        // Add license conclusions for the tests.
        const licenseConclusion1 = await createLicenseConclusion({
            concludedLicenseExpressionSPDX: "MIT",
            detectedLicenseExpressionSPDX:
                "MIT AND (CC0-1.0 AND GPL-2.0-only AND BSD-3-Clause) AND (MIT AND BSD-2-Clause AND GPL-2.0-only AND GCC-exception-2.0 AND CC-BY-3.0)",
            comment: null,
            local: undefined,
            contextPurl: testPurl,
            fileSha256:
                "0cbc1f28243bae937e4a2ca774779471484a8b73cf901d0db68ac1642d8c6828",
            userId: adminUserId,
        });
        licenseConclusionIds.push(licenseConclusion1.id);

        const licenseConclusion2 = await createLicenseConclusion({
            concludedLicenseExpressionSPDX: "MIT",
            detectedLicenseExpressionSPDX:
                "MIT AND LicenseRef-scancode-free-unknown",
            comment: null,
            local: undefined,
            contextPurl: testPurl,
            fileSha256:
                "3033e4e29fa8ea20d8936e68e3f31d53ae6d34912c7c9ebc30709d4481356f50",
            userId: adminUserId,
        });

        licenseConclusionIds.push(licenseConclusion2.id);
    });

    test.afterAll(async () => {
        // Clean up by removing the license conclusions.
        for (const id of licenseConclusionIds) {
            await deleteLicenseConclusion(id);
        }
        // Dispose of the API context to clean up resources.
        await apiContext.dispose();
    });

    test("retrieve data on distinct users that have made clearance items", async () => {
        const distinctUsersRes = await apiContext.get(
            "clearance-items/distinct-users",
        );
        expect(distinctUsersRes.ok()).toBe(true);

        const distinctUsers = await distinctUsersRes.json();
        expect(distinctUsers.users.length).toBeGreaterThan(0);

        expect(distinctUsers.users).toContainEqual(
            expect.objectContaining({
                id: adminUserId,
                username: "test-admin",
            }),
        );

        // Expect to find the admin user ID in the list of distinct user IDs only once.
        const userIdCount = distinctUsers.users.filter(
            (user: { id: string; username: string | undefined }) =>
                user.id === adminUserId,
        ).length;
        expect(userIdCount).toBe(1);
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

    test("retrieve data on distinct users that have made clearance items", async () => {
        const response = await apiContext.get("clearance-items/distinct-users");
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

    test("retrieve data on distinct users that have made clearance items", async () => {
        const response = await apiContext.get("clearance-items/distinct-users");
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

    test("retrieve data on distinct users that have made clearance items", async () => {
        // Attempt to retrieve distinct users without authentication.
        const response = await apiContext.get("clearance-items/distinct-users");
        expect(response.status()).toBe(401);
    });
});
