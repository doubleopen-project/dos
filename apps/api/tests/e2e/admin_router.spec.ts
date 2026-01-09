// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { randHex } from "@ngneat/falso";
import test, { APIRequestContext, expect } from "@playwright/test";
import { ZodiosResponseByAlias } from "@zodios/core";
import { adminAPI } from "validation-helpers";
import {
    createClearanceGroup,
    createClearanceGroupCurators,
    createLicenseConclusion,
    deleteClearanceGroup,
    deleteLicenseConclusion,
    getOrCreateCurator,
} from "../../src/helpers/db_queries";
import {
    createUser,
    deleteUser,
    getUsers,
} from "../../src/helpers/keycloak_queries";
import { getAccessToken } from "./utils/get_access_token";

const baseUrl = process.env.CI ? "http://api:3001" : "http://localhost:5000";

type Curators = ZodiosResponseByAlias<typeof adminAPI, "GetCurators">;

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
    let userId: string;
    let adminCuratorId: string;
    let apiContext: APIRequestContext;
    const testPurl =
        "pkg:npm/dos-monorepo@0.0.0?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Fdoubleopen-project%2Fdos.git&vcs_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6&resolved_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6";
    const licenseConclusionIds: number[] = [];

    test.beforeAll(async ({ playwright }) => {
        const adminUser = await getUsers("test-admin");
        expect(adminUser).toBeDefined();
        expect(adminUser.length).toBe(1);
        adminUserId = adminUser[0].id;

        const user = await getUsers("test-user");
        expect(user).toBeDefined();
        expect(user.length).toBe(1);
        userId = user[0].id;

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

        adminCuratorId = await getOrCreateCurator(adminUserId, "test-admin");

        // Add license conclusions for the tests.
        const licenseConclusion1 = await createLicenseConclusion({
            concludedLicenseExpressionSPDX: "MIT",
            detectedLicenseExpressionSPDX:
                "MIT AND (CC0-1.0 AND GPL-2.0-only AND BSD-3-Clause) AND (MIT AND BSD-2-Clause AND GPL-2.0-only AND GCC-exception-2.0 AND CC-BY-3.0)",
            comment: null,
            local: undefined,
            contextPurl: testPurl,
            file: {
                connect: {
                    sha256: "0cbc1f28243bae937e4a2ca774779471484a8b73cf901d0db68ac1642d8c6828",
                },
            },
            curator: { connect: { id: adminCuratorId } },
        });
        licenseConclusionIds.push(licenseConclusion1.id);

        const licenseConclusion2 = await createLicenseConclusion({
            concludedLicenseExpressionSPDX: "MIT",
            detectedLicenseExpressionSPDX:
                "MIT AND LicenseRef-scancode-free-unknown",
            comment: null,
            local: undefined,
            contextPurl: testPurl,
            file: {
                connect: {
                    sha256: "3033e4e29fa8ea20d8936e68e3f31d53ae6d34912c7c9ebc30709d4481356f50",
                },
            },
            curator: { connect: { id: adminCuratorId } },
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

    test("retrieve curators", async () => {
        const curatorsRes = await apiContext.get("curators");
        expect(curatorsRes.ok()).toBe(true);

        const curators: Curators = await curatorsRes.json();
        expect(curators.length).toBeGreaterThan(0);

        expect(curators).toContainEqual(
            expect.objectContaining({
                remoteId: adminUserId,
                username: "test-admin",
            }),
        );

        // Expect to find the admin user ID in the list of distinct user IDs only once.
        const curatorIdCount = curators.filter(
            (curator) => curator.remoteId === adminUserId,
        ).length;
        expect(curatorIdCount).toBe(1);
    });

    test("add new curator", async () => {
        const user = await createUser({
            username: "test-user-tmp",
            credentials: [
                { type: "password", value: "test-user-tmp", temporary: false },
            ],
        });
        const newCuratorRes = await apiContext.post("curators", {
            data: {
                remoteId: user.id,
            },
        });
        expect(newCuratorRes.ok()).toBe(true);
        const newCurator = await newCuratorRes.json();
        expect(newCurator.remoteId).toBe(user.id);
        expect(newCurator.username).toBe("test-user-tmp");

        // Clean up by deleting the created user in Keycloak.
        await deleteUser(user.id);
    });

    test("reassign clearance items to a new curator ID", async () => {
        await getOrCreateCurator(userId, "test-user");

        const curatorsRes = await apiContext.get("curators");
        expect(curatorsRes.ok()).toBe(true);
        const curators: Curators = await curatorsRes.json();

        const adminCuratorId = curators.find(
            (curator) => curator.remoteId === adminUserId,
        )?.id;

        expect(adminCuratorId).toBeDefined();

        const userCuratorId = curators.find(
            (curator) => curator.remoteId === userId,
        )?.id;

        expect(userCuratorId).toBeDefined();

        const response = await apiContext.put("clearance-items/reassign", {
            data: {
                curatorId: adminCuratorId,
                newCuratorId: userCuratorId,
            },
        });
        expect(response.ok()).toBe(true);
        const responseBody = await response.json();
        expect(responseBody.counts.licenseConclusions).toBeGreaterThanOrEqual(
            2,
        );
    });

    test("add a new clearance group", async () => {
        const name = `Test Clearances ${randHex()}`;

        const response = await apiContext.post("clearance-groups", {
            data: {
                name: name,
            },
        });
        expect(response.ok()).toBe(true);
        const responseBody = await response.json();
        expect(responseBody.name).toBe(name);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(responseBody.id);
    });

    test("update a clearance group", async () => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const newName = `Updated Clearances ${randHex()}`;
        const updateResponse = await apiContext.patch(
            `clearance-groups/${createdGroup.id}`,
            {
                data: {
                    name: newName,
                },
            },
        );
        expect(updateResponse.ok()).toBe(true);
        const updatedGroup = await updateResponse.json();
        expect(updatedGroup.name).toBe(newName);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("delete a clearance group", async () => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const deleteResponse = await apiContext.delete(
            `clearance-groups/${createdGroup.id}`,
        );
        expect(deleteResponse.ok()).toBe(true);
    });

    test("retrieve clearance groups", async () => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const response = await apiContext.get("clearance-groups");
        expect(response.ok()).toBe(true);
        const clearanceGroups = await response.json();
        expect(clearanceGroups.length).toBeGreaterThan(0);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("retrieve clearance groups count", async () => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const response = await apiContext.get("clearance-groups");
        expect(response.ok()).toBe(true);
        const clearanceGroups = await response.json();
        const countResponse = await apiContext.get("clearance-groups/count");
        expect(countResponse.ok()).toBe(true);
        const countResponseBody = await countResponse.json();
        expect(countResponseBody.count).toBe(clearanceGroups.length);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("retrieve clearance group by id", async () => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const response = await apiContext.get(
            `clearance-groups/${createdGroup.id}`,
        );
        expect(response.ok()).toBe(true);
        const clearanceGroup = await response.json();
        expect(clearanceGroup.id).toBe(createdGroup.id);
        expect(clearanceGroup.name).toBe(createdGroup.name);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("add curators to a clearance group", async () => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const addCuratorsResponse = await apiContext.post(
            `clearance-groups/${createdGroup.id}/curators`,
            {
                data: {
                    curators: [{ id: adminCuratorId, role: "WRITER" }],
                },
            },
        );

        expect(addCuratorsResponse.ok()).toBe(true);
        const updatedGroup = await addCuratorsResponse.json();
        expect(updatedGroup.curators.length).toBe(1);
        expect(updatedGroup.curators[0].curator.id).toBe(adminCuratorId);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("remove curator from a clearance group", async () => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        await createClearanceGroupCurators([
            { clearanceGroupId: createdGroup.id, curatorId: adminCuratorId },
        ]);

        const deleteCuratorResponse = await apiContext.delete(
            `clearance-groups/${createdGroup.id}/curators/${adminCuratorId}`,
        );

        expect(deleteCuratorResponse.ok()).toBe(true);
        const groupAfterDeletion = await deleteCuratorResponse.json();
        expect(groupAfterDeletion.curators.length).toBe(0);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
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

    test("add users", async () => {
        const response = await apiContext.post("users");
        expect(response.status()).toBe(403);
    });

    test("delete users", async () => {
        const response = await apiContext.delete("users/some-id");
        expect(response.status()).toBe(403);
    });

    test("delete scan results", async () => {
        const response = await apiContext.delete("scan-results");
        expect(response.status()).toBe(403);
    });

    test("trigger purl cleanup", async () => {
        const response = await apiContext.post("purl-cleanup");
        expect(response.status()).toBe(403);
    });

    test("retrieve packages", async () => {
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(403);
    });

    test("retrieve count for packages", async () => {
        const response = await apiContext.get("packages/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve curators", async () => {
        const response = await apiContext.get("curators");
        expect(response.status()).toBe(403);
    });

    test("add a new curator", async () => {
        const response = await apiContext.post("curators", {
            data: {
                remoteId: "some-remote-id",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("reassign clearance items to a new curator ID", async () => {
        const response = await apiContext.put("clearance-items/reassign", {
            data: {
                curatorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
                newCuratorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea47",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("add a new clearance group", async () => {
        const response = await apiContext.post("clearance-groups", {
            data: {
                name: "Test Clearance Group",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("update a clearance group", async () => {
        const response = await apiContext.patch("clearance-groups/1", {
            data: {
                name: "Updated Clearance Group Name",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("delete a clearance group", async () => {
        const response = await apiContext.delete("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups", async () => {
        const response = await apiContext.get("clearance-groups");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups count", async () => {
        const response = await apiContext.get("clearance-groups/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance group by id", async () => {
        const response = await apiContext.get("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("add curators to a clearance group", async () => {
        const response = await apiContext.post("clearance-groups/1/curators", {
            data: {
                curatorIds: ["bb7ac15c-c2d9-479e-9342-a879b7e8ea46"],
            },
        });
        expect(response.status()).toBe(403);
    });

    test("remove curator from a clearance group", async () => {
        const response = await apiContext.delete(
            "clearance-groups/1/curators/bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
        );
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

    test("add users", async () => {
        const response = await apiContext.post("users");
        expect(response.status()).toBe(403);
    });

    test("delete users", async () => {
        const response = await apiContext.delete("users/some-id");
        expect(response.status()).toBe(403);
    });

    test("delete scan results", async () => {
        const response = await apiContext.delete("scan-results");
        expect(response.status()).toBe(403);
    });

    test("trigger purl cleanup", async () => {
        const response = await apiContext.post("purl-cleanup");
        expect(response.status()).toBe(403);
    });

    test("retrieve packages", async () => {
        const response = await apiContext.get("packages");
        expect(response.status()).toBe(403);
    });
    test("retrieve count for packages", async () => {
        const response = await apiContext.get("packages/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve curators", async () => {
        const response = await apiContext.get("curators");
        expect(response.status()).toBe(403);
    });

    test("add a new curator", async () => {
        const response = await apiContext.post("curators", {
            data: {
                remoteId: "some-remote-id",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("reassign clearance items to a new curator ID", async () => {
        const response = await apiContext.put("clearance-items/reassign", {
            data: {
                curatorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
                newCuratorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea47",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("add a new clearance group", async () => {
        const response = await apiContext.post("clearance-groups", {
            data: {
                name: "Test Clearance Group",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("update a clearance group", async () => {
        const response = await apiContext.patch("clearance-groups/1", {
            data: {
                name: "Updated Clearance Group Name",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("delete a clearance group", async () => {
        const response = await apiContext.delete("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups", async () => {
        const response = await apiContext.get("clearance-groups");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups count", async () => {
        const response = await apiContext.get("clearance-groups/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance group by id", async () => {
        const response = await apiContext.get("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("add curators to a clearance group", async () => {
        const response = await apiContext.post("clearance-groups/1/curators", {
            data: {
                curatorIds: ["bb7ac15c-c2d9-479e-9342-a879b7e8ea46"],
            },
        });
        expect(response.status()).toBe(403);
    });

    test("remove curator from a clearance group", async () => {
        const response = await apiContext.delete(
            "clearance-groups/1/curators/bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
        );
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

    test("add users", async () => {
        const response = await apiContext.post("users");
        expect(response.status()).toBe(401);
    });

    test("delete users", async () => {
        const response = await apiContext.delete("users/some-id");
        expect(response.status()).toBe(401);
    });

    test("delete scan results", async () => {
        const response = await apiContext.delete("scan-results");
        expect(response.status()).toBe(401);
    });

    test("trigger purl cleanup", async () => {
        const response = await apiContext.post("purl-cleanup");
        expect(response.status()).toBe(401);
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

    test("retrieve curators", async () => {
        // Attempt to retrieve distinct users without authentication.
        const response = await apiContext.get("clearance-items/distinct-users");
        expect(response.status()).toBe(401);
    });

    test("add a new curator", async () => {
        const response = await apiContext.post("curators", {
            data: {
                remoteId: "some-remote-id",
            },
        });
        expect(response.status()).toBe(401);
    });

    test("reassign clearance items to a new curator ID", async () => {
        // Attempt to reassign clearance items without authentication.
        const response = await apiContext.put("clearance-items/reassign", {
            data: {
                curatorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
                newCuratorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea47",
            },
        });
        expect(response.status()).toBe(401);
    });

    test("add a new clearance group", async () => {
        const response = await apiContext.post("clearance-groups", {
            data: {
                name: "Test Clearance Group",
            },
        });
        expect(response.status()).toBe(401);
    });

    test("update a clearance group", async () => {
        const response = await apiContext.patch("clearance-groups/1", {
            data: {
                name: "Updated Clearance Group Name",
            },
        });
        expect(response.status()).toBe(401);
    });

    test("delete a clearance group", async () => {
        const response = await apiContext.delete("clearance-groups/1");
        expect(response.status()).toBe(401);
    });

    test("retrieve clearance groups", async () => {
        const response = await apiContext.get("clearance-groups");
        expect(response.status()).toBe(401);
    });

    test("retrieve clearance groups count", async () => {
        const response = await apiContext.get("clearance-groups/count");
        expect(response.status()).toBe(401);
    });

    test("retrieve clearance group by id", async () => {
        const response = await apiContext.get("clearance-groups/1");
        expect(response.status()).toBe(401);
    });

    test("add curators to a clearance group", async () => {
        const response = await apiContext.post("clearance-groups/1/curators", {
            data: {
                curatorIds: ["bb7ac15c-c2d9-479e-9342-a879b7e8ea46"],
            },
        });
        expect(response.status()).toBe(401);
    });

    test("remove curator from a clearance group", async () => {
        const response = await apiContext.delete(
            "clearance-groups/1/curators/bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
        );
        expect(response.status()).toBe(401);
    });
});
