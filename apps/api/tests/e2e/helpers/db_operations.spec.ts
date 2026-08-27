// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { randomUUID } from "node:crypto";
import { findFilesToBeScanned } from "../../../src/helpers/db_operations";
import {
    deleteFilesByFileHashes,
    findFileByHash,
    findFileTree,
} from "../../../src/helpers/db_queries";
import { expect, test } from "../fixtures/scanner";

// Files with these hashes have already been seeded into the test database with the seed script.
const seeded1 =
    "65952c19ee4d8d3e9ee1037e0acf26eed517f659fd1ffb46019691734bb8bd4a";
const seeded2 =
    "f946190f42593f2fac00240ffdcd46db4785ea3a0a319543124d36ff12683543";

const newFileHash = () => randomUUID().replace(/-/g, "");

test.describe("findFilesToBeScanned should", () => {
    test("return files that have not yet been scanned", async ({
        seed,
        registerCleanup,
    }) => {
        const new1 = newFileHash();
        const new2 = newFileHash();
        registerCleanup(async () => {
            await deleteFilesByFileHashes([new1, new2]);
        });
        const pkg = (await seed.createPackage("notScanned")).package;

        const result = await findFilesToBeScanned(
            [pkg.id],
            new Map([
                [seeded1, ["src/old1.ts"]],
                [seeded2, ["src/old2.ts"]],
                [new1, ["src/new1.ts"]],
                [new2, ["src/new2.ts"]],
            ]),
        );

        expect(result).toHaveLength(2);
        expect(result).toEqual(
            expect.arrayContaining([
                {
                    hash: new1,
                    path: "src/new1.ts",
                },
                {
                    hash: new2,
                    path: "src/new2.ts",
                },
            ]),
        );

        expect(
            await findFileTree({
                path: "src/old1.ts",
                packageId: pkg.id,
                fileSha256: seeded1,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/old2.ts",
                packageId: pkg.id,
                fileSha256: seeded2,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/new1.ts",
                packageId: pkg.id,
                fileSha256: new1,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/new2.ts",
                packageId: pkg.id,
                fileSha256: new2,
            }),
        ).not.toBeNull();
    });

    test("create FileTree entries when File entry already exists", async ({
        seed,
    }) => {
        const new1 = newFileHash();
        const new2 = newFileHash();
        await seed.createFile(new1, "notStarted");
        await seed.createFile(new2, "failed");
        const pkg = (await seed.createPackage("notScanned")).package;

        expect(await findFileByHash(new1)).not.toBeNull();
        expect(await findFileByHash(new2)).not.toBeNull();
        expect(await findFileByHash(seeded1)).not.toBeNull();
        expect(await findFileByHash(seeded2)).not.toBeNull();

        const result = await findFilesToBeScanned(
            [pkg.id],
            new Map([
                [seeded1, ["src/old1.ts"]],
                [seeded2, ["src/old2.ts", "src/old2_duplicate.ts"]],
                [new1, ["src/new1.ts"]],
                [new2, ["src/new2.ts"]],
            ]),
        );

        expect(result).toHaveLength(2);
        expect(result).toEqual(
            expect.arrayContaining([
                {
                    hash: new1,
                    path: "src/new1.ts",
                },
                {
                    hash: new2,
                    path: "src/new2.ts",
                },
            ]),
        );

        expect(
            await findFileTree({
                path: "src/new1.ts",
                packageId: pkg.id,
                fileSha256: new1,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/new2.ts",
                packageId: pkg.id,
                fileSha256: new2,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/old1.ts",
                packageId: pkg.id,
                fileSha256: seeded1,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/old2.ts",
                packageId: pkg.id,
                fileSha256: seeded2,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/old2_duplicate.ts",
                packageId: pkg.id,
                fileSha256: seeded2,
            }),
        ).not.toBeNull();
    });

    test("create FileTree entries if a new file is in several paths", async ({
        seed,
        registerCleanup,
    }) => {
        const new1 = newFileHash();
        const new2 = newFileHash();
        registerCleanup(async () => {
            await deleteFilesByFileHashes([new1, new2]);
        });

        const pkg = (await seed.createPackage("notScanned")).package;

        expect(await findFileByHash(new1)).toBeNull();

        const result = await findFilesToBeScanned(
            [pkg.id],
            new Map([
                [seeded1, ["src/old1.ts"]],
                [seeded2, ["src/old2.ts"]],
                [new1, ["src/new1.ts", "src/new1_duplicate.ts"]],
                [new2, ["src/new2.ts"]],
            ]),
        );

        expect(result).toHaveLength(2);
        expect(result).toEqual(
            expect.arrayContaining([
                {
                    hash: new1,
                    path: "src/new1.ts",
                },
                {
                    hash: new2,
                    path: "src/new2.ts",
                },
            ]),
        );

        expect(
            await findFileTree({
                path: "src/old1.ts",
                packageId: pkg.id,
                fileSha256: seeded1,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/old2.ts",
                packageId: pkg.id,
                fileSha256: seeded2,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/new1.ts",
                packageId: pkg.id,
                fileSha256: new1,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/new1_duplicate.ts",
                packageId: pkg.id,
                fileSha256: new1,
            }),
        ).not.toBeNull();
        expect(
            await findFileTree({
                path: "src/new2.ts",
                packageId: pkg.id,
                fileSha256: new2,
            }),
        ).not.toBeNull();
    });

    for (const scanStatus of ["notStarted", "failed"] as const) {
        test(`return existing files with scanStatus ${scanStatus}`, async ({
            seed,
        }) => {
            const new1 = newFileHash();
            await seed.createFile(new1, scanStatus);
            const pkg = (await seed.createPackage("notScanned")).package;

            expect(await findFileByHash(new1)).not.toBeNull();

            const result = await findFilesToBeScanned(
                [pkg.id],
                new Map([
                    [seeded1, ["src/old1.ts"]],
                    [seeded2, ["src/old2.ts"]],
                    [new1, ["src/new1.ts"]],
                ]),
            );

            expect(result).toHaveLength(1);
            expect(result).toContainEqual({
                hash: new1,
                path: "src/new1.ts",
            });
        });
    }
});
