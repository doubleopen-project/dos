// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0");
    await page.getByRole("link", { name: "package-lock.json" }).click();
});

test("create license conclusion, delete from Main UI", async ({ page }) => {
    // Create a license conclusion
    await page
        .locator("form button")
        .filter({ hasText: "Select license..." })
        .click();
    await page.getByPlaceholder("Search license...").click();
    await page.getByPlaceholder("Search license...").fill("MIT");
    await page.getByRole("option", { name: "MIT", exact: true }).click();
    await page.getByPlaceholder("Comment on your curation...").click();
    await page
        .getByPlaceholder("Comment on your curation...")
        .fill("Test comment 1");
    page.once("dialog", (dialog) => {
        dialog.accept().catch(() => {});
    });
    await page.getByRole("button", { name: "Submit" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastCreated = page.getByRole("status").first();
    await toastCreated.waitFor({ state: "visible" });
    await expect(toastCreated).toContainText(
        "License conclusion added successfully.",
    );
    await toastCreated.waitFor({ state: "hidden" });
    console.log("license conclusion created");

    // Delete the same conclusion
    await page.getByTestId("curation-db-button").click();
    await expect(page.getByTestId("concluded-license").first()).toContainText(
        "MIT",
    );
    await page.getByRole("group").getByRole("button").first().click();
    await expect(page.getByLabel("Delete").getByText("MIT")).toContainText(
        "MIT",
    );
    await page.getByRole("button", { name: "Delete" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "License conclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("license conclusion deleted");
});

test("create license conclusion, delete from Clearance Library", async ({
    page,
}) => {
    // Create a license conclusion
    await page.getByText("apps").click();
    await page.getByText("curation_front_end").click();
    await page.getByRole("link", { name: "next.config.js" }).click();
    await page.getByPlaceholder("Write your SPDX expression").click();
    await page
        .getByPlaceholder("Write your SPDX expression")
        .fill("Apache-2.0");
    await page.getByPlaceholder("Comment on your curation...").click();
    await page
        .getByPlaceholder("Comment on your curation...")
        .fill("Test comment 2");
    page.once("dialog", (dialog) => {
        dialog.accept().catch(() => {});
    });
    await page.getByRole("button", { name: "Submit" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastCreated = page.getByRole("status").first();
    await toastCreated.waitFor({ state: "visible" });
    await expect(toastCreated).toContainText(
        "License conclusion added successfully.",
    );
    await toastCreated.waitFor({ state: "hidden" });
    console.log("license conclusion created");

    // Delete the same conclusion
    await page.goto("/clearances");
    await expect(
        page.getByRole("cell", { name: "Apache-" }).first(),
    ).toContainText("Apache-2.0");
    await expect(
        page.getByRole("cell", { name: "Test comment 2" }).first(),
    ).toContainText("Test comment 2");
    const rows = await page.$$('tr:has-text("Test comment 2")');
    const row = rows[0];
    const button = row
        ? await row.$('[data-testid="delete-license-conclusion"]')
        : null;
    if (button) {
        await button.click();
    }
    await expect(
        page.getByLabel("Delete").getByText("Apache-2.0"),
    ).toContainText("Apache-2.0");
    await page.getByRole("button", { name: "Delete" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "License conclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("license conclusion deleted");
});
