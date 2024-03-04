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

test("create path exclusion, edit, and delete from Main UI", async ({
    page,
}) => {
    const pattern = "apps/api/tests/**";
    const reason = "OTHER";
    const comment =
        "Test create license conclusion, edit it, and finally delete from Main UI";
    const editedReason = "OPTIONAL_COMPONENT_OF";
    const editedComment = "Edited test comment";
    const editedPattern = "**/*.json";

    // Create a path exclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByText("tests").click();
    await page.getByTestId("selection-mode-toggle").click();
    await page.locator('[id="\\33 6"]').click();
    await page.getByTestId("create-path-exclusion").click();
    await expect(page.getByTestId("glob-pattern")).toHaveValue(pattern);
    await page.getByLabel("Reason").click();
    await page.getByLabel(reason, { exact: true }).click();
    await page.getByPlaceholder("Comment...").click();
    await page.getByPlaceholder("Comment...").fill(comment);
    await page.getByRole("button", { name: "Submit" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastCreated = page.getByRole("status").first();
    await toastCreated.waitFor({ state: "visible" });
    await expect(toastCreated).toContainText(
        "Path exclusion added successfully.",
    );
    await toastCreated.waitFor({ state: "hidden" });
    console.log("path exclusion created");

    // Edit the path exclusion
    await page.getByRole("link", { name: "Path Exclusions" }).click();
    await page
        .getByTestId("path-exclusion")
        .filter({ hasText: comment })
        .getByRole("button", { name: "edit" })
        .click();
    await page.getByLabel("Pattern").click();
    await page.getByLabel("Pattern").fill(editedPattern);
    await page.getByLabel("Reason").click();
    await page.getByLabel(editedReason).click();
    await page.getByPlaceholder("Comment...").click();
    await page.getByPlaceholder("Comment...").fill(editedComment);
    await page.getByTestId("path-exclusion-edit").click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastEdited = page.getByRole("status").first();
    await toastEdited.waitFor({ state: "visible" });
    await expect(toastEdited).toContainText(
        "Path exclusion edited and saved successfully.",
    );
    await toastCreated.waitFor({ state: "hidden" });
    console.log("path exclusion edited");

    // Check and delete the edited path exclusion
    await expect(
        page.getByTestId("path-exclusion").filter({ hasText: editedComment }),
    ).toContainText(editedPattern);
    await expect(
        page.getByTestId("path-exclusion").filter({ hasText: editedComment }),
    ).toContainText(editedReason);
    await expect(
        page.getByTestId("path-exclusion").filter({ hasText: editedComment }),
    ).toContainText(editedComment);
    await page
        .getByTestId("path-exclusion")
        .filter({ hasText: editedComment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(page.getByLabel("Delete")).toContainText(editedPattern);
    await page.getByRole("button", { name: "Delete" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "Path exclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    await page.getByRole("link", { name: "Inspect" }).click();
    console.log("path exclusion deleted from Main UI");
});

test("create path exclusion, delete from Clearance Library", async ({
    page,
}) => {
    const pattern = "apps/scanner_agent/*";
    const reason = "OPTIONAL_COMPONENT_OF";
    const comment = "Test create path exclusion, delete from Clearance Library";

    // Create a path exclusion
    await page.getByText("apps").click();
    await page.getByText("scanner_agent").click();
    await page.getByTestId("selection-mode-toggle").click();
    await page.locator('[id="\\32 68"]').click();
    await page.locator('[id="\\32 69"]').click();
    await page.locator('[id="\\32 80"]').click();
    await page.locator('[id="\\32 81"]').click();
    await page.locator('[id="\\32 82"]').click();
    await page.getByTestId("create-path-exclusion").click();
    await expect(page.getByTestId("glob-pattern")).toHaveValue(pattern);
    await page.getByLabel("Reason").click();
    await page.getByLabel(reason, { exact: true }).click();
    await page.getByLabel("Comment").click();
    await page.getByLabel("Comment").fill(comment);
    await page.getByRole("button", { name: "Submit" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastCreated = page.getByRole("status").first();
    await toastCreated.waitFor({ state: "visible" });
    await expect(toastCreated).toContainText(
        "Path exclusion added successfully.",
    );
    await toastCreated.waitFor({ state: "hidden" });
    console.log("path exclusion created");

    // Delete the same exclusion
    await page.goto("/clearances");
    await page.getByTestId("clearance-lib-path-exclusions").click();
    await page
        .getByRole("row")
        .filter({ hasText: comment })
        .getByTestId("delete-clearance-button")
        .click();
    await expect(page.getByLabel("Delete")).toContainText(pattern);
    await page.getByRole("button", { name: "Delete" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "Path exclusion deleted successfully.",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("path exclusion deleted from Clearance Library");
});
