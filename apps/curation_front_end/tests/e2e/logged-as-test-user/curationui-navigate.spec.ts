// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
})

test("navigates in Curation UI", async ({ page }) => {

    await page.goto(
        "/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0",
    );

    expect(page.getByText("pkg:generic/dos-monorepo@"));
    expect(page.locator("label").filter({ hasText: "No file opened" }));

    // Open a file
    await page.click("text=README.md");
    expect(page.locator("label").filter({ hasText: "README.md" }));

    // Basic navigation
    await page.getByRole("button", { name: ": mit" }).click();
    // TODO: Expect line 5 to become topmost in the editor
    await page.getByRole("button", { name: "RESET" }).click();
    // TODO: Expect line 1 to become topmost in the editor
    await page.getByText("packages", { exact: true }).click();
    // TODO: Expect to see the packages folder
    await page.getByText("eslint-config-custom-server").click();
    // TODO: Expect to see the eslint-config-custom-server folder
    await page.getByRole("link", { name: "index.js" }).click();
    // TODO: Expect to see the index.js file
    await page.getByRole("button", { name: "Expand" }).click();
    // TODO: Expect to see the package tree expanded
    await page.getByRole("button", { name: "Collapse" }).click();
    // TODO: Expect to see the package tree collapsed
});
