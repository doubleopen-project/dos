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

type PackageConfigurationRes = ZodiosResponseByPath<
    typeof dosAPI,
    "post",
    "/package-configuration"
>;

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

    test("only return clearance items from groups that the API token has access to", async ({
        groupsContext,
        seed,
        adminUser,
    }) => {
        const groups = await seed.createClearanceGroups();

        const ctx = await groupsContext([groups.group1.id]);
        const pe = await seed.createPathExclusion(
            "apps/api/tests/**",
            "TEST_REASON",
            "Test comment",
            adminUser.curatorId,
            groups.group1.id,
        );

        const lc = await seed.createLicenseConclusion(
            "MIT",
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f",
            adminUser.curatorId,
            groups.group1.id,
        );

        await seed.createPathExclusion(
            "some/other/**",
            "OTHER",
            "Other group's exclusion",
            adminUser.curatorId,
            groups.group2.id,
        );

        await seed.createLicenseConclusion(
            "Apache-2.0",
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f",
            adminUser.curatorId,
            groups.group2.id,
        );

        const res = await ctx.post("package-configuration", {
            data: { purl: testPurl },
        });

        expect(res.status()).toBe(200);

        const data = await res.json();

        expect(data.pathExclusions).toHaveLength(1);
        expect(data.pathExclusions[0].pattern).toBe(pe.pathExclusion.pattern);
        expect(data.licenseConclusions).toHaveLength(1);
        expect(data.licenseConclusions[0].concludedLicenseExpressionSPDX).toBe(
            lc.licenseConclusion.concludedLicenseExpressionSPDX,
        );
        expect(data.licenseConclusions[0].path).toBe(
            "packages/spdx-validation/tests/test.ts",
        );
    });

    test("return the highest-ranking group's path exclusion if a path exclusion with the same pattern has been added in multiple groups", async ({
        groupsContext,
        seed,
        adminUser,
    }) => {
        const groups = await seed.createClearanceGroups();

        const ctx = await groupsContext([
            groups.group3.id,
            groups.group1.id,
            groups.group2.id,
        ]);

        await seed.createPathExclusion(
            "apps/api/tests/**",
            "OTHER",
            "Exclusion in middle-ranking group",
            adminUser.curatorId,
            groups.group1.id,
        );

        await seed.createPathExclusion(
            "apps/api/tests/**",
            "TEST_TOOL_OF",
            "Exclusion in lowest-ranking group",
            adminUser.curatorId,
            groups.group2.id,
        );

        const pe = await seed.createPathExclusion(
            "apps/api/tests/**",
            "TEST_OF",
            "Exclusion in highest-ranking group",
            adminUser.curatorId,
            groups.group3.id,
        );

        const res = await ctx.post("package-configuration", {
            data: { purl: testPurl },
        });

        expect(res.status()).toBe(200);

        const data = await res.json();
        expect(data.pathExclusions).toHaveLength(1);
        expect(data.pathExclusions[0].pattern).toBe(pe.pathExclusion.pattern);
        expect(data.pathExclusions[0].reason).toBe(pe.pathExclusion.reason);
        expect(data.pathExclusions[0].comment).toBe(pe.pathExclusion.comment);
    });

    test("return the highest-ranking group's license conclusion if a license conclusion for the same file has been added in multiple groups", async ({
        groupsContext,
        seed,
        adminUser,
    }) => {
        const groups = await seed.createClearanceGroups();

        const ctx = await groupsContext([
            groups.group2.id,
            groups.group3.id,
            groups.group1.id,
        ]);

        await seed.createLicenseConclusion(
            "MIT",
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f",
            adminUser.curatorId,
            groups.group1.id,
        );

        const lc = await seed.createLicenseConclusion(
            "GPL-3.0-only",
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f",
            adminUser.curatorId,
            groups.group2.id,
        );

        await seed.createLicenseConclusion(
            "Apache-2.0",
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f",
            adminUser.curatorId,
            groups.group3.id,
        );

        const res = await ctx.post("package-configuration", {
            data: { purl: testPurl },
        });

        expect(res.status()).toBe(200);

        const data = await res.json();

        expect(data.licenseConclusions).toHaveLength(1);
        expect(data.licenseConclusions[0].concludedLicenseExpressionSPDX).toBe(
            lc.licenseConclusion.concludedLicenseExpressionSPDX,
        );
        expect(data.licenseConclusions[0].path).toBe(
            "packages/spdx-validation/tests/test.ts",
        );
    });

    test("return the newest path exclusion if there are multiple path exclusions with the same pattern in the same group", async ({
        groupsContext,
        seed,
        adminUser,
    }) => {
        const groups = await seed.createClearanceGroups();

        const ctx = await groupsContext([groups.group1.id]);

        await seed.createPathExclusion(
            "apps/api/tests/**",
            "TEST_REASON",
            "Older exclusion",
            adminUser.curatorId,
            groups.group1.id,
            new Date("2024-01-01"),
        );

        const pe = await seed.createPathExclusion(
            "apps/api/tests/**",
            "TEST_REASON",
            "Newer exclusion",
            adminUser.curatorId,
            groups.group1.id,
            new Date("2024-02-01"),
        );

        const res = await ctx.post("package-configuration", {
            data: { purl: testPurl },
        });

        expect(res.status()).toBe(200);

        const data = await res.json();

        expect(data.pathExclusions).toHaveLength(1);
        expect(data.pathExclusions[0].pattern).toBe(pe.pathExclusion.pattern);
        expect(data.pathExclusions[0].comment).toBe(pe.pathExclusion.comment);
    });

    test("return the newest license conclusion if there are multiple license conclusions for the same file in the same group", async ({
        groupsContext,
        seed,
        adminUser,
    }) => {
        const groups = await seed.createClearanceGroups();

        const ctx = await groupsContext([groups.group1.id]);

        await seed.createLicenseConclusion(
            "MIT",
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f",
            adminUser.curatorId,
            groups.group1.id,
            new Date("2024-01-01"),
        );

        const lc = await seed.createLicenseConclusion(
            "GPL-3.0-only",
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f",
            adminUser.curatorId,
            groups.group1.id,
            new Date("2024-02-01"),
        );

        const res = await ctx.post("package-configuration", {
            data: { purl: testPurl },
        });

        expect(res.status()).toBe(200);

        const data = await res.json();

        expect(data.licenseConclusions).toHaveLength(1);
        expect(data.licenseConclusions[0].concludedLicenseExpressionSPDX).toBe(
            lc.licenseConclusion.concludedLicenseExpressionSPDX,
        );
        expect(data.licenseConclusions[0].path).toBe(
            "packages/spdx-validation/tests/test.ts",
        );
    });

    test("return license conclusions for all paths that reference the concluded file in the package", async ({
        groupsContext,
        seed,
        adminUser,
    }) => {
        const groups = await seed.createClearanceGroups();

        const ctx = await groupsContext([groups.group1.id]);

        await seed.createLicenseConclusion(
            "MIT",
            "bb2b91e0ecc75a9341153734abcc0047c4d8cbedfaa22134c8cf7ecabd8b58e4",
            adminUser.curatorId,
            groups.group1.id,
        );
        const res = await ctx.post("package-configuration", {
            data: { purl: testPurl },
        });

        expect(res.status()).toBe(200);

        const data: PackageConfigurationRes = await res.json();

        expect(data.licenseConclusions).toHaveLength(2);
        const paths = data.licenseConclusions.map((lc) => lc.path);
        expect(paths).toContain("apps/api/.eslintrc.js");
        expect(paths).toContain("apps/scanner_agent/.eslintrc.js");
    });

    test("only include license conclusion paths from the requested package", async ({
        groupsContext,
        seed,
        adminUser,
    }) => {
        const groups = await seed.createClearanceGroups();

        const ctx = await groupsContext([groups.group1.id]);

        const pkg2 = await seed.createPackage("scanned");

        const pkg2Path = "some/other/path/.eslintrc.js";
        const fileSha256 =
            "bcee13fdc99511c341921f96949618bf102bb888e7f4e6481e29c2187e36d21f";

        await seed.createFileTree(pkg2.package.id, fileSha256, pkg2Path);

        await seed.createLicenseConclusion(
            "MIT",
            fileSha256,
            adminUser.curatorId,
            groups.group1.id,
        );

        const res = await ctx.post("package-configuration", {
            data: { purl: testPurl },
        });

        expect(res.status()).toBe(200);

        const data = await res.json();

        expect(data.licenseConclusions).toHaveLength(1);
        expect(data.licenseConclusions[0].path).not.toBe(pkg2Path);
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
