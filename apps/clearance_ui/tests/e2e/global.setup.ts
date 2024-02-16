// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test as setup } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";

setup("logs in", async ({ page }) => {
    await page.goto("/");

    // Click the button with "Log in" text
    await page.click("button:has-text('Log in')");

    // Fill the login form
    await page.fill("[name='username']", "test");
    await page.fill("[name='password']", "test");

    // Submit the form
    await page.click("button:has-text('Login')");

    // Expect to be redirected to the home page
    await expect(
        page.getByRole("heading", {
            name: "Welcome to Double Open Clearance UI",
        }),
    ).toBeVisible();

    // Store the login state
    await page.context().storageState({ path: STORAGE_STATE });
});
