// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { expect, test } from "./fixtures/user";
import { testPurl } from "./utils/constants";

type ClearanceGroups = ZodiosResponseByAlias<
    typeof userAPI,
    "GetUserClearanceGroups"
>;

type GetLicenseConclusionsRes = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>;

type GetBulkConclusionsByPurlRes = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusionsByPurl"
>;

type GetPathExclusionsByPurlRes = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusionsByPurl"
>;

const pathPurl = encodeURIComponent(testPurl);

test.describe("GET /user/clearance-groups should", () => {
    test("return clearance groups based on access for a regular user", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.get("user/clearance-groups");
        expect(res.ok()).toBe(true);
        const data: ClearanceGroups = await res.json();

        const writerIds = data.writer.map((cg) => cg.id);
        const readerIds = data.reader.map((cg) => cg.id);

        expect(writerIds).toContain(groups.group1.id);
        expect(writerIds).not.toContain(groups.group2.id);
        expect(writerIds).not.toContain(groups.group3.id);

        expect(readerIds).toContain(groups.group2.id);
        expect(readerIds).not.toContain(groups.group1.id);
        expect(readerIds).not.toContain(groups.group3.id);
    });

    test("return writer groups as defined by roles, and other groups as readers for an admin user", async ({
        adminContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await adminContext.get("user/clearance-groups");
        expect(res.ok()).toBe(true);
        const data: ClearanceGroups = await res.json();

        const writerIds = data.writer.map((cg) => cg.id);
        const readerIds = data.reader.map((cg) => cg.id);

        expect(writerIds).toContain(groups.group1.id);
        expect(writerIds).not.toContain(groups.group2.id);
        expect(writerIds).not.toContain(groups.group3.id);

        expect(readerIds).toContain(groups.group2.id);
        expect(readerIds).toContain(groups.group3.id);

        expect(readerIds).not.toContain(groups.group1.id);
    });

    test("return 401 for a non-authenticated user", async ({
        unauthenticatedContext,
    }) => {
        const res = await unauthenticatedContext.get("user/clearance-groups");
        expect(res.status()).toBe(401);
    });
});

test.describe("POST /packages/:purl/files/:sha256/license-conclusions should", () => {
    const fileSha256 =
        "0cbc1f28243bae937e4a2ca774779471484a8b73cf901d0db68ac1642d8c6828";

    test("allow a user to make a license conclusion to a clearance group they have writer access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/files/${fileSha256}/license-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    clearanceGroupId: groups.group1.id,
                },
            },
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();
        await userContext.delete(
            `license-conclusions/${data.licenseConclusionId}`,
        );
    });

    test("not allow a user to make a license conclusion to a clearance group they have only reader access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/files/${fileSha256}/license-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    clearanceGroupId: groups.group2.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("not allow a user to make a license conclusion to a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/files/${fileSha256}/license-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    clearanceGroupId: groups.group3.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });
});

test.describe("POST /packages/:purl/bulk-conclusions should", () => {
    test("allow a user to make bulk license conclusions to a clearance group they have writer access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/bulk-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    pattern: "**/.eslintrc.js",
                    clearanceGroupId: groups.group1.id,
                },
            },
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.matchedPathsCount).toBe(9);
        expect(data.addedLicenseConclusionsCount).toBe(5);
        expect(data.affectedFilesInPackageCount).toBe(9);
        expect(data.affectedFilesAcrossAllPackagesCount).toBe(9);

        await userContext.delete(`bulk-conclusions/${data.bulkConclusionId}`);
    });

    test("not allow a user to make bulk license conclusions to a clearance group they have only reader access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/bulk-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    pattern: "**/.eslintrc.js",
                    clearanceGroupId: groups.group2.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("not allow a user to make bulk license conclusions to a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/bulk-conclusions`,
            {
                data: {
                    concludedLicenseExpressionSPDX: "MIT",
                    pattern: "**/.eslintrc.js",
                    clearanceGroupId: groups.group3.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });
});

