// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import path from "path";
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const USER_AUTH_STORAGE_PATH = path.join(__dirname, ".auth/user.json");
export const READONLY_AUTH_STORAGE_PATH = path.join(
    __dirname,
    ".auth/readonly.json",
);
export const ADMIN_AUTH_STORAGE_PATH = path.join(__dirname, ".auth/admin.json");

export default defineConfig({
    /* Timeout for each test, to accommodate for slower machines in local testing */
    timeout: 60000,

    testDir: "./tests/e2e",
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.CI
            ? "http://clearance-ui:3000"
            : "http://localhost:3000",

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",

        video: "retain-on-failure",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "setup",
            testMatch: /global\.setup\.ts/,
        },
        {
            name: "logged in as test user",
            testMatch: "**/logged-as-test-user/*.spec.ts",
            dependencies: ["setup"],
            use: {
                ...devices["Desktop Chrome"],
                storageState: USER_AUTH_STORAGE_PATH,
            },
        },
        {
            name: "logged out as test user",
            use: {
                ...devices["Desktop Chrome"],
            },
            testIgnore: [
                "**/logged-as-test-user/*.spec.ts",
                "**/logged-as-readonly-user/*.spec.ts",
                "**/logged-as-admin/*.spec.ts",
            ],
        },
        {
            name: "logged in as readonly user",
            testMatch: "**/logged-as-readonly-user/*.spec.ts",
            dependencies: ["setup"],
            use: {
                ...devices["Desktop Chrome"],
                storageState: READONLY_AUTH_STORAGE_PATH,
            },
        },
        {
            name: "logged in as admin",
            testMatch: "**/logged-as-admin/*.spec.ts",
            dependencies: ["setup"],
            use: {
                ...devices["Desktop Chrome"],
                storageState: ADMIN_AUTH_STORAGE_PATH,
            },
        },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
