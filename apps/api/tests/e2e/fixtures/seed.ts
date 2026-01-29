// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { randHex } from "@ngneat/falso";
import { ApiScope } from "database";
import {
    generateApiToken,
    hashApiToken,
} from "../../../src/helpers/api_tokens";
import {
    createApiClient,
    createApiToken,
    createBulkConclusion,
    createClearanceGroup,
    createClearanceGroupCurators,
    createLicenseConclusion,
    createPackage,
    createPathExclusion,
    createScannerJob,
    deleteApiClient,
    deleteBulkAndLicenseConclusions,
    deleteClearanceGroup,
    deleteLicenseConclusion,
    deletePackage,
    deletePathExclusion,
    deleteScannerJobsByPackageId,
} from "../../../src/helpers/db_queries";
import { testPurl } from "../utils/constants";

const createLC = async (
    concludedExpression: string,
    sha256: string,
    curatorId: string,
    groupId: number,
    bulkConclusionId?: number,
) => {
    return await createLicenseConclusion({
        concludedLicenseExpressionSPDX: concludedExpression,
        contextPurl: testPurl,
        bulkConclusion: bulkConclusionId
            ? {
                  connect: {
                      id: bulkConclusionId,
                  },
              }
            : undefined,
        file: {
            connect: {
                sha256: sha256,
            },
        },
        curator: {
            connect: {
                id: curatorId,
            },
        },
        clearanceGroups: {
            create: {
                clearanceGroup: {
                    connect: {
                        id: groupId,
                    },
                },
            },
        },
    });
};

const createBC = async (
    concludedExpression: string,
    pattern: string,
    curatorId: string,
    groupId: number,
) => {
    return await createBulkConclusion({
        concludedLicenseExpressionSPDX: concludedExpression,
        pattern: pattern,
        package: {
            connect: {
                purl: testPurl,
            },
        },
        curator: {
            connect: {
                id: curatorId,
            },
        },
        clearanceGroups: {
            create: {
                clearanceGroup: {
                    connect: {
                        id: groupId,
                    },
                },
            },
        },
    });
};

const createPE = async (
    pattern: string,
    reason: string,
    curatorId: string,
    groupId: number,
) => {
    return await createPathExclusion({
        pattern: pattern,
        reason: reason,
        package: {
            connect: {
                purl: testPurl,
            },
        },
        curator: {
            connect: {
                id: curatorId,
            },
        },
        clearanceGroups: {
            create: {
                clearanceGroup: {
                    connect: {
                        id: groupId,
                    },
                },
            },
        },
    });
};

export const seedCreateClearanceGroups = async (
    adminCuratorId: string,
    userCuratorId: string,
) => {
    const group1 = await createClearanceGroup({
        name: `Test Clearances ${randHex()}`,
    });
    const group2 = await createClearanceGroup({
        name: `Test Clearances ${randHex()}`,
    });
    const group3 = await createClearanceGroup({
        name: `Test Clearances ${randHex()}`,
    });

    await createClearanceGroupCurators([
        {
            clearanceGroupId: group1.id,
            curatorId: adminCuratorId,
            role: "WRITER",
        },
        {
            clearanceGroupId: group1.id,
            curatorId: userCuratorId,
            role: "WRITER",
        },
    ]);

    await createClearanceGroupCurators([
        {
            clearanceGroupId: group2.id,
            curatorId: userCuratorId,
            role: "READER",
        },
    ]);

    return {
        group1: group1,
        group2: group2,
        group3: group3,
        cleanup: async () => {
            await deleteClearanceGroup(group1.id);
            await deleteClearanceGroup(group2.id);
            await deleteClearanceGroup(group3.id);
        },
    };
};

