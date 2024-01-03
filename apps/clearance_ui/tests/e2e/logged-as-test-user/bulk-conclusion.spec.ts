// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0");
});

test.fixme("create bulk conclusion, delete from Main UI", async ({ page }) => {
    // Create a bulk license conclusion
    await page.getByText("apps").click();
    await page.getByText("api").click();
    await page.getByRole("link", { name: "tsup.config.ts" }).click();
    await page.getByTestId("bulk-conclusion").click();
    await page.getByPlaceholder("Glob pattern matching to the").click();
    await page.getByPlaceholder("Glob pattern matching to the").fill("**/*.ts");
    await page.getByRole("combobox").click();
    await page.getByText("AGPL-1.0-only").click();
    await page.getByPlaceholder("Comment on your bulk").click();
    await page
        .getByPlaceholder("Comment on your bulk")
        .fill("Test bulk conclusion.");
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
    await expect(page.getByTestId("concluded-license").first()).toContainText(
        "AGPL-1.0-only",
    );
    await expect(page.getByTestId("license-type").first()).toContainText(
        "BULK",
    );
    await page.getByRole("group").getByRole("button").first().click();
    await expect(
        page.getByLabel("Delete").getByText("AGPL-1.0-only").first(),
    ).toContainText("AGPL-1.0-only");
    await page.getByRole("button", { name: "Delete bulk conclusion" }).click();
    // Wait for the toast to appear, contain a success text and disappear
    const toastDeleted = page.getByRole("status").first();
    await toastDeleted.waitFor({ state: "visible" });
    await expect(toastDeleted).toContainText(
        "Bulk license conclusion deleted successfully,",
    );
    await toastDeleted.waitFor({ state: "hidden" });
    console.log("bulk license conclusion deleted");
});

test.fixme(
    "create bulk conclusion, delete from Clearance Library",
    async ({ page }) => {
        // Create a bulk conclusion
        await page.getByTestId("bulk-conclusion").click();
        await page.getByPlaceholder("Glob pattern matching to the").click();
        await page
            .getByPlaceholder("Glob pattern matching to the")
            .fill("**/*.json");
        await page.getByRole("combobox").click();
        await page.getByText("AGPL-1.0-only").click();
        await page.getByPlaceholder("Comment on your bulk").click();
        await page
            .getByPlaceholder("Comment on your bulk")
            .fill("Test bulk conclusion.");
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
        await expect(
            page.getByRole("cell", { name: "test" }).first(),
        ).toContainText("test");
        await expect(
            page.getByRole("cell", { name: "AGPL-1.0-only" }).first(),
        ).toContainText("AGPL-1.0-only");
        await expect(
            page.getByRole("cell", { name: "Test bulk conclusion." }).first(),
        ).toContainText("Test bulk conclusion.");
        const rows = await page.$$('tr:has-text("Test bulk conclusion.")');
        const row = rows[0];
        const button = row
            ? await row.$('[data-testid="delete-clearance-button"]')
            : null;
        if (button) {
            await button.click();
        }
        await expect(
            page.getByLabel("Delete").getByText("**/*.json"),
        ).toContainText("**/*.json");
        await page
            .getByRole("button", { name: "Delete bulk conclusion" })
            .click();
        // Wait for the toast to appear, contain a success text and disappear
        const toastDeleted = page.getByRole("status").first();
        await toastDeleted.waitFor({ state: "visible" });
        await expect(toastDeleted).toContainText(
            "Bulk license conclusion deleted successfully,",
        );
        await toastDeleted.waitFor({ state: "hidden" });
        console.log("bulk license conclusion deleted");
    },
);
