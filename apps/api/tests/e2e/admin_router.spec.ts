// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { randHex } from "@ngneat/falso";
import { ZodiosResponseByAlias } from "@zodios/core";
import { ApiScope } from "database";
import { adminAPI } from "validation-helpers";
import {
    createClearanceGroup,
    createClearanceGroupCurators,
    createLicenseConclusion,
    deleteApiClient,
    deleteClearanceGroup,
    deleteLicenseConclusion,
    getOrCreateCurator,
} from "../../src/helpers/db_queries";
import {
    createUser,
    deleteUser,
    getUsers,
} from "../../src/helpers/keycloak_queries";
import { expect, test } from "./fixtures/admin";

type Curators = ZodiosResponseByAlias<typeof adminAPI, "GetCurators">;

type ApiClients = ZodiosResponseByAlias<typeof adminAPI, "GetApiClients">;

test.describe("API lets authenticated admins to", () => {
    test("retrieve packages", async ({ adminContext }) => {
        const packagesRes = await adminContext.get("packages");
        expect(packagesRes.ok()).toBe(true);

        const packages = await packagesRes.json();
        expect(packages.packages.length).toBeGreaterThan(0);
    });

    test("retrieve count for packages", async ({ adminContext }) => {
        const packagesCountRes = await adminContext.get("packages/count");
        expect(packagesCountRes.ok()).toBe(true);

        const packagesCount = await packagesCountRes.json();
        expect(packagesCount.count).toBeGreaterThan(0);
    });
});

