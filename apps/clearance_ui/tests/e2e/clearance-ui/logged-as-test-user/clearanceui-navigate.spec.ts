// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("navigates in Clearance UI", async ({ page }) => {
    await page.goto(
        "/packages/pkg%3Anpm%2Fdos-monorepo%400.0.0%3Fvcs_type%3DGit%26vcs_url%3Dhttps%253A%252F%252Fgithub.com%252Fdoubleopen-project%252Fdos.git%26vcs_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6%26resolved_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6",
    );

    expect(page.getByText("dos-monorepo@0.0.0"));
    expect(page.locator("label").filter({ hasText: "No file opened" }));

    // Open a file
    await page.click("text=README.md");
    expect(page.locator("label").filter({ hasText: "README.md" }));

    // Basic navigation
    await page.getByRole("button", { name: ": MIT" }).first().click();
    // TODO: Expect line 4 to become topmost in the editor
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
