// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect } from "@playwright/test";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { test } from "./fixtures/user";

type ClearanceGroups = ZodiosResponseByAlias<
    typeof userAPI,
    "GetUserClearanceGroups"
>;

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
