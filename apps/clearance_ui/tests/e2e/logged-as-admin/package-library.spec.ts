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
            '[href*="/packages/pkg%3Anpm%2Fdos-monorepo%400.0.0%3Fvcs_type%3DGit%26vcs_url%3Dhttps%253A%252F%252Fgithub.com%252Fdoubleopen-project%252Fdos.git%26vcs_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6%26resolved_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6"]',
            { hasText: "dos-monorepo" },
        ),
    ).toBeVisible();

    // Click the DOS monorepo link on the row that has type "generic"
    // and check that it opens up in the curation UI view

    await Promise.all([
        page.waitForNavigation(),
        page
            .locator(
                '[href*="/packages/pkg%3Anpm%2Fdos-monorepo%400.0.0%3Fvcs_type%3DGit%26vcs_url%3Dhttps%253A%252F%252Fgithub.com%252Fdoubleopen-project%252Fdos.git%26vcs_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6%26resolved_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6"]',
                { hasText: "dos-monorepo" },
            )
            .click(),
    ]);
    expect(page.url()).toContain(
        "/packages/pkg%3Anpm%2Fdos-monorepo%400.0.0%3Fvcs_type%3DGit%26vcs_url%3Dhttps%253A%252F%252Fgithub.com%252Fdoubleopen-project%252Fdos.git%26vcs_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6%26resolved_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6",
    );
});

test("sees Package Library menu item in side menu", async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");

    // Open the side menu
    await page.click('[aria-label="Open side menu"]');

    // Expect to see the Package Library menu item
    await expect(page.locator("text=Package Library")).toBeVisible();
});
