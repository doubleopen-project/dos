// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT
import {
    randCodeSnippet,
    randGitCommitSha,
    randSemver,
    randSlug,
} from "@ngneat/falso";
import { ZodiosResponseByPath } from "@zodios/core";
import AdmZip from "adm-zip";
import { dosAPI } from "validation-helpers";
import { expect, test } from "./fixtures/scanner";
import { testPurl } from "./utils/constants";

test.describe.configure({ mode: "default" });

test.describe("Scanner pipeline should", () => {
    test("allow to scan packages and retrieve their results", async ({
        validScanDataTokenContext,
    }) => {
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
        const presignedRes = await validScanDataTokenContext.post(
            "upload-url",
            {
                data: { key: zipKey },
            },
        );

        expect(presignedRes.ok()).toBeTruthy();

        const { presignedUrl } = await presignedRes.json();

        expect(presignedUrl).toBeDefined();

        await fetch(presignedUrl!, {
            method: "PUT",
            body: zipBuffer,
        });

        await validScanDataTokenContext.post("job", {
            data: {
                zipFileKey: zipKey,
                purls: [purl],
            },
        });

        // Query scan results until they are availabe and include the expected results.
        await expect(async () => {
            const jobDetailsRes = await validScanDataTokenContext.post(
                "scan-results",
                {
                    data: { purls: [purl] },
                },
            );

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

    test("result in the job failing when adding a job with a non-existent S3 file key", async ({
        validScanDataTokenContext,
    }) => {
        const purl = `pkg:npm/${randSlug()}@${randSemver()}`;

        const jobRes = await validScanDataTokenContext.post("job", {
            data: {
                zipFileKey: "non-existent.zip",
                purls: [purl],
            },
        });

        expect(jobRes.ok()).toBeTruthy();

        const job = await jobRes.json();

        // Query job state until it is available and is failed.
        await expect(async () => {
            const jobStateRes = await validScanDataTokenContext.get(
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

test.describe("POST /scan-results should", () => {
    test("forbid requests with an invalid API token", async ({
        validClearanceDataTokenContext,
        revokedTokenContext,
        invalidTokenContext,
        noTokenContext,
    }) => {
        const url = "scan-results";
        const body = { purls: [testPurl] };
        expect(
            (
                await validClearanceDataTokenContext.post(url, { data: body })
            ).status(),
        ).toBe(403);
        expect(
            (await revokedTokenContext.post(url, { data: body })).status(),
        ).toBe(403);
        expect(
            (await invalidTokenContext.post(url, { data: body })).status(),
        ).toBe(401);
        expect((await noTokenContext.post(url, { data: body })).status()).toBe(
            401,
        );
    });
});

test.describe("POST /upload-url should", () => {
    test("forbid requests with an invalid API token", async ({
        validClearanceDataTokenContext,
        revokedTokenContext,
        invalidTokenContext,
        noTokenContext,
    }) => {
        const url = "upload-url";
        const body = { key: "some-object-key.zip" };
        expect(
            (
                await validClearanceDataTokenContext.post(url, { data: body })
            ).status(),
        ).toBe(403);
        expect(
            (await revokedTokenContext.post(url, { data: body })).status(),
        ).toBe(403);
        expect(
            (await invalidTokenContext.post(url, { data: body })).status(),
        ).toBe(401);
        expect((await noTokenContext.post(url, { data: body })).status()).toBe(
            401,
        );
    });
});

test.describe("POST /job should", () => {
    test("forbid requests with an invalid API token", async ({
        validClearanceDataTokenContext,
        revokedTokenContext,
        invalidTokenContext,
        noTokenContext,
    }) => {
        const url = "upload-url";
        const body = { key: "some-object-key.zip" };
        expect(
            (
                await validClearanceDataTokenContext.post(url, { data: body })
            ).status(),
        ).toBe(403);
        expect(
            (await revokedTokenContext.post(url, { data: body })).status(),
        ).toBe(403);
        expect(
            (await invalidTokenContext.post(url, { data: body })).status(),
        ).toBe(401);
        expect((await noTokenContext.post(url, { data: body })).status()).toBe(
            401,
        );
    });
});

test.describe("GET /job-state/:id should", () => {
    test("allow requests with an API token with the SCAN_DATA scope", async ({
        validScanDataTokenContext,
        seed,
    }) => {
        const pkg = await seed.createPackage("failed");
        const scannerJob = await seed.createScannerJob(
            "failed",
            pkg.package.id,
        );
        const res = await validScanDataTokenContext.get(
            `job-state/${scannerJob.scannerJob.id}`,
        );

        expect(res.status()).toBe(200);
    });

    test("forbid requests with an invalid API token", async ({
        validClearanceDataTokenContext,
        revokedTokenContext,
        invalidTokenContext,
        noTokenContext,
    }) => {
        const url = "job-state/7aa9c89c-5237-49a5-b705-3bc08b254885";
        expect((await validClearanceDataTokenContext.get(url)).status()).toBe(
            403,
        );
        expect((await revokedTokenContext.get(url)).status()).toBe(403);
        expect((await invalidTokenContext.get(url)).status()).toBe(401);
        expect((await noTokenContext.get(url)).status()).toBe(401);
    });
});

test.describe("POST /package-configuration should", () => {
    test("allow requests with an API token with the CLEARANCE_DATA scope", async ({
        validClearanceDataTokenContext,
    }) => {
        const res = await validClearanceDataTokenContext.post(
            "package-configuration",
            {
                data: { purl: testPurl },
            },
        );

        expect(res.status()).toBe(200);
    });

    test("forbid requests with an invalid API token", async ({
        validScanDataTokenContext,
        revokedTokenContext,
        invalidTokenContext,
        noTokenContext,
    }) => {
        const url = "package-configuration";
        const body = { purl: testPurl };
        expect(
            (
                await validScanDataTokenContext.post(url, { data: body })
            ).status(),
        ).toBe(403);
        expect(
            (await revokedTokenContext.post(url, { data: body })).status(),
        ).toBe(403);
        expect(
            (await invalidTokenContext.post(url, { data: body })).status(),
        ).toBe(401);
        expect((await noTokenContext.post(url, { data: body })).status()).toBe(
            401,
        );
    });
});
