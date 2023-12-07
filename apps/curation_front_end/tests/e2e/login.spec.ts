// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test("logs in", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    // Fill the login form.
    await page.fill("[name='username']", "test");
    await page.fill("[name='password']", "test");

    // Submit the form.
    await page.click("button:has-text('Login')");

    // Expect to be redirected to the home page.
    await expect(
        page.getByRole("heading", { name: "Welcome to DoubleOpen Front End" }),
    ).toBeVisible();
});