test.describe("POST /packages/:purl/path-exclusions should", () => {
    test("allow a user to make a path exclusion to a clearance group they have writer access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/path-exclusions`,
            {
                data: {
                    pattern: "**/tests/**",
                    reason: "TEST_OF",
                    clearanceGroupId: groups.group1.id,
                },
            },
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();
        await userContext.delete(`path-exclusions/${data.pathExclusionId}`);
    });

    test("not allow a user to make a path exclusion to a clearance group they have only reader access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/path-exclusions`,
            {
                data: {
                    pattern: "**/tests/**",
                    reason: "TEST_OF",
                    clearanceGroupId: groups.group2.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("not allow a user to make a path exclusion to a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroups();

        const res = await userContext.post(
            `packages/${pathPurl}/path-exclusions`,
            {
                data: {
                    pattern: "**/tests/**",
                    reason: "TEST_OF",
                    clearanceGroupId: groups.group3.id,
                },
            },
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });
});

test.describe("GET /license-conclusions should", () => {
    test("return license conclusions only from clearance groups the user has access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("license-conclusions", {
            params: {
                hasBulkConclusionId: "false",
                sortBy: "concludedLicenseExpressionSPDX",
                sortOrder: "asc",
            },
        });
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.licenseConclusions.length).toBe(2);
        expect(data.licenseConclusions[0].id).toBe(
            groups.group2.licenseConclusion.id,
        );
        expect(data.licenseConclusions[1].id).toBe(
            groups.group1.licenseConclusion.id,
        );
    });

    test("return empty list if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get("license-conclusions");
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.licenseConclusions.length).toBe(0);
    });

    test("allow filtering license conclusions by clearance group IDs", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("license-conclusions", {
            params: {
                clearanceGroupIds: groups.group1.id,
                hasBulkConclusionId: "false",
            },
        });
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.licenseConclusions.length).toBe(1);
        expect(data.licenseConclusions[0].id).toBe(
            groups.group1.licenseConclusion.id,
        );
    });

    test("not allow filtering license conclusions by clearance group IDs the user has no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("license-conclusions", {
            params: { clearanceGroupIds: groups.group3.id },
        });
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("return all license conclusions from all clearance groups for an admin user", async ({
        adminContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await adminContext.get("license-conclusions", {
            params: { pageSize: "1000", hasBulkConclusionId: "false" },
        });
        expect(res.ok()).toBe(true);

        const data: GetLicenseConclusionsRes = await res.json();

        const lcIds = data.licenseConclusions.map((lc) => lc.id);

        expect(lcIds).toContain(groups.group1.licenseConclusion.id);
        expect(lcIds).toContain(groups.group2.licenseConclusion.id);
        expect(lcIds).toContain(groups.group3.licenseConclusion.id);
    });
});

test.describe("GET /packages/:purl/files/:sha256/license-conclusions/ should", () => {
    test("return license conclusions based on user access", async ({
        adminUser,
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const sha256 = groups.group1.licenseConclusion.fileSha256;

        await seed.createLicenseConclusion(
            "MIT",
            sha256,
            adminUser.curatorId,
            groups.group3.id,
        );

        const res = await userContext.get(
            `packages/${pathPurl}/files/${sha256}/license-conclusions`,
        );

        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.licenseConclusions.length).toBe(1);
        expect(data.licenseConclusions[0].id).toBe(
            groups.group1.licenseConclusion.id,
        );
    });

    test("return empty list if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get(
            `packages/${pathPurl}/files/${groups.group1.licenseConclusion.fileSha256}/license-conclusions`,
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.licenseConclusions.length).toBe(0);
    });
});

test.describe("GET /bulk-conclusions should", () => {
    test("return bulk conclusions only from clearance groups the user has access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("bulk-conclusions", {
            params: {
                sortBy: "concludedLicenseExpressionSPDX",
                sortOrder: "asc",
            },
        });
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.bulkConclusions.length).toBe(2);
        expect(data.bulkConclusions[0].id).toBe(
            groups.group2.bulkConclusion.id,
        );
        expect(data.bulkConclusions[1].id).toBe(
            groups.group1.bulkConclusion.id,
        );
    });

    test("return empty list if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get("bulk-conclusions");
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.bulkConclusions.length).toBe(0);
    });
});

