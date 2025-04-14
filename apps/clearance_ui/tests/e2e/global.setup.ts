// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test as setup } from "@playwright/test";
import {
    ADMIN_AUTH_STORAGE_PATH,
    READONLY_AUTH_STORAGE_PATH,
    USER_AUTH_STORAGE_PATH,
} from "../../playwright.config";

setup("authenticate as user", async ({ page }) => {
    // Clear old session cookie from the browser
    await page.goto("/api/auth/signout");

    // Click the button with "Sign out" text
    await page.click("button:has-text('Sign out')");

    // Go to NextAuth.js signin page
    await page.goto("/api/auth/signin");

    // Click the button with "Sign in with Keycloak" text
    await page.click("button:has-text('Sign in with Keycloak')");

    // Fill the login form
    await page.fill("#username", "test-user");
    await page.fill("#password", "test-user");

    // Submit login form
    await page.click('button[type="submit"]');

    // Expect to be redirected to the home page
    await expect(
        page.getByRole("heading", {
            name: "Welcome to Double Open Clearance UI",
        }),
    ).toBeVisible();

    // Store the login state
    await page.context().storageState({ path: USER_AUTH_STORAGE_PATH });
});

setup("authenticate as readonly user", async ({ page }) => {
    // Clear old session cookie from the browser
    await page.goto("/api/auth/signout");

    // Click the button with "Sign out" text
    await page.click("button:has-text('Sign out')");

    // Go to NextAuth.js signin page
    await page.goto("/api/auth/signin");

    // Click the button with "Sign in with Keycloak" text
    await page.click("button:has-text('Sign in with Keycloak')");

    // Fill the login form
    await page.fill("#username", "test-readonly");
    await page.fill("#password", "test-readonly");

    // Submit login form
    await page.click('button[type="submit"]');

    // Expect to be redirected to the home page
    await expect(
        page.getByRole("heading", {
            name: "Welcome to Double Open Clearance UI",
        }),
    ).toBeVisible();

    // Store the login state
    await page.context().storageState({ path: READONLY_AUTH_STORAGE_PATH });
});

setup("authenticate as admin", async ({ page }) => {
    // Clear old session cookie from the browser
    await page.goto("/api/auth/signout");

    // Click the button with "Sign out" text
    await page.click("button:has-text('Sign out')");

    // Go to NextAuth.js signin page
    await page.goto("/api/auth/signin");

    // Click the button with "Sign in with Keycloak" text
    await page.click("button:has-text('Sign in with Keycloak')");

    // Fill the login form
    await page.fill("#username", "test-admin");
    await page.fill("#password", "test-admin");

    // Submit login form
    await page.click('button[type="submit"]');

    // Expect to be redirected to the home page
    await expect(
        page.getByRole("heading", {
            name: "Welcome to Double Open Clearance UI",
        }),
    ).toBeVisible();

    // Store the login state
    await page.context().storageState({ path: ADMIN_AUTH_STORAGE_PATH });
});