test.describe("API lets authenticated admins to", () => {
    let adminUserId: string;
    let userId: string;
    let adminCuratorId: string;
    const testPurl =
        "pkg:npm/dos-monorepo@0.0.0?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Fdoubleopen-project%2Fdos.git&vcs_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6&resolved_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6";
    const licenseConclusionIds: number[] = [];

    test.beforeAll(async () => {
        const adminUser = await getUsers("test-admin");
        expect(adminUser).toBeDefined();
        expect(adminUser.length).toBe(1);
        adminUserId = adminUser[0].id;

        const user = await getUsers("test-user");
        expect(user).toBeDefined();
        expect(user.length).toBe(1);
        userId = user[0].id;

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
    });

    test("retrieve curators", async ({ adminContext }) => {
        const curatorsRes = await adminContext.get("curators");
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

    test("add new curator", async ({ adminContext }) => {
        const user = await createUser({
            username: "test-user-tmp",
            credentials: [
                { type: "password", value: "test-user-tmp", temporary: false },
            ],
        });
        const newCuratorRes = await adminContext.post("curators", {
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

    test("reassign clearance items to a new curator ID", async ({
        adminContext,
    }) => {
        await getOrCreateCurator(userId, "test-user");

        const curatorsRes = await adminContext.get("curators");
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

        const response = await adminContext.put("clearance-items/reassign", {
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

    test("add a new clearance group", async ({ adminContext }) => {
        const name = `Test Clearances ${randHex()}`;

        const response = await adminContext.post("clearance-groups", {
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

    test("update a clearance group", async ({ adminContext }) => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const newName = `Updated Clearances ${randHex()}`;
        const updateResponse = await adminContext.patch(
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

    test("delete a clearance group", async ({ adminContext }) => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const deleteResponse = await adminContext.delete(
            `clearance-groups/${createdGroup.id}`,
        );
        expect(deleteResponse.ok()).toBe(true);
    });

    test("retrieve clearance groups", async ({ adminContext }) => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const response = await adminContext.get("clearance-groups");
        expect(response.ok()).toBe(true);
        const clearanceGroups = await response.json();
        expect(clearanceGroups.length).toBeGreaterThan(0);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("retrieve clearance groups count", async ({ adminContext }) => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const response = await adminContext.get("clearance-groups");
        expect(response.ok()).toBe(true);
        const clearanceGroups = await response.json();
        const countResponse = await adminContext.get("clearance-groups/count");
        expect(countResponse.ok()).toBe(true);
        const countResponseBody = await countResponse.json();
        expect(countResponseBody.count).toBe(clearanceGroups.length);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("retrieve clearance group by id", async ({ adminContext }) => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const response = await adminContext.get(
            `clearance-groups/${createdGroup.id}`,
        );
        expect(response.ok()).toBe(true);
        const clearanceGroup = await response.json();
        expect(clearanceGroup.id).toBe(createdGroup.id);
        expect(clearanceGroup.name).toBe(createdGroup.name);

        // Clean up by deleting the created clearance group.
        await deleteClearanceGroup(createdGroup.id);
    });

    test("add curators to a clearance group", async ({ adminContext }) => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        const addCuratorsResponse = await adminContext.post(
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

    test("remove curator from a clearance group", async ({ adminContext }) => {
        const createdGroup = await createClearanceGroup({
            name: `Test Clearances ${randHex()}`,
        });

        await createClearanceGroupCurators([
            { clearanceGroupId: createdGroup.id, curatorId: adminCuratorId },
        ]);

        const deleteCuratorResponse = await adminContext.delete(
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
    test("add users", async ({ userContext }) => {
        const response = await userContext.post("users");
        expect(response.status()).toBe(403);
    });

    test("delete users", async ({ userContext }) => {
        const response = await userContext.delete("users/some-id");
        expect(response.status()).toBe(403);
    });

    test("delete scan results", async ({ userContext }) => {
        const response = await userContext.delete("scan-results");
        expect(response.status()).toBe(403);
    });

    test("trigger purl cleanup", async ({ userContext }) => {
        const response = await userContext.post("purl-cleanup");
        expect(response.status()).toBe(403);
    });

    test("retrieve packages", async ({ userContext }) => {
        const response = await userContext.get("packages");
        expect(response.status()).toBe(403);
    });

    test("retrieve count for packages", async ({ userContext }) => {
        const response = await userContext.get("packages/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve curators", async ({ userContext }) => {
        const response = await userContext.get("curators");
        expect(response.status()).toBe(403);
    });

    test("add a new curator", async ({ userContext }) => {
        const response = await userContext.post("curators", {
            data: {
                remoteId: "some-remote-id",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("reassign clearance items to a new curator ID", async ({
        userContext,
    }) => {
        const response = await userContext.put("clearance-items/reassign", {
            data: {
                curatorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
                newCuratorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea47",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("add a new clearance group", async ({ userContext }) => {
        const response = await userContext.post("clearance-groups", {
            data: {
                name: "Test Clearance Group",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("update a clearance group", async ({ userContext }) => {
        const response = await userContext.patch("clearance-groups/1", {
            data: {
                name: "Updated Clearance Group Name",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("delete a clearance group", async ({ userContext }) => {
        const response = await userContext.delete("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups", async ({ userContext }) => {
        const response = await userContext.get("clearance-groups");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups count", async ({ userContext }) => {
        const response = await userContext.get("clearance-groups/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance group by id", async ({ userContext }) => {
        const response = await userContext.get("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("add curators to a clearance group", async ({ userContext }) => {
        const response = await userContext.post("clearance-groups/1/curators", {
            data: {
                curatorIds: ["bb7ac15c-c2d9-479e-9342-a879b7e8ea46"],
            },
        });
        expect(response.status()).toBe(403);
    });

    test("remove curator from a clearance group", async ({ userContext }) => {
        const response = await userContext.delete(
            "clearance-groups/1/curators/bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
        );
        expect(response.status()).toBe(403);
    });
});

test.describe("API doesn't let readonly users to", () => {
    test.afterAll(async ({ readonlyContext }) => {
        // Dispose all responses.
        await readonlyContext.dispose();
    });

    test("add users", async ({ readonlyContext }) => {
        const response = await readonlyContext.post("users");
        expect(response.status()).toBe(403);
    });

    test("delete users", async ({ readonlyContext }) => {
        const response = await readonlyContext.delete("users/some-id");
        expect(response.status()).toBe(403);
    });

    test("delete scan results", async ({ readonlyContext }) => {
        const response = await readonlyContext.delete("scan-results");
        expect(response.status()).toBe(403);
    });

    test("trigger purl cleanup", async ({ readonlyContext }) => {
        const response = await readonlyContext.post("purl-cleanup");
        expect(response.status()).toBe(403);
    });

    test("retrieve packages", async ({ readonlyContext }) => {
        const response = await readonlyContext.get("packages");
        expect(response.status()).toBe(403);
    });
    test("retrieve count for packages", async ({ readonlyContext }) => {
        const response = await readonlyContext.get("packages/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve curators", async ({ readonlyContext }) => {
        const response = await readonlyContext.get("curators");
        expect(response.status()).toBe(403);
    });

    test("add a new curator", async ({ readonlyContext }) => {
        const response = await readonlyContext.post("curators", {
            data: {
                remoteId: "some-remote-id",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("reassign clearance items to a new curator ID", async ({
        readonlyContext,
    }) => {
        const response = await readonlyContext.put("clearance-items/reassign", {
            data: {
                curatorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
                newCuratorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea47",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("add a new clearance group", async ({ readonlyContext }) => {
        const response = await readonlyContext.post("clearance-groups", {
            data: {
                name: "Test Clearance Group",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("update a clearance group", async ({ readonlyContext }) => {
        const response = await readonlyContext.patch("clearance-groups/1", {
            data: {
                name: "Updated Clearance Group Name",
            },
        });
        expect(response.status()).toBe(403);
    });

    test("delete a clearance group", async ({ readonlyContext }) => {
        const response = await readonlyContext.delete("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups", async ({ readonlyContext }) => {
        const response = await readonlyContext.get("clearance-groups");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance groups count", async ({ readonlyContext }) => {
        const response = await readonlyContext.get("clearance-groups/count");
        expect(response.status()).toBe(403);
    });

    test("retrieve clearance group by id", async ({ readonlyContext }) => {
        const response = await readonlyContext.get("clearance-groups/1");
        expect(response.status()).toBe(403);
    });

    test("add curators to a clearance group", async ({ readonlyContext }) => {
        const response = await readonlyContext.post(
            "clearance-groups/1/curators",
            {
                data: {
                    curatorIds: ["bb7ac15c-c2d9-479e-9342-a879b7e8ea46"],
                },
            },
        );
        expect(response.status()).toBe(403);
    });

    test("remove curator from a clearance group", async ({
        readonlyContext,
    }) => {
        const response = await readonlyContext.delete(
            "clearance-groups/1/curators/bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
        );
        expect(response.status()).toBe(403);
    });
});

test.describe("API doesn't let unauthenticated users to", () => {
    test("add users", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.post("users");
        expect(response.status()).toBe(401);
    });

    test("delete users", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.delete("users/some-id");
        expect(response.status()).toBe(401);
    });

    test("delete scan results", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.delete("scan-results");
        expect(response.status()).toBe(401);
    });

    test("trigger purl cleanup", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.post("purl-cleanup");
        expect(response.status()).toBe(401);
    });

    test("retrieve packages", async ({ unauthenticatedContext }) => {
        // Attempt to retrieve packages without authentication.
        const response = await unauthenticatedContext.get("packages");
        expect(response.status()).toBe(401);
    });

    test("retrieve count for packages", async ({ unauthenticatedContext }) => {
        // Attempt to retrieve package count without authentication.
        const response = await unauthenticatedContext.get("packages/count");
        expect(response.status()).toBe(401);
    });

    test("retrieve curators", async ({ unauthenticatedContext }) => {
        // Attempt to retrieve distinct users without authentication.
        const response = await unauthenticatedContext.get(
            "clearance-items/distinct-users",
        );
        expect(response.status()).toBe(401);
    });

    test("add a new curator", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.post("curators", {
            data: {
                remoteId: "some-remote-id",
            },
        });
        expect(response.status()).toBe(401);
    });

    test("reassign clearance items to a new curator ID", async ({
        unauthenticatedContext,
    }) => {
        // Attempt to reassign clearance items without authentication.
        const response = await unauthenticatedContext.put(
            "clearance-items/reassign",
            {
                data: {
                    curatorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
                    newCuratorId: "bb7ac15c-c2d9-479e-9342-a879b7e8ea47",
                },
            },
        );
        expect(response.status()).toBe(401);
    });

    test("add a new clearance group", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.post("clearance-groups", {
            data: {
                name: "Test Clearance Group",
            },
        });
        expect(response.status()).toBe(401);
    });

    test("update a clearance group", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.patch(
            "clearance-groups/1",
            {
                data: {
                    name: "Updated Clearance Group Name",
                },
            },
        );
        expect(response.status()).toBe(401);
    });

    test("delete a clearance group", async ({ unauthenticatedContext }) => {
        const response =
            await unauthenticatedContext.delete("clearance-groups/1");
        expect(response.status()).toBe(401);
    });

    test("retrieve clearance groups", async ({ unauthenticatedContext }) => {
        const response = await unauthenticatedContext.get("clearance-groups");
        expect(response.status()).toBe(401);
    });

    test("retrieve clearance groups count", async ({
        unauthenticatedContext,
    }) => {
        const response = await unauthenticatedContext.get(
            "clearance-groups/count",
        );
        expect(response.status()).toBe(401);
    });

    test("retrieve clearance group by id", async ({
        unauthenticatedContext,
    }) => {
        const response = await unauthenticatedContext.get("clearance-groups/1");
        expect(response.status()).toBe(401);
    });

    test("add curators to a clearance group", async ({
        unauthenticatedContext,
    }) => {
        const response = await unauthenticatedContext.post(
            "clearance-groups/1/curators",
            {
                data: {
                    curatorIds: ["bb7ac15c-c2d9-479e-9342-a879b7e8ea46"],
                },
            },
        );
        expect(response.status()).toBe(401);
    });

    test("remove curator from a clearance group", async ({
        unauthenticatedContext,
    }) => {
        const response = await unauthenticatedContext.delete(
            "clearance-groups/1/curators/bb7ac15c-c2d9-479e-9342-a879b7e8ea46",
        );
        expect(response.status()).toBe(401);
    });
});

test.describe("POST /clearance-groups/:groupId/assign-items should", () => {
    test("allow admins to move a curator's clearance items to a specified group", async ({
        adminContext,
        regularUser,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const response = await adminContext.post(
            `clearance-groups/${groups.group2.id}/assign-items`,
            {
                data: {
                    curatorId: regularUser.curatorId,
                },
            },
        );
        expect(response.status()).toBe(200);

        const data = await response.json();

        expect(data.added.licenseConclusions.linksCreated).toBe(3);
        expect(data.added.bulkConclusions.linksCreated).toBe(1);
        expect(data.added.pathExclusions.linksCreated).toBe(1);

        expect(data.removed.licenseConclusions.linksDeleted).toBe(3);
        expect(data.removed.bulkConclusions.linksDeleted).toBe(1);
        expect(data.removed.pathExclusions.linksDeleted).toBe(1);
    });

    test("not allow non-admin users to assign clearance items", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `clearance-groups/1/assign-items`;
        expect((await userContext.post(url)).status()).toBe(403);
        expect((await readonlyContext.post(url)).status()).toBe(403);
        expect((await noRolesUserContext.post(url)).status()).toBe(403);
        expect((await unauthenticatedContext.post(url)).status()).toBe(401);
    });
});

test.describe("POST /api-clients should", () => {
    test("allow admins to create API clients", async ({ adminContext }) => {
        const name = `Test API Client ${randHex()}`;

        const response = await adminContext.post("api-clients", {
            data: {
                name: name,
            },
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.name).toBe(name);

        await deleteApiClient(data.id);
    });

    test("not allow non-admin users to create API clients", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-clients`;
        expect((await userContext.post(url)).status()).toBe(403);
        expect((await readonlyContext.post(url)).status()).toBe(403);
        expect((await noRolesUserContext.post(url)).status()).toBe(403);
        expect((await unauthenticatedContext.post(url)).status()).toBe(401);
    });
});

test.describe("PATCH /api-clients/:id should", () => {
    test("allow admins to update API clients", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = (await seed.createApiClient()).apiClient;

        const newName = `Updated API Client ${randHex()}`;
        const updateResponse = await adminContext.patch(
            `api-clients/${apiClient.id}`,
            {
                data: {
                    name: newName,
                },
            },
        );
        expect(updateResponse.status()).toBe(200);
        const updatedClient = await updateResponse.json();
        expect(updatedClient.name).toBe(newName);
    });

    test("not allow non-admin users to update API clients", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-clients/some-id`;
        expect((await userContext.patch(url)).status()).toBe(403);
        expect((await readonlyContext.patch(url)).status()).toBe(403);
        expect((await noRolesUserContext.patch(url)).status()).toBe(403);
        expect((await unauthenticatedContext.patch(url)).status()).toBe(401);
    });
});

test.describe("DELETE /api-clients/:id should", () => {
    test("allow admins to delete API clients", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = (await seed.createApiClient()).apiClient;

        const deleteResponse = await adminContext.delete(
            `api-clients/${apiClient.id}`,
        );
        expect(deleteResponse.status()).toBe(204);
    });

    test("not allow non-admin users to delete API clients", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-clients/some-id`;
        expect((await userContext.delete(url)).status()).toBe(403);
        expect((await readonlyContext.delete(url)).status()).toBe(403);
        expect((await noRolesUserContext.delete(url)).status()).toBe(403);
        expect((await unauthenticatedContext.delete(url)).status()).toBe(401);
    });
});

test.describe("GET /api-clients/:id should", () => {
    test("allow admins to retrieve API clients", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = (await seed.createApiClient()).apiClient;

        const getResponse = await adminContext.get(
            `api-clients/${apiClient.id}`,
        );
        expect(getResponse.status()).toBe(200);
        const retrievedClient = await getResponse.json();
        expect(retrievedClient.id).toBe(apiClient.id);
    });

    test("not allow non-admin users to retrieve API clients", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-clients/some-id`;
        expect((await userContext.get(url)).status()).toBe(403);
        expect((await readonlyContext.get(url)).status()).toBe(403);
        expect((await noRolesUserContext.get(url)).status()).toBe(403);
        expect((await unauthenticatedContext.get(url)).status()).toBe(401);
    });
});

test.describe("GET /api-clients should", () => {
    test("allow admins to list API clients", async ({ adminContext, seed }) => {
        const apiClient = (await seed.createApiClient()).apiClient;

        const listResponse = await adminContext.get(`api-clients`);
        expect(listResponse.status()).toBe(200);
        const clients: ApiClients = await listResponse.json();
        expect(
            clients.find((client) => client.id === apiClient.id),
        ).toBeDefined();
    });

    test("not allow non-admin users to list API clients", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-clients`;
        expect((await userContext.get(url)).status()).toBe(403);
        expect((await readonlyContext.get(url)).status()).toBe(403);
        expect((await noRolesUserContext.get(url)).status()).toBe(403);
        expect((await unauthenticatedContext.get(url)).status()).toBe(401);
    });
});

test.describe("GET /api-clients/count should", () => {
    test("allow admins to get API clients count", async ({
        adminContext,
        seed,
    }) => {
        await seed.createApiClient();

        const countResponse = await adminContext.get(`api-clients/count`);
        expect(countResponse.status()).toBe(200);
        const countData = await countResponse.json();

        const listResponse = await adminContext.get(`api-clients`);
        expect(listResponse.status()).toBe(200);
        const clients: ApiClients = await listResponse.json();

        expect(countData.count).toBeGreaterThan(0);
        expect(countData.count).toBe(clients.length);
    });

    test("not allow non-admin users to get API clients count", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-clients/count`;
        expect((await userContext.get(url)).status()).toBe(403);
        expect((await readonlyContext.get(url)).status()).toBe(403);
        expect((await noRolesUserContext.get(url)).status()).toBe(403);
        expect((await unauthenticatedContext.get(url)).status()).toBe(401);
    });
});

test.describe("POST /api-clients/:id/api-tokens should", () => {
    test("allow admins to create API tokens", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = await seed.createApiClient();
        const groups = await seed.createClearanceGroups();

        const response = await adminContext.post(
            `api-clients/${apiClient.apiClient.id}/api-tokens`,
            {
                data: {
                    description: "Test API Token",
                    scopes: [ApiScope.SCAN_DATA, ApiScope.CLEARANCE_DATA],
                    clearanceGroupIds: [
                        groups.group3.id,
                        groups.group1.id,
                        groups.group2.id,
                    ],
                },
            },
        );
        expect(response.status()).toBe(200);

        const data = await response.json();

        expect(data.tokenSecret).toBeDefined();
        expect(data.token.description).toBe("Test API Token");
        expect(data.token.scopes).toEqual([
            { scope: ApiScope.SCAN_DATA },
            { scope: ApiScope.CLEARANCE_DATA },
        ]);
        expect(data.token.clearanceGroups.length).toBe(3);

        expect(data.token.clearanceGroups).toEqual([
            {
                clearanceGroup: {
                    id: groups.group3.id,
                    name: groups.group3.name,
                },
                rank: 1,
            },
            {
                clearanceGroup: {
                    id: groups.group1.id,
                    name: groups.group1.name,
                },
                rank: 2,
            },
            {
                clearanceGroup: {
                    id: groups.group2.id,
                    name: groups.group2.name,
                },
                rank: 3,
            },
        ]);
    });

    test("not allow non-admin users to create API tokens", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-clients/some-id/api-tokens`;
        expect((await userContext.post(url)).status()).toBe(403);
        expect((await readonlyContext.post(url)).status()).toBe(403);
        expect((await noRolesUserContext.post(url)).status()).toBe(403);
        expect((await unauthenticatedContext.post(url)).status()).toBe(401);
    });
});

test.describe("POST /api-tokens/:id/rotate should", () => {
    test("allow admins to rotate API tokens", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = await seed.createApiClient();
        const apiToken = await seed.createApiToken(apiClient.apiClient.id);

        const rotateResponse = await adminContext.post(
            `api-tokens/${apiToken.apiToken.id}/rotate`,
        );
        expect(rotateResponse.status()).toBe(200);

        const rotatedData = await rotateResponse.json();

        expect(rotatedData.tokenSecret).toBeDefined();
        expect(rotatedData.tokenSecret).not.toBe(apiToken.tokenSecret);
    });

    test("not allow non-admin users to rotate API tokens", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-tokens/some-id/rotate`;
        expect((await userContext.post(url)).status()).toBe(403);
        expect((await readonlyContext.post(url)).status()).toBe(403);
        expect((await noRolesUserContext.post(url)).status()).toBe(403);
        expect((await unauthenticatedContext.post(url)).status()).toBe(401);
    });
});

test.describe("POST /api-tokens/:id/revoke should", () => {
    test("allow admins to revoke API tokens", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = await seed.createApiClient();
        const apiToken = await seed.createApiToken(apiClient.apiClient.id);

        const revokeResponse = await adminContext.post(
            `api-tokens/${apiToken.apiToken.id}/revoke`,
        );
        expect(revokeResponse.status()).toBe(200);

        const revokedData = await revokeResponse.json();

        expect(revokedData.isActive).toBe(false);
    });

    test("not allow non-admin users to revoke API tokens", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-tokens/some-id/revoke`;
        expect((await userContext.post(url)).status()).toBe(403);
        expect((await readonlyContext.post(url)).status()).toBe(403);
        expect((await noRolesUserContext.post(url)).status()).toBe(403);
        expect((await unauthenticatedContext.post(url)).status()).toBe(401);
    });
});

test.describe("PATCH /api-tokens/:id should", () => {
    test("remove and add scopes correctly", async ({ adminContext, seed }) => {
        const apiClient = await seed.createApiClient();
        const apiToken = await seed.createApiToken(apiClient.apiClient.id, [
            ApiScope.SCAN_DATA,
        ]);

        const updateResponse = await adminContext.patch(
            `api-tokens/${apiToken.apiToken.id}`,
            {
                data: {
                    scopes: [ApiScope.CLEARANCE_DATA],
                },
            },
        );
        expect(updateResponse.status()).toBe(200);
        const updatedToken = await updateResponse.json();
        expect(updatedToken.scopes).toEqual([
            { scope: ApiScope.CLEARANCE_DATA },
        ]);
    });

    test("update clearance groups and their ranks correctly", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = await seed.createApiClient();
        const groups = await seed.createClearanceGroups();
        const apiToken = await seed.createApiToken(
            apiClient.apiClient.id,
            [ApiScope.SCAN_DATA, ApiScope.CLEARANCE_DATA],
            [groups.group1.id, groups.group2.id],
        );

        const updateResponse = await adminContext.patch(
            `api-tokens/${apiToken.apiToken.id}`,
            {
                data: {
                    clearanceGroupIds: [groups.group3.id, groups.group1.id],
                },
            },
        );
        expect(updateResponse.status()).toBe(200);
        const updatedToken = await updateResponse.json();
        expect(updatedToken.clearanceGroups).toEqual([
            {
                clearanceGroup: {
                    id: groups.group3.id,
                    name: groups.group3.name,
                },
                rank: 1,
            },
            {
                clearanceGroup: {
                    id: groups.group1.id,
                    name: groups.group1.name,
                },
                rank: 2,
            },
        ]);
    });

    test("not allow non-admin users to update API tokens", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-tokens/some-id`;
        expect((await userContext.patch(url)).status()).toBe(403);
        expect((await readonlyContext.patch(url)).status()).toBe(403);
        expect((await noRolesUserContext.patch(url)).status()).toBe(403);
        expect((await unauthenticatedContext.patch(url)).status()).toBe(401);
    });
});

test.describe("GET /api-tokens/:id should", () => {
    test("allow admins to retrieve API tokens", async ({
        adminContext,
        seed,
    }) => {
        const apiClient = await seed.createApiClient();
        const apiToken = await seed.createApiToken(apiClient.apiClient.id);

        const getResponse = await adminContext.get(
            `api-tokens/${apiToken.apiToken.id}`,
        );
        expect(getResponse.status()).toBe(200);
        const retrievedToken = await getResponse.json();
        expect(retrievedToken.description).toBe(apiToken.apiToken.description);
    });

    test("not allow non-admin users to retrieve API tokens", async ({
        userContext,
        readonlyContext,
        noRolesUserContext,
        unauthenticatedContext,
    }) => {
        const url = `api-tokens/some-id`;
        expect((await userContext.get(url)).status()).toBe(403);
        expect((await readonlyContext.get(url)).status()).toBe(403);
        expect((await noRolesUserContext.get(url)).status()).toBe(403);
        expect((await unauthenticatedContext.get(url)).status()).toBe(401);
    });
});