test.describe("GET /packages/:purl/bulk-conclusions should", () => {
    test("return bulk conclusions for the package based on user access", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get(
            `packages/${pathPurl}/bulk-conclusions`,
        );
        expect(res.ok()).toBe(true);

        const data: GetBulkConclusionsByPurlRes = await res.json();

        expect(data.bulkConclusions.length).toBe(2);

        const bcIds = data.bulkConclusions.map((bc) => bc.id);
        expect(bcIds).toContain(groups.group1.bulkConclusion.id);
        expect(bcIds).toContain(groups.group2.bulkConclusion.id);
        expect(bcIds).not.toContain(groups.group3.bulkConclusion.id);
    });

    test("return empty list if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get(
            `packages/${pathPurl}/bulk-conclusions`,
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.bulkConclusions.length).toBe(0);
    });
});

test.describe("GET /path-exclusions should", () => {
    test("return path exclusions only from clearance groups the user has access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("path-exclusions", {
            params: { sortBy: "reason", sortOrder: "asc" },
        });
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.pathExclusions.length).toBe(2);
        expect(data.pathExclusions[0].id).toBe(groups.group1.pathExclusion.id);
        expect(data.pathExclusions[1].id).toBe(groups.group2.pathExclusion.id);
    });

    test("return empty list if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();
        const res = await noGroupsUserContext.get("path-exclusions");
        expect(res.ok()).toBe(true);
        const data = await res.json();

        expect(data.pathExclusions.length).toBe(0);
    });
});

test.describe("GET /packages/:purl/path-exclusions should", () => {
    test("return path exclusions for the package based on user access", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get(
            `packages/${pathPurl}/path-exclusions`,
        );
        expect(res.ok()).toBe(true);

        const data: GetPathExclusionsByPurlRes = await res.json();

        expect(data.pathExclusions.length).toBe(2);

        const peIds = data.pathExclusions.map((pe) => pe.id);

        expect(peIds).toContain(groups.group1.pathExclusion.id);
        expect(peIds).toContain(groups.group2.pathExclusion.id);
        expect(peIds).not.toContain(groups.group3.pathExclusion.id);
    });

    test("return empty list if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get(
            `packages/${pathPurl}/path-exclusions`,
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.pathExclusions.length).toBe(0);
    });
});

test.describe("GET /license-conclusions/count should", () => {
    test("return correct count of license conclusions based on user access", async ({
        userContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("license-conclusions/count", {
            params: { hasBulkConclusionId: "false" },
        });

        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(2);
    });

    test("return zero count if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get("license-conclusions/count");

        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(0);
    });
});

test.describe("GET /bulk-conclusions/count should", () => {
    test("return correct count of bulk conclusions based on user access", async ({
        userContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("bulk-conclusions/count");
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(2);
    });

    test("return zero count if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get("bulk-conclusions/count");
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(0);
    });
});

test.describe("GET /packages/:purl/bulk-conclusions/count should", () => {
    test("return correct count of bulk conclusions based on user access", async ({
        userContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await userContext.get(
            `packages/${pathPurl}/bulk-conclusions/count`,
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(2);
    });

    test("return zero count if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get(
            `packages/${pathPurl}/bulk-conclusions/count`,
        );
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(0);
    });
});

