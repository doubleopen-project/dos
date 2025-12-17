// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect } from "@playwright/test";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { test } from "./fixtures/user";
import { testPurl } from "./utils/constants";

type ClearanceGroups = ZodiosResponseByAlias<
    typeof userAPI,
    "GetUserClearanceGroups"
>;

const pathPurl = encodeURIComponent(testPurl);

test.describe("GET /user/clearance-groups should", () => {
    test("return clearance groups based on access for a regular user", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.get("user/clearance-groups");
        expect(res.ok()).toBe(true);
        const data: ClearanceGroups = await res.json();

        const writerIds = data.writer.map((cg) => cg.id);
        const readerIds = data.reader.map((cg) => cg.id);

        expect(writerIds).toContain(groups.group1.id);
        expect(writerIds).not.toContain(groups.group2.id);
        expect(writerIds).not.toContain(groups.group3.id);

        expect(readerIds).toContain(groups.group2.id);
        expect(readerIds).not.toContain(groups.group1.id);
        expect(readerIds).not.toContain(groups.group3.id);
    });

    test("return writer groups as defined by roles, and other groups as readers for an admin user", async ({
        adminContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await adminContext.get("user/clearance-groups");
        expect(res.ok()).toBe(true);
        const data: ClearanceGroups = await res.json();

        const writerIds = data.writer.map((cg) => cg.id);
        const readerIds = data.reader.map((cg) => cg.id);

        expect(writerIds).toContain(groups.group1.id);
        expect(writerIds).not.toContain(groups.group2.id);
        expect(writerIds).not.toContain(groups.group3.id);

        expect(readerIds).toContain(groups.group2.id);
        expect(readerIds).toContain(groups.group3.id);

        expect(readerIds).not.toContain(groups.group1.id);
    });

    test("return 401 for a non-authenticated user", async ({
        unauthenticatedContext,
    }) => {
        const res = await unauthenticatedContext.get("user/clearance-groups");
        expect(res.status()).toBe(401);
    });
});

test.describe("POST /packages/:purl/files/:sha256/license-conclusions should", () => {
    const fileSha256 =
        "0cbc1f28243bae937e4a2ca774779471484a8b73cf901d0db68ac1642d8c6828";

    test("allow a user to make a license conclusion to a clearance group they have writer access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/files/${fileSha256}/license-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    clearanceGroupId: groups.group1.id,
                },
            },
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();
        await userContext.delete(
            `license-conclusions/${data.licenseConclusionId}`,
        );
    });

    test("not allow a user to make a license conclusion to a clearance group they have only reader access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/files/${fileSha256}/license-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    clearanceGroupId: groups.group2.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("not allow a user to make a license conclusion to a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/files/${fileSha256}/license-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    clearanceGroupId: groups.group3.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });
});
