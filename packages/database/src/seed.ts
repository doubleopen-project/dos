// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
import fs from "fs";
import path from "path";
import readline from "readline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const testUserSalt = crypto.randomBytes(16);
    const testUserHashedPassword = crypto.pbkdf2Sync(
        "test",
        testUserSalt,
        310000,
        32,
        "sha256",
    );
    const testUser = await prisma.user.upsert({
        where: {
            username: "test",
        },
        update: {},
        create: {
            username: "test",
            token: "test_token",
            salt: testUserSalt,
            hashedPassword: testUserHashedPassword,
        },
    });
    console.log(testUser);

    console.log("Upserting File rows from test_data/files.source to database");

    const rl = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/files.source"),
        ),
        crlfDelay: Infinity,
    });

    rl.on("line", async (line) => {
        const obj = JSON.parse(line);
        await prisma.file.upsert({
            where: {
                id: obj.id,
            },
            update: {},
            create: {
                id: obj.id,
                sha256: obj.sha256,
                scanStatus: obj.scanStatus,
            },
        });
    });

    console.log(
        "Upserting Package rows from test_data/packages.source to database",
    );

    const rl2 = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/packages.source"),
        ),
        crlfDelay: Infinity,
    });

    rl2.on("line", async (line) => {
        const obj = JSON.parse(line);
        await prisma.package.upsert({
            where: {
                id: obj.id,
            },
            update: {},
            create: {
                id: obj.id,
                name: obj.name,
                version: obj.version,
                type: obj.type,
                namespace: obj.namespace,
                qualifiers: obj.qualifiers,
                subpath: obj.subpath,
                scanStatus: obj.scanStatus,
            },
        });
    });

    console.log(
        "Upserting FileTree rows from test_data/filetrees.source to database",
    );

    const rl3 = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/filetrees.source"),
        ),
        crlfDelay: Infinity,
    });

    rl3.on("line", async (line) => {
        const obj = JSON.parse(line);
        await prisma.fileTree.upsert({
            where: {
                id: obj.id,
            },
            update: {},
            create: {
                id: obj.id,
                fileSha256: obj.fileSha256,
                packageId: obj.packageId,
                path: obj.path,
            },
        });
    });

    console.log(
        "Upserting LicenseFinding rows from test_data/license_findings.source to database",
    );

    const rl4 = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/license_findings.source"),
        ),
        crlfDelay: Infinity,
    });

    rl4.on("line", async (line) => {
        const obj = JSON.parse(line);
        await prisma.licenseFinding.upsert({
            where: {
                id: obj.id,
            },
            update: {},
            create: {
                id: obj.id,
                fileSha256: obj.fileSha256,
                licenseExpressionSPDX: obj.licenseExpressionSPDX,
                scanner: obj.scanner,
                scannerConfig: obj.scannerConfig,
            },
        });
    });

    console.log(
        "Upserting LicenseFindingMatch rows from test_data/license_finding_matches.source to database",
    );

    const rl5 = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/license_finding_matches.source"),
        ),
        crlfDelay: Infinity,
    });

    rl5.on("line", async (line) => {
        const obj = JSON.parse(line);
        await prisma.licenseFindingMatch.upsert({
            where: {
                id: obj.id,
            },
            update: {},
            create: {
                id: obj.id,
                licenseFindingId: obj.licenseFindingId,
                licenseExpression: obj.licenseExpression,
                startLine: obj.startLine,
                endLine: obj.endLine,
                score: obj.score,
            },
        });
    });

    console.log(
        "Upserting CopyrightFinding rows from test_data/copyright_findings.source to database",
    );

    const rl6 = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/copyright_findings.source"),
        ),
        crlfDelay: Infinity,
    });

    rl6.on("line", async (line) => {
        const obj = JSON.parse(line);
        await prisma.copyrightFinding.upsert({
            where: {
                id: obj.id,
            },
            update: {},
            create: {
                id: obj.id,
                fileSha256: obj.fileSha256,
                copyright: obj.copyright,
                scanner: obj.scanner,
                scannerConfig: obj.scannerConfig,
                startLine: obj.startLine,
                endLine: obj.endLine,
            },
        });
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
