// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
import fs from "fs";
import path from "path";
import readline from "readline";
import { PrismaClient } from "@prisma/client";
import admZip from "adm-zip";
import { objectExistsCheck, S3Client, uploadFile } from "s3-helpers";

if (process.env.NODE_ENV === "production")
    throw new Error("Don't run this in production");

const s3Client = S3Client(
    true,
    process.env.SPACES_ENDPOINT,
    process.env.SPACES_KEY,
    process.env.SPACES_SECRET,
);

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

    const testUser2Salt = crypto.randomBytes(16);
    const testUser2HashedPassword = crypto.pbkdf2Sync(
        "test2",
        testUser2Salt,
        310000,
        32,
        "sha256",
    );
    await prisma.user.upsert({
        where: {
            username: "test2",
        },
        update: {},
        create: {
            username: "test2",
            token: "test_token2",
            salt: testUser2Salt,
            hashedPassword: testUser2HashedPassword,
        },
    });

    const testAdminUserSalt = crypto.randomBytes(16);
    const testAdminUserHashedPassword = crypto.pbkdf2Sync(
        "testAdmin",
        testAdminUserSalt,
        310000,
        32,
        "sha256",
    );
    await prisma.user.upsert({
        where: {
            username: "testAdmin",
        },
        update: {},
        create: {
            username: "testAdmin",
            token: "admin_token",
            role: "ADMIN",
            salt: testAdminUserSalt,
            hashedPassword: testAdminUserHashedPassword,
        },
    });

    const fileExists = fs.existsSync(
        path.join(__dirname, "./test_data/files.zip"),
    );

    if (!fileExists) throw new Error("Error: files.zip does not exist");

    console.log("Uploading test files to object storage");

    const zip = new admZip(path.join(__dirname, "./test_data/files.zip"));
    zip.extractAllTo("/tmp/extracted/files/", true);

    const files = fs.readdirSync("/tmp/extracted/files/");

    for (const file of files) {
        const objectExists = await objectExistsCheck(
            s3Client,
            process.env.SPACES_BUCKET || "doubleopen",
            file,
        );

        if (objectExists === undefined)
            throw new Error("Error: Object exists check failed");
        if (!objectExists) {
            const fileBuffer: Buffer = fs.readFileSync(
                "/tmp/extracted/files/" + file,
            );
            const result = await uploadFile(
                s3Client,
                process.env.SPACES_BUCKET || "doubleopen",
                file,
                fileBuffer,
            );
            console.log(result);
        }
    }

    // Delete local tmp files
    fs.rmSync("/tmp/extracted/files/", { recursive: true });

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
                sha256: obj.sha256,
            },
            update: {},
            create: {
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
                purl: obj.purl,
            },
            update: {},
            create: {
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

        const fileTree = await prisma.fileTree.findFirst({
            where: {
                fileSha256: obj.fileSha256,
                packageId: obj.packageId,
                path: obj.path,
            },
        });

        if (!fileTree)
            await prisma.fileTree.create({
                data: {
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

        const licenseFinding = await prisma.licenseFinding.findFirst({
            where: {
                fileSha256: obj.fileSha256,
                licenseExpressionSPDX: obj.licenseExpressionSPDX,
                scanner: obj.scanner,
                scannerConfig: obj.scannerConfig,
            },
        });

        if (!licenseFinding)
            await prisma.licenseFinding.create({
                data: {
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

        const licenseFindingMatch = await prisma.licenseFindingMatch.findFirst({
            where: {
                licenseFindingId: obj.licenseFindingId,
                licenseExpression: obj.licenseExpression,
                startLine: obj.startLine,
                endLine: obj.endLine,
                score: obj.score,
            },
        });

        if (!licenseFindingMatch)
            await prisma.licenseFindingMatch.create({
                data: {
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

        const copyrightFinding = await prisma.copyrightFinding.findFirst({
            where: {
                fileSha256: obj.fileSha256,
                copyright: obj.copyright,
                scanner: obj.scanner,
                scannerConfig: obj.scannerConfig,
                startLine: obj.startLine,
                endLine: obj.endLine,
            },
        });

        if (!copyrightFinding)
            await prisma.copyrightFinding.create({
                data: {
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
