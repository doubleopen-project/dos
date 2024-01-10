// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0");
});

test("create license conclusion, delete from Main UI", async ({ page }) => {
    const license = "MIT";
    const comment = "Test create license conclusion, delete from Main UI";

    // Create a license conclusion
    await page.getByRole("link", { name: "package.json" }).click();
    await page
        .locator("form button")
        .filter({ hasText: "Select license..." })
        .click();
    await page.getByPlaceholder("Search license...").click();
    await page.getByPlaceholder("Search license...").fill(license);
    await page.getByRole("option", { name: license, exact: true }).click();
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .click();
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .fill(comment);
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
    await page.getByTestId("conclusion-db-button").click();
    await page
        .getByTestId("license-conclusion")
        .filter({ hasText: comment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(page.getByLabel("Delete").getByText(license)).toContainText(
        license,
    );
    await page.getByRole("button", { name: "Delete" }).click();

    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "License conclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("license conclusion deleted from Main UI");
});

test("create license conclusion, delete from Clearance Library", async ({
    page,
}) => {
    const license = "Apache-2.0";
    const comment =
        "Test create license conclusion, delete from Clearance Library";

    // Create a license conclusion
    await page.getByText("apps").click();
    await page.getByText("curation_front_end").click();
    await page.getByRole("link", { name: "next.config.js" }).click();
    await page.getByPlaceholder("Write your SPDX expression").click();
    await page.getByPlaceholder("Write your SPDX expression").fill(license);
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .click();
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .fill(comment);
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
    await page.getByTestId("clearance-lib-lic-conclusions").click();
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(page.getByLabel("Delete").getByText(license)).toContainText(
        license,
    );
    await page.getByRole("button", { name: "Delete" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "License conclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("license conclusion deleted from Clearance Library");
});

test("create license conclusion, edit, and delete from Clearance Library", async ({
    page,
}) => {
    test.setTimeout(60000);
    const license = "Beerware";
    const comment =
        "Test create license conclusion, edit it, and finally delete from Clearance Library";
    const editedComment = "Edited test comment";
    const editedLicense = "AFL-3.0";

    // Create a license conclusion
    await page.getByText("apps").click();
    await page.getByText("curation_front_end").click();
    await page.getByRole("link", { name: "next.config.js" }).click();
    await page.getByPlaceholder("Write your SPDX expression").click();
    await page.getByPlaceholder("Write your SPDX expression").fill(license);
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .click();
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .fill(comment);
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

    // Edit the same conclusion
    await page.goto("/clearances");
    await page.getByTestId("clearance-lib-lic-conclusions").click();
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByRole("button", { name: "edit" })
        .click();
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByRole("textbox", { name: "comment" })
        .fill(editedComment);
    await page
        .getByRole("row")
        .filter({ hasText: editedComment })
        .getByRole("textbox", { name: "concludedLicenseExpressionSPDX" })
        .fill(editedLicense);
    await page
        .getByRole("row")
        .filter({ hasText: editedComment })
        .getByRole("button", { name: "save" })
        .click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastEdited = page.getByRole("status").first();
    await toastEdited.waitFor({ state: "visible" });
    await expect(toastEdited).toContainText(
        "License conclusion updated successfully",
    );
    await toastEdited.waitFor({ state: "hidden" });
    console.log("license conclusion edited");

    // Expect to see edited conclusion and comment
    await expect(
        page
            .getByRole("row")
            .filter({ hasText: editedComment })
            .getByText(editedLicense),
    ).toBeVisible();

    // Delete the same conclusion
    await page
        .getByRole("row")
        .filter({ hasText: editedComment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(
        page.getByLabel("Delete").getByText(editedLicense),
    ).toContainText(editedLicense);
    await page.getByRole("button", { name: "Delete" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "License conclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("license conclusion deleted from Clearance Library");
});

test("create license conclusion, edit with erroneous license conclusion, cancel, and finally delete conclusion from Clearance Library", async ({
    page,
}) => {
    test.setTimeout(60000);
    const license = "Beerware";
    const comment =
        "Test create license conclusion, try to edit, cancel, and finally delete from Clearance Library";
    const editedComment = "Edited test comment";
    const editedLicense = "MIT'";

    // Create a license conclusion
    await page.getByText("apps").click();
    await page.getByText("curation_front_end").click();
    await page.getByRole("link", { name: "next.config.js" }).click();
    await page.getByPlaceholder("Write your SPDX expression").click();
    await page.getByPlaceholder("Write your SPDX expression").fill(license);
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .click();
    await page
        .getByPlaceholder("Comment on your license conclusion...")
        .fill(comment);
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

    // Edit the same conclusion
    await page.goto("/clearances");
    await page.getByTestId("clearance-lib-lic-conclusions").click();
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByRole("button", { name: "edit" })
        .click();
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByRole("textbox", { name: "comment" })
        .fill(editedComment);
    await page
        .getByRole("row")
        .filter({ hasText: editedComment })
        .getByRole("textbox", { name: "concludedLicenseExpressionSPDX" })
        .fill(editedLicense);
    await page
        .getByRole("row")
        .filter({ hasText: editedComment })
        .getByRole("button", { name: "save" })
        .click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastEdited = page.getByRole("status").first();
    await toastEdited.waitFor({ state: "visible" });
    await expect(toastEdited).toContainText(
        "Invalid concluded license expression",
    );
    await toastEdited.waitFor({ state: "hidden" });
    console.log("license conclusion edit failed as expected");

    // Cancel the edit
    await page
        .getByRole("row")
        .filter({ hasText: editedComment })
        .getByRole("button", { name: "cancel" })
        .click();

    // Expect to see original conclusion and comment
    await expect(
        page.getByRole("row").filter({ hasText: comment }).getByText(license),
    ).toBeVisible();

    // Delete the same conclusion
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(page.getByLabel("Delete").getByText(license)).toContainText(
        license,
    );
    await page.getByRole("button", { name: "Delete" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "License conclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("license conclusion deleted from Clearance Library");
});
