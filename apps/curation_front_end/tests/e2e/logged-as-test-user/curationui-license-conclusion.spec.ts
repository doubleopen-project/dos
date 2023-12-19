// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { expect, test } from "@playwright/test";

test.describe("create and delete license conclusions from the main UI", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0");
        await page.getByRole("link", { name: "package-lock.json" }).click();
    });

    test("creates license conclusion 1", async ({ page }) => {
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
        expect(
            await page.waitForSelector(
                ':has-text("License conclusion added successfully.")',
            ),
        ).not.toBeNull();
    });

    test("deletes license conclusion 1", async ({ page }) => {
        await page.getByTestId("curation-db-button").click();
        await expect(page.getByTestId("concluded-license").first()).toHaveText(
            "MIT",
        );
        await page.getByRole("group").getByRole("button").first().click();
        await expect(page.getByLabel("Delete").getByText("MIT")).toHaveText(
            "MIT",
        );
        await page.getByRole("button", { name: "Delete" }).click();
        expect(
            await page.waitForSelector(
                ':has-text("License conclusion deleted successfully.")',
            ),
        ).not.toBeNull();
    });
});

test.describe("create license conclusion, but delete it from Clearance Library", () => {
    test("creates license conclusion 2", async ({ page }) => {
        await page.goto("/packages/pkg%3Ageneric%2Fdos-monorepo%400.0.0");
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
        expect(
            await page.waitForSelector(
                ':has-text("License conclusion added successfully.")',
            ),
        ).not.toBeNull();
    });

    test("deletes license conclusion from Clearance Library", async ({
        page,
    }) => {
        await page.goto("/curations");
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
        ).toHaveText("Apache-2.0");
        await page.getByRole("button", { name: "Delete" }).click();
        expect(
            await page.waitForSelector(
                ':has-text("License conclusion deleted successfully.")',
            ),
        ).not.toBeNull();
    });
});