test.describe("GET /path-exclusions/count should", () => {
    test("return correct count of path exclusions based on user access", async ({
        userContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await userContext.get("path-exclusions/count");
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(2);
    });

    test("return zero count if user has no access to any clearance groups", async ({
        noGroupsUserContext,
        seed,
    }) => {
        await seed.createClearanceGroupWithClearances();

        const res = await noGroupsUserContext.get("path-exclusions/count");
        expect(res.ok()).toBe(true);

        const data = await res.json();

        expect(data.count).toBe(0);
    });
});

test.describe("GET /license-conclusions/:id/affected-files should", () => {
    test("allow user to get affected files for a license conclusion in a clearance group they have access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await userContext.get(
            `license-conclusions/${groups.group1.licenseConclusion.id}/affected-files`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await userContext.get(
            `license-conclusions/${groups.group2.licenseConclusion.id}/affected-files`,
        );
        expect(res2.ok()).toBe(true);
    });

    test("not allow user to get affected files for a license conclusion in a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get(
            `license-conclusions/${groups.group3.licenseConclusion.id}/affected-files`,
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("allow an admin to get affected files for a license conclusion in any clearance group", async ({
        adminContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await adminContext.get(
            `license-conclusions/${groups.group1.licenseConclusion.id}/affected-files`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await adminContext.get(
            `license-conclusions/${groups.group2.licenseConclusion.id}/affected-files`,
        );
        expect(res2.ok()).toBe(true);

        const res = await adminContext.get(
            `license-conclusions/${groups.group3.licenseConclusion.id}/affected-files`,
        );
        expect(res.ok()).toBe(true);
    });
});

test.describe("GET /bulk-conclusions/:id/affected-files should", () => {
    test("allow user to get affected files for a bulk conclusion in a clearance group they have access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await userContext.get(
            `bulk-conclusions/${groups.group1.bulkConclusion.id}/affected-files`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await userContext.get(
            `bulk-conclusions/${groups.group2.bulkConclusion.id}/affected-files`,
        );
        expect(res2.ok()).toBe(true);
    });

    test("not allow user to get affected files for a bulk conclusion in a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get(
            `bulk-conclusions/${groups.group3.bulkConclusion.id}/affected-files`,
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("allow an admin to get affected files for a bulk conclusion in any clearance group", async ({
        adminContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await adminContext.get(
            `bulk-conclusions/${groups.group1.bulkConclusion.id}/affected-files`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await adminContext.get(
            `bulk-conclusions/${groups.group2.bulkConclusion.id}/affected-files`,
        );
        expect(res2.ok()).toBe(true);

        const res = await adminContext.get(
            `bulk-conclusions/${groups.group3.bulkConclusion.id}/affected-files`,
        );
        expect(res.ok()).toBe(true);
    });
});

test.describe("GET /path-exclusions/:id/affected-files should", () => {
    test("allow user to get affected files for a path exclusion in a clearance group they have access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await userContext.get(
            `path-exclusions/${groups.group1.pathExclusion.id}/affected-files`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await userContext.get(
            `path-exclusions/${groups.group2.pathExclusion.id}/affected-files`,
        );
        expect(res2.ok()).toBe(true);
    });

    test("not allow user to get affected files for a path exclusion in a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get(
            `path-exclusions/${groups.group3.pathExclusion.id}/affected-files`,
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("allow an admin to get affected files for a path exclusion in any clearance group", async ({
        adminContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await adminContext.get(
            `path-exclusions/${groups.group1.pathExclusion.id}/affected-files`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await adminContext.get(
            `path-exclusions/${groups.group2.pathExclusion.id}/affected-files`,
        );
        expect(res2.ok()).toBe(true);

        const res = await adminContext.get(
            `path-exclusions/${groups.group3.pathExclusion.id}/affected-files`,
        );
        expect(res.ok()).toBe(true);
    });
});

test.describe("GET /bulk-conclusions/:id should", () => {
    test("allow user to get a bulk conclusion in a clearance group they have access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await userContext.get(
            `bulk-conclusions/${groups.group1.bulkConclusion.id}`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await userContext.get(
            `bulk-conclusions/${groups.group2.bulkConclusion.id}`,
        );
        expect(res2.ok()).toBe(true);
    });

    test("not allow user to get a bulk conclusion in a clearance group they have no access to", async ({
        userContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res = await userContext.get(
            `bulk-conclusions/${groups.group3.bulkConclusion.id}`,
        );
        expect(res.ok()).toBe(false);
        expect(res.status()).toBe(403);
    });

    test("allow an admin to get a bulk conclusion in any clearance group", async ({
        adminContext,
        seed,
    }) => {
        const groups = await seed.createClearanceGroupWithClearances();

        const res1 = await adminContext.get(
            `bulk-conclusions/${groups.group1.bulkConclusion.id}`,
        );
        expect(res1.ok()).toBe(true);

        const res2 = await adminContext.get(
            `bulk-conclusions/${groups.group2.bulkConclusion.id}`,
        );
        expect(res2.ok()).toBe(true);

        const res = await adminContext.get(
            `bulk-conclusions/${groups.group3.bulkConclusion.id}`,
        );
        expect(res.ok()).toBe(true);
    });
});
