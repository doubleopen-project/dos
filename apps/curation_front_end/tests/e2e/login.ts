// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, Page } from "@playwright/test";

export async function login(page: Page) {
    await page.goto("http://localhost:3000/login");
    await page.fill('input[name="username"]', "test");
    await page.fill('input[name="password"]', "test");
    await page.click("button:has-text('Login')");

    // Expect to be redirected to the home page.
    await expect(
        page.getByRole("heading", { name: "Welcome to DoubleOpen Front End" }),
    ).toBeVisible();
}
