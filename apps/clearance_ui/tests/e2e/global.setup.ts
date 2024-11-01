// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test as setup } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";

setup("logs in", async ({ page }) => {
    if (!process.env.E2E_USER_USERNAME || !process.env.E2E_USER_PASSWORD) {
        throw new Error(
            "E2E_USER_USERNAME and E2E_USER_PASSWORD environment variables must be set",
        );
    }
    // Clear old session cookie from the browser
    await page.goto("/api/auth/signout");

    // Click the button with "Sign out" text
    await page.click("button:has-text('Sign out')");

    // Go to NextAuth.js signin page
    await page.goto("/api/auth/signin");

    // Click the button with "Sign in with Keycloak" text
    await page.click("button:has-text('Sign in with Keycloak')");

    // Fill the login form
    await page.fill("#username", process.env.E2E_USER_USERNAME);
    await page.fill("#password", process.env.E2E_USER_PASSWORD);

    // Submit login form
    await page.click('button[type="submit"]');

    // Expect to be redirected to the home page
    await expect(
        page.getByRole("heading", {
            name: "Welcome to Double Open Clearance UI",
        }),
    ).toBeVisible();

    // Store the login state
    await page.context().storageState({ path: STORAGE_STATE });
});
