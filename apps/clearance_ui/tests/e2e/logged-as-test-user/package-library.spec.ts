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

    // Write "dos-monorepo" to the search input and press enter
    await page.getByPlaceholder("Search packages by name").fill("dos-monorepo");
    await page.keyboard.press("Enter");

    // Expect to see the DOS monorepo
    await expect(
        page.locator(
            '[href*="/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0"]',
            { hasText: "dos-monorepo" },
        ),
    ).toBeVisible();

    // Click the DOS monorepo link on the row that has type "generic"
    // and check that it opens up in the curation UI view

    await Promise.all([
        page.waitForNavigation(),
        page
            .locator(
                '[href*="/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0"]',
                { hasText: "dos-monorepo" },
            )
            .click(),
    ]);
    expect(page.url()).toBe(
        "http://localhost:3000/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0",
    );
});
