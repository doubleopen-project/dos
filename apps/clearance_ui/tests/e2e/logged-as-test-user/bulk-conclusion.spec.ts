// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
    await page.goto("/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0");
});

test("create bulk conclusion, delete from Main UI", async ({ page }) => {
    const pattern = "**/*.ts";
    const license = "AGPL-1.0-only";
    const comment = "Test create bulk conclusion, delete from Main UI";

    // Create a bulk license conclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByRole("link", { name: "tsup.config.ts" }).click();
    await page.getByTestId("bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page.getByPlaceholder("Glob pattern matching to the").fill(pattern);
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
    await page
        .getByRole("button", { name: "license conclusion details" })
        .first()
        .click();
    await page
        .locator('button[data-testid="delete-clearance-button"]')
        .scrollIntoViewIfNeeded();
    await page.getByTestId("delete-clearance-button").click();
    await expect(page.getByLabel("Delete")).toContainText(comment);
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
    const pattern = "**/*.json";
    const license = "CC-BY-1.0";
    const comment =
        "Test create bulk conclusion, delete from Clearance Library";

    // Create a bulk conclusion
    await page.getByTestId("bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page.getByPlaceholder("Glob pattern matching to the").fill(pattern);
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
    await expect(page.getByLabel("Delete")).toContainText(pattern);
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

test("create bulk conclusion, edit, and delete from Main UI", async ({
    page,
}) => {
    const pattern = "**/*.ts";
    const license = "BSD-1-Clause";
    const comment =
        "Test create bulk conclusion, edit, and delete from Main UI";
    const editedPattern = "**/*.json";
    const editedLicense = "CC-BY-1.0";
    const editedComment = "Edited test comment";

    // Create a bulk conclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByRole("link", { name: "tsup.config.ts" }).click();
    await page.getByTestId("bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page.getByPlaceholder("Glob pattern matching to the").fill(pattern);
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

    // Edit the bulk conclusion
    await page
        .getByRole("button", { name: "license conclusion details" })
        .first()
        .click();
    await page.locator('button[name="edit-bulk"]').scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "edit-bulk" }).click();
    await page.getByLabel("Pattern").click();
    await page.getByLabel("Pattern").fill(editedPattern);
    await page.getByRole("textbox", { name: "spdx" }).click();
    await page.getByRole("textbox", { name: "spdx" }).fill(editedLicense);
    await page.getByLabel("Comment").click();
    await page.getByLabel("Comment").fill(editedComment);
    await page.getByRole("button", { name: "Submit the edit" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastEdited = page.getByRole("status").first();
    await toastEdited.waitFor({ state: "visible" });
    await expect(toastEdited).toContainText(
        "Bulk license conclusion edited and saved successfully.",
    );
    await toastEdited.waitFor({ state: "hidden" });
    console.log("bulk license conclusion edited");

    // Delete the same bulk conclusion
    await page.getByRole("link", { name: "package.json" }).first().click();
    await page
        .getByRole("button", { name: "license conclusion details" })
        .first()
        .click();
    await page
        .locator('button[data-testid="delete-clearance-button"]')
        .scrollIntoViewIfNeeded();
    await page.getByTestId("delete-clearance-button").click();
    await expect(page.getByLabel("Delete")).toContainText(editedComment);
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

test("create bulk conclusion, edit, and delete from clearance toolbar", async ({
    page,
}) => {
    const pattern = "**/*.ts";
    const license = "GPL-3.0-or-later";
    const comment =
        "Test create bulk conclusion, edit, and delete from clearance toolbar";
    const editedPattern = "**/*.json";
    const editedLicense = "GPL-3.0-only";
    const editedComment = "Edited test comment";

    // Create a bulk conclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByRole("link", { name: "tsup.config.ts" }).click();
    await page.getByTestId("bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page.getByPlaceholder("Glob pattern matching to the").fill(pattern);
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

    // Edit the bulk conclusion
    await page.getByRole("link", { name: "Bulk Conclusions" }).click();
    await page
        .getByTestId("bulk-conclusion")
        .filter({ hasText: comment })
        .getByRole("button", { name: "edit" })
        .click();
    await page.getByLabel("Pattern").click();
    await page.getByLabel("Pattern").fill(editedPattern);
    await page.getByRole("textbox", { name: "spdx" }).click();
    await page.getByRole("textbox", { name: "spdx" }).fill(editedLicense);
    await page.getByLabel("Comment").click();
    await page.getByLabel("Comment").fill(editedComment);
    await page.getByTestId("bulk-conclusion-edit").click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastEdited = page.getByRole("status").first();
    await toastEdited.waitFor({ state: "visible" });
    await expect(toastEdited).toContainText(
        "Bulk license conclusion edited and saved successfully.",
    );
    await toastEdited.waitFor({ state: "hidden" });
    console.log("bulk license conclusion edited in clearance toolbar");

    // Delete the same bulk conclusion
    await expect(
        page.getByTestId("bulk-conclusion").filter({ hasText: editedComment }),
    ).toContainText(editedPattern);
    await expect(
        page.getByTestId("bulk-conclusion").filter({ hasText: editedComment }),
    ).toContainText(editedLicense);
    await expect(
        page.getByTestId("bulk-conclusion").filter({ hasText: editedComment }),
    ).toContainText(editedComment);
    await page
        .getByTestId("bulk-conclusion")
        .filter({ hasText: editedComment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(page.getByLabel("Delete")).toContainText(editedPattern);
    await page.getByRole("button", { name: "Delete bulk conclusion" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "Bulk license conclusion deleted successfully,",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("bulk license conclusion deleted from clearance toolbar");
});