export const seedCreateClearanceGroupWithClearances = async (
    adminCuratorId: string,
    userCuratorId: string,
) => {
    const groups = await seedCreateClearanceGroups(
        adminCuratorId,
        userCuratorId,
    );

    const lc1 = await createLC(
        "MIT",
        "3033e4e29fa8ea20d8936e68e3f31d53ae6d34912c7c9ebc30709d4481356f50",
        userCuratorId,
        groups.group1.id,
    );

    const lc2 = await createLC(
        "Apache-2.0",
        "8ce935b5ff29601f337cc9707c90601e3cc2be4fe0ee4ecd965bc4dffc25ddf2",
        adminCuratorId,
        groups.group2.id,
    );

    const lc3 = await createLC(
        "GPL-3.0-only",
        "93c6981dc83fbc908379475393187926745a403ed288fb65020d9bd13c746ca8",
        adminCuratorId,
        groups.group3.id,
    );

    const bc1 = await createBC(
        "MIT",
        "LICENSES/**",
        userCuratorId,
        groups.group1.id,
    );

    await createLC(
        "MIT",
        "8ce935b5ff29601f337cc9707c90601e3cc2be4fe0ee4ecd965bc4dffc25ddf2",
        userCuratorId,
        groups.group1.id,
        bc1.id,
    );

    await createLC(
        "MIT",
        "0f5a2b85ace8b36bd6ffdd297ae4a15ab178d5d4c925bf614f04a10a7e247bdd",
        userCuratorId,
        groups.group1.id,
        bc1.id,
    );

    const bc2 = await createBC(
        "Apache-2.0",
        "{Dockerfile,docker-compose.yml}",
        adminCuratorId,
        groups.group2.id,
    );

    await createLC(
        "Apache-2.0",
        "33acd3c4d859ec52369e0a9124a00cc055bd1e2c78d0b3fa820d5f8b71532dd5",
        adminCuratorId,
        groups.group2.id,
        bc2.id,
    );

    await createLC(
        "Apache-2.0",
        "e5d51fa7744c12d6d378518bcd21f7fd56575beea2548f65138a6d8e8432a043",
        adminCuratorId,
        groups.group2.id,
        bc2.id,
    );

    const bc3 = await createBC(
        "GPL-3.0-only",
        "packages/validation-helpers/src/scanner_agent/**",
        adminCuratorId,
        groups.group3.id,
    );

    await createLC(
        "GPL-3.0-only",
        "ea67e1de161825a53201817c9ceb55823000d61b5d5dd2a4fdd871ef8e4b4d4e",
        adminCuratorId,
        groups.group3.id,
        bc3.id,
    );

    await createLC(
        "GPL-3.0-only",
        "d8144986f4cdd860a6804884d20f0eb0690ec7fbdb0c6a3cfad276254379cfca",
        adminCuratorId,
        groups.group3.id,
        bc3.id,
    );

    const pe1 = await createPE(
        "**/docs/**",
        "DOCUMENTATION_OF",
        userCuratorId,
        groups.group1.id,
    );

    const pe2 = await createPE(
        "**/tests/**",
        "TEST_OF",
        adminCuratorId,
        groups.group2.id,
    );

    const pe3 = await createPE(
        "**/examples/**",
        "EXAMPLE_OF",
        adminCuratorId,
        groups.group3.id,
    );

    return {
        group1: {
            id: groups.group1.id,
            licenseConclusion: lc1,
            bulkConclusion: bc1,
            pathExclusion: pe1,
        },
        group2: {
            id: groups.group2.id,
            licenseConclusion: lc2,
            bulkConclusion: bc2,
            pathExclusion: pe2,
        },
        group3: {
            id: groups.group3.id,
            licenseConclusion: lc3,
            bulkConclusion: bc3,
            pathExclusion: pe3,
        },
        cleanup: async () => {
            await groups.cleanup();
            await deleteLicenseConclusion(lc1.id);
            await deleteLicenseConclusion(lc2.id);
            await deleteLicenseConclusion(lc3.id);
            await deleteBulkAndLicenseConclusions(bc1.id);
            await deleteBulkAndLicenseConclusions(bc2.id);
            await deleteBulkAndLicenseConclusions(bc3.id);
            await deletePathExclusion(pe1.id);
            await deletePathExclusion(pe2.id);
            await deletePathExclusion(pe3.id);
        },
    };
};

export const seedCreateLicenseConclusion = async (
    concludedExpression: string,
    sha256: string,
    curatorId: string,
    groupId: number,
) => {
    const lc = await createLC(concludedExpression, sha256, curatorId, groupId);

    return {
        licenseConclusion: lc,
        cleanup: async () => {
            await deleteLicenseConclusion(lc.id);
        },
    };
};

export const seedCreateApiClient = async () => {
    const apiClient = await createApiClient({
        name: `Test API Client ${randHex()}`,
    });

    return {
        apiClient: apiClient,
        cleanup: async () => {
            await deleteApiClient(apiClient.id);
        },
    };
};

export const seedCreateApiToken = async (
    apiClientId: string,
    scopes: ApiScope[],
    clearanceGroupIds?: number[],
    isActive?: boolean,
) => {
    const tokenSecret = generateApiToken();
    const tokenHash = hashApiToken(tokenSecret);

    const apiToken = await createApiToken(
        tokenHash,
        "API token",
        apiClientId,
        scopes,
        clearanceGroupIds,
        isActive,
    );

    return {
        apiToken: apiToken,
        tokenSecret: tokenSecret,
        cleanup: async () => {
            // No need to delete the token separately, it will be deleted
            // when the API client is deleted.
        },
    };
};

export const seedCreatePackage = async (status: string) => {
    const name = `test-package-${randHex({ length: 6 })}`;
    const pkg = await createPackage({
        type: "npm",
        name: name,
        version: "1.0.0",
        scanStatus: status,
    });

    return {
        package: pkg,
        cleanup: async () => {
            await deletePackage(pkg.id);
        },
    };
};

export const seedCreateScannerJob = async (
    state: string,
    packageId: number,
) => {
    const scannerJob = await createScannerJob({
        state: state,
        packageId: packageId,
    });

    return {
        scannerJob: scannerJob,
        cleanup: async () => {
            await deleteScannerJobsByPackageId(packageId);
        },
    };
};
