// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT
import {
    randCodeSnippet,
    randGitCommitSha,
    randSemver,
    randSlug,
} from "@ngneat/falso";
import test, { APIRequestContext, expect } from "@playwright/test";
import { ZodiosResponseByPath } from "@zodios/core";
import AdmZip from "adm-zip";
import { dosAPI } from "validation-helpers";
import { baseUrl } from "./utils/constants";

test.describe.configure({ mode: "default" });

test.describe("API lets authenticated users to", () => {
    const dosToken: string = "token";
    let apiContext: APIRequestContext;

    /**
     * Retrieve the token for an authenticated test user from Keycloak. This can be used in the API
     * calls to authenticate the user. Also retrieve the DOS token.
     */
    test.beforeAll(async ({ playwright }) => {
        // Create a new API context for the scanner API with the DOS token in the headers.
        apiContext = await playwright.request.newContext({
            baseURL: `${baseUrl}/api/`,
            extraHTTPHeaders: {
                Authorization: `Bearer ${dosToken}`,
            },
        });
    });

    test.afterAll(async () => {
        // Close the API context to clean up resources.
        await apiContext.dispose();
    });

    test("scan packages and retrieve their results", async ({}) => {
        /**
         * Zip some test files to be scanned.
         */
        const zip = new AdmZip();

        // Add a file with a random code snippet and SPDX headers. This ensures that the scan result
        // is not retrieved based on the file contents on subsequent runs, but is always scanned as
        // a new file. `randCodeSnippet` seems to create duplicates, so add a random Git commit SHA
        // to ensure the file is unique.
        zip.addFile(
            "test.txt",
            Buffer.from(`
                        // SPDX-FileCopyrightText: 2024 Double Open Oy
                        //
                        // SPDX-License-Identifier: MIT

                        // ${randGitCommitSha()}

                        ${randCodeSnippet({ length: 50 })}
                        `),
        );
        const zipBuffer = zip.toBuffer();

        // Create random package name and version to always have a new package to scan.
        const version = randSemver();
        const packageName = randSlug();

        const zipKey = `${packageName}-${version}.zip`;
        const purl = `pkg:npm/${packageName}@${version}`;

        // Fetch a presigned URL from the API and upload the zip file to S3.
        const presignedRes = await apiContext.post("upload-url", {
            data: { key: zipKey },
        });

        expect(presignedRes.ok()).toBeTruthy();

        const { presignedUrl } = await presignedRes.json();

        expect(presignedUrl).toBeDefined();

        await fetch(presignedUrl!, {
            method: "PUT",
            body: zipBuffer,
        });

        await apiContext.post("job", {
            data: {
                zipFileKey: zipKey,
                purls: [purl],
            },
        });

        // Query scan results until they are availabe and include the expected results.
        await expect(async () => {
            const jobDetailsRes = await apiContext.post("scan-results", {
                data: { purls: [purl] },
            });

            expect(jobDetailsRes.ok()).toBeTruthy();

            const jobDetails: ZodiosResponseByPath<
                typeof dosAPI,
                "post",
                "/scan-results"
            > = await jobDetailsRes.json();

            expect(
                jobDetails.results?.licenses.map((license) => license.license),
            ).toContain("MIT");

            expect(
                jobDetails.results?.copyrights.map(
                    (copyright) => copyright.statement,
                ),
            ).toContain("Copyright 2024 Double Open Oy");
        }).toPass();
    });

    test("adding a job with a non-existent S3 file key should result in job failing", async ({}) => {
        const purl = `pkg:npm/${randSlug()}@${randSemver()}`;

        const jobRes = await apiContext.post("job", {
            data: {
                zipFileKey: "non-existent.zip",
                purls: [purl],
            },
        });

        expect(jobRes.ok()).toBeTruthy();

        const job = await jobRes.json();

        // Query job state until it is available and is failed.
        await expect(async () => {
            const jobStateRes = await apiContext.get(
                `job-state/${job.scannerJobId}`,
            );

            expect(jobStateRes.ok()).toBeTruthy();

            const jobState = await jobStateRes.json();

            expect(jobState.state.status).toBe("failed");
            expect(jobState.state.message).toBe(
                "Internal server error. Zip file download failed.",
            );
        }).toPass();
    });
});
