// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test("gets redirected to 403 page", async ({ page }) => {
    // Navigate to the package library
    await page.goto("/packages");

    // Expect to see text that indicates the user is not authorized
    await expect(
        page.locator(
            "text=Unauthorized. You are not allowed to access the requested page.",
        ),
    ).toBeVisible();
});

test("doesn't see Package Library menu item in side menu", async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");

    // Open the side menu
    await page.click('[aria-label="Open side menu"]');

    // Expect not to see the Package Library menu item
    await expect(page.locator("text=Package Library")).toBeHidden();
});
