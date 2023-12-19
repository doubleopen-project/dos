// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("sees DOS monorepo in package library and chooses the package to curation UI", async ({
    page,
}) => {
    // Navigate to the package library
    await page.goto("/packages");

    // Expect to see the Package Library title
    await expect(
        page.getByRole("heading", { name: "Package Library" }),
    ).toBeVisible();

    // Expect to see the DOS monorepo
    await expect(
        page.getByRole("link", { name: "dos-monorepo" }),
    ).toBeVisible();

    // Click the DOS monorepo and check that it opens up in the curation UI view
    await Promise.all([
        page.waitForNavigation(),
        page.click("a:has-text('dos-monorepo')"),
    ]);
    expect(page.url()).toBe(
        "http://localhost:3000/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0",
    );
});
