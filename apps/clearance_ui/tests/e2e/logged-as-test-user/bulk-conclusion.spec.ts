// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
    await page.goto(
        "/packages/pkg%3Anpm%2Fdos-monorepo%400.0.0%3Fvcs_type%3DGit%26vcs_url%3Dhttps%253A%252F%252Fgithub.com%252Fdoubleopen-project%252Fdos.git%26vcs_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6%26resolved_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6",
    );
});

test("create bulk conclusion, delete from Main UI", async ({ page }) => {
    const pattern = "apps/scanner_agent/*";
    const license = "AGPL-1.0-only";
    const comment = "Test create bulk conclusion, delete from Main UI";

    // Create a bulk license conclusion
    await page.getByText("apps").click();
    await page.getByText("scanner_agent").click();
    await page.getByTestId("selection-mode-toggle").click();
    await page.locator('[id="\\32 68"]').click();
    await page.locator('[id="\\32 69"]').click();
    await page.locator('[id="\\32 80"]').click();
    await page.locator('[id="\\32 81"]').click();
    await page.locator('[id="\\32 82"]').click();
    await page.getByTestId("create-bulk-conclusion").click();
    await expect(page.getByTestId("glob-pattern")).toHaveValue(pattern);
    await page.getByRole("combobox").getByText("Select license...").click();
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
    await page.getByText("apps").click();
    await page.getByText("scanner_agent").click();
    await page.getByText(".eslintrc.js").click();
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
    const pattern = "apps/api/**";
    const license = "CC-BY-1.0";
    const comment =
        "Test create bulk conclusion, delete from Clearance Library";

    // Create a bulk conclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByTestId("selection-mode-toggle").click();
    await page.locator('[id="\\32 "]').click();
    await page.getByTestId("create-bulk-conclusion").click();
    await expect(page.getByTestId("glob-pattern")).toHaveValue(pattern);
    await page.getByRole("combobox").getByText("Select license...").click();
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
    const pattern = "{apps/api/src/cron_jobs/**,apps/api/src/helpers/**}";
    const license = "BSD-1-Clause";
    const comment =
        "Test create bulk conclusion, edit, and delete from Main UI";
    const editedPattern = "**/*.json";
    const editedLicense = "CC-BY-1.0";
    const editedComment = "Edited test comment";

    // Create a bulk conclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByText("src").click();
    await page.getByTestId("selection-mode-toggle").click();
    await page.locator('[id="\\36 "]').click();
    await page.locator('[id="\\31 0"]').click();
    await page.getByTestId("create-bulk-conclusion").click();
    await expect(page.getByTestId("glob-pattern")).toHaveValue(pattern);
    await page.getByRole("combobox").getByText("Select license...").click();
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
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByText("src").click();
    await page.getByText("cron_jobs").click();
    await page.getByText("index.ts").click();
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

test("create freetext bulk conclusion, edit, and delete from clearance toolbar", async ({
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
    await page.getByTestId("create-bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page.getByPlaceholder("Glob pattern matching to the").fill(pattern);
    await page.getByRole("combobox").getByText("Select license...").click();
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
    await page.getByRole("link", { name: "Inspect" }).click();
    console.log("bulk license conclusion deleted from clearance toolbar");
});
