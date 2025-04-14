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
import { authConfig } from "common-helpers";
import { dosAPI, userAPI } from "validation-helpers";

/**
 * Construct Zodios callers for the API endpoints to easily call them in the tests.
 */

const server = authConfig.url;
const realm = authConfig.realm;
const clientId = authConfig.clientIdUI;
const clientSecret = authConfig.clientSecretUI;
const username = "test-user";
const password = "test-user";
const baseUrl = process.env.CI ? "http://api:3001" : "http://localhost:5000";

if (!server || !realm || !clientId || !clientSecret || !username || !password) {
    throw new Error(
        "KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID_API, KEYCLOAK_CLIENT_SECRET_API, E2E_USER_USERNAME and E2E_USER_PASSWORD environment variables must be set",
    );
}

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
        // creating the request URL
        const url = `${server}/realms/${realm}/protocol/openid-connect/token`;
        // creating the body of the request

        const result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: "password",
                username: username,
                password: password,
                client_secret: clientSecret,
            }),
        });

        const body = await result.json();
        keycloakToken = (body as { access_token: string }).access_token;

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
