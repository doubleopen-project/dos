// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

// Set the test mode to "serial" to run the tests in order, as opposed to in parallel
test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
    await page.goto(
        "/packages/pkg%3Anpm%2Fdos-monorepo%400.0.0%3Fvcs_type%3DGit%26vcs_url%3Dhttps%253A%252F%252Fgithub.com%252Fdoubleopen-project%252Fdos.git%26vcs_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6%26resolved_revision%3Ddc27d024ea5c001def72122c8c0f8c148cec39b6",
    );
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
    await page
        .getByRole("button", { name: "license conclusion details" })
        .first()
        .click();
    await page
        .locator('button[data-testid="delete-clearance-button"]')
        .scrollIntoViewIfNeeded();
    await page.getByTestId("delete-clearance-button").click();
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
    await page.getByText("clearance_ui").click();
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
    const license = "Beerware";
    const comment =
        "Test create license conclusion, edit it, and finally delete from Clearance Library";
    const editedComment = "Edited test comment";
    const editedLicense = "AFL-3.0";

    // Create a license conclusion
    await page.getByText("apps").click();
    await page.getByText("clearance_ui").click();
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
    await page.getByText("clearance_ui").click();
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

    // Wait for the toast to appear, contain an error text and disappear
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

test("create license conclusion without comment, edit license, and finally delete conclusion from Clearance Library", async ({
    page,
}) => {
    test.setTimeout(60000);
    const license = "MIT or BSD-2-Clause";
    const editedLicense = "GPL-2.0-only with GCC-exception-2.0";

    // Create a license conclusion
    await page.getByText("apps").click();
    await page.getByText("clearance_ui").click();
    await page.getByRole("link", { name: "next.config.js" }).click();
    await page.getByPlaceholder("Write your SPDX expression").click();
    await page.getByPlaceholder("Write your SPDX expression").fill(license);
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
        .filter({ hasText: license })
        .getByRole("button", { name: "edit" })
        .click();
    await page
        .getByRole("textbox", { name: "concludedLicenseExpressionSPDX" })
        .fill(editedLicense);
    await page.getByRole("button", { name: "save" }).click();

    // Wait for the toast to appear, contain a success text and disappear
    const toastEdited = page.getByRole("status").first();
    await toastEdited.waitFor({ state: "visible" });
    await expect(toastEdited).toContainText(
        "License conclusion updated successfully",
    );
    await toastEdited.waitFor({ state: "hidden" });
    console.log("license conclusion edited");

    // Delete the same conclusion
    await page
        .getByRole("row")
        .filter({ hasText: editedLicense })
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

test("create license conclusion, edit, and delete from clearance toolbar", async ({
    page,
}) => {
    const license = "GPL-3.0-or-later";
    const comment =
        "Test create license conclusion, edit, and delete from clearance toolbar";
    const editedLicense = "GPL-3.0-only";
    const editedComment = "Edited test comment";

    // Create a license conclusion
    await page.getByText("apps").click();
    await page.getByText("clearance_ui").click();
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

    // Edit the license conclusion
    await page.getByRole("link", { name: "License Conclusions" }).click();
    await page
        .getByTestId("license-conclusion")
        .filter({ hasText: comment })
        .getByRole("button", { name: "edit" })
        .click();
    await page.getByRole("textbox", { name: "spdx" }).click();
    await page.getByRole("textbox", { name: "spdx" }).fill(editedLicense);
    await page.getByLabel("Comment").click();
    await page.getByLabel("Comment").fill(editedComment);
    await page.getByTestId("license-conclusion-edit").click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastEdited = page.getByRole("status").first();
    await toastEdited.waitFor({ state: "visible" });
    await expect(toastEdited).toContainText(
        "License conclusion edited and saved successfully.",
    );
    await toastEdited.waitFor({ state: "hidden" });
    console.log("license conclusion edited in clearance toolbar");

    // Delete the same bulk conclusion
    await expect(
        page
            .getByTestId("license-conclusion")
            .filter({ hasText: editedComment }),
    ).toContainText(editedLicense);
    await expect(
        page
            .getByTestId("license-conclusion")
            .filter({ hasText: editedComment }),
    ).toContainText(editedComment);
    await page
        .getByTestId("license-conclusion")
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
    console.log("license conclusion deleted from clearance toolbar");
});
