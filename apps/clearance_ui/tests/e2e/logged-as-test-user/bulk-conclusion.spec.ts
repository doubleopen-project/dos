// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
    await page.goto("/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0");
});

test("create bulk conclusion, delete from Main UI", async ({ page }) => {
    const license = "AGPL-1.0-only";
    const comment = "Test create bulk conclusion, delete from Main UI";

    // Create a bulk license conclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByRole("link", { name: "tsup.config.ts" }).click();
    await page.getByTestId("bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page.getByPlaceholder("Glob pattern matching to the").fill("**/*.ts");
    await page.getByRole("combobox").click();
    await page.getByText(license, { exact: true }).click();
    await page.getByPlaceholder("Comment on your bulk").click();
    await page.getByPlaceholder("Comment on your bulk").fill(comment);
    page.once("dialog", (dialog) => {
        dialog.accept().catch(() => {});
    });
    await page.getByRole("button", { name: "Add bulk conclusion" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastCreated = page.getByRole("status").first();
    await toastCreated.waitFor({ state: "visible" });
    await expect(toastCreated).toContainText(
        "Bulk license conclusion added successfully.",
    );
    await toastCreated.waitFor({ state: "hidden" });
    console.log("bulk license conclusion created");

    // Delete the same bulk license conclusion
    await page.getByTestId("conclusion-db-button").click();
    await page
        .getByTestId("license-conclusion")
        .filter({ hasText: comment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(
        page.getByLabel("Delete").getByText(license).first(),
    ).toContainText(license);
    await page.getByRole("button", { name: "Delete bulk conclusion" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "Bulk license conclusion deleted successfully,",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("bulk license conclusion deleted from Main UI");
});

test("create bulk conclusion, delete from Clearance Library", async ({
    page,
}) => {
    const license = "389-exception";
    const comment =
        "Test create bulk conclusion, delete from Clearance Library";

    // Create a bulk conclusion
    await page.getByTestId("bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page
        .getByPlaceholder("Glob pattern matching to the")
        .fill("**/*.json");
    await page.getByRole("combobox").click();
    await page.getByText(license, { exact: true }).click();
    await page.getByPlaceholder("Comment on your bulk").click();
    await page.getByPlaceholder("Comment on your bulk").fill(comment);
    page.once("dialog", (dialog) => {
        dialog.accept().catch(() => {});
    });
    await page.getByRole("button", { name: "Add bulk conclusion" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastCreated = page.getByRole("status").first();
    await toastCreated.waitFor({ state: "visible" });
    await expect(toastCreated).toContainText(
        "Bulk license conclusion added successfully.",
    );
    await toastCreated.waitFor({ state: "hidden" });
    console.log("bulk license conclusion created");

    // Delete the same bulk conclusion
    await page.goto("/clearances");
    await page.getByTestId("clearance-lib-bulk-conclusions").click();
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(
        page.getByLabel("Delete").getByText("**/*.json"),
    ).toContainText("**/*.json");
    await page.getByRole("button", { name: "Delete bulk conclusion" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "Bulk license conclusion deleted successfully,",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("bulk license conclusion deleted from Clearance Library");
});
