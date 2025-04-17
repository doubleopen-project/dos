// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import {
    randCodeSnippet,
    randGitCommitSha,
    randSemver,
    randSlug,
} from "@ngneat/falso";
import test, { expect } from "@playwright/test";
import { Zodios, ZodiosInstance } from "@zodios/core";
import AdmZip from "adm-zip";
import { dosAPI, userAPI } from "validation-helpers";
import { getAccessToken } from "./utils/get_access_token";

/**
 * Construct Zodios callers for the API endpoints to easily call them in the tests.
 */

const baseUrl = process.env.CI ? "http://api:3001" : "http://localhost:5000";

test.describe.configure({ mode: "default" });

test.describe("API lets authenticated users to", () => {
    let keycloakToken: string;
    let dosToken: string;
    let userZodios: ZodiosInstance<typeof userAPI>;
    let dosZodios: ZodiosInstance<typeof dosAPI>;

    /**
     * Retrieve the token for an authenticated test user from Keycloak. This can be used in the API
     * calls to authenticate the user. Also retrieve the DOS token.
     */
    test.beforeAll(async ({}) => {
        keycloakToken = await getAccessToken("test-user", "test-user");
        expect(keycloakToken).toBeDefined();

        userZodios = new Zodios(`${baseUrl}/api/user/`, userAPI, {
            axiosConfig: {
                headers: {
                    Authorization: `Bearer ${keycloakToken}`,
                },
            },
        });

        const userToken = await userZodios.put("/token", undefined, {
            headers: {
                Authorization: `Bearer ${keycloakToken}`,
            },
        });

        dosToken = userToken.token;

        dosZodios = new Zodios(`${baseUrl}/api/`, dosAPI, {
            axiosConfig: {
                headers: {
                    Authorization: `Bearer ${dosToken}`,
                },
            },
        });
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
        const presignedUrl = (
            await dosZodios.post("/upload-url", {
                key: zipKey,
            })
        ).presignedUrl;

        expect(presignedUrl).toBeDefined();

        await fetch(presignedUrl!, {
            method: "PUT",
            body: zipBuffer,
        });

        await dosZodios.post("/job", {
            zipFileKey: zipKey,
            purls: [purl],
        });

        // Query scan results until they are availabe and include the expected results.
        await expect(async () => {
            const jobDetails = await dosZodios.post("/scan-results", {
                purls: [purl],
            });

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

        const res = await dosZodios.post("/job", {
            zipFileKey: "non-existent.zip",
            purls: [purl],
        });

        // Query job state until it is available and is failed.
        await expect(async () => {
            const jobState = await dosZodios.get("/job-state/:id", {
                params: {
                    id: res.scannerJobId,
                },
            });

            expect(jobState.state.status).toBe("failed");
            expect(jobState.state.message).toBe(
                "Internal server error. Zip file download failed.",
            );
        }).toPass();
    });
});
