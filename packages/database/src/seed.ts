// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import fs from "fs";
import path from "path";
import readline from "readline";
import KcAdminClient from "@keycloak/keycloak-admin-client";
import admZip from "adm-zip";
import { authConfig } from "common-helpers";
import { objectExistsCheck, S3Client, uploadFile } from "s3-helpers";
import { prisma } from "./client";

if (process.env.NODE_ENV === "production")
    throw new Error("Don't run this in production");

const s3Client = S3Client(
    true,
    process.env.SPACES_ENDPOINT,
    process.env.SPACES_KEY,
    process.env.SPACES_SECRET,
);

const kcClient = new KcAdminClient({
    baseUrl: authConfig.url,
    realmName: authConfig.realm,
});

async function main() {
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

    for await (const line of rl) {
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
    }

    console.log("Upserting Package to database");

    const pkg = await prisma.package.upsert({
        where: {
            purl: "pkg:npm/dos-monorepo@0.0.0?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Fdoubleopen-project%2Fdos.git&vcs_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6&resolved_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6",
        },
        update: {},
        create: {
            name: "dos-monorepo",
            version: "0.0.0",
            type: "npm",
            namespace: null,
            qualifiers:
                "vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Fdoubleopen-project%2Fdos.git&vcs_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6&resolved_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6",
            subpath: null,
            scanStatus: "scanned",
        },
    });

    console.log(
        "Upserting FileTree rows from test_data/filetrees.source to database",
    );

    const rl2 = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/filetrees.source"),
        ),
        crlfDelay: Infinity,
    });

    for await (const line of rl2) {
        const obj = JSON.parse(line);

        const fileTree = await prisma.fileTree.findFirst({
            where: {
                fileSha256: obj.fileSha256,
                packageId: pkg.id,
                path: obj.path,
            },
        });

        if (!fileTree)
            await prisma.fileTree.create({
                data: {
                    fileSha256: obj.fileSha256,
                    packageId: pkg.id,
                    path: obj.path,
                },
            });
    }

    console.log(
        "Upserting LicenseFinding and LicenseFindingMatch rows from test_data/license_findings_and_matches.source to database",
    );

    const rl3 = readline.createInterface({
        input: fs.createReadStream(
            path.join(
                __dirname,
                "./test_data/license_findings_and_matches.source",
            ),
        ),
        crlfDelay: Infinity,
    });

    for await (const line of rl3) {
        const obj = JSON.parse(line);

        let licenseFinding = await prisma.licenseFinding.findFirst({
            where: {
                fileSha256: obj.fileSha256,
                unprocessedLicenseExpressionSPDX:
                    obj.unprocessedLicenseExpressionSPDX,
                scanner: obj.scanner,
                scannerConfig: obj.scannerConfig,
            },
        });

        const licenseFindingExists = Boolean(licenseFinding);

        if (!licenseFinding)
            licenseFinding = await prisma.licenseFinding.create({
                data: {
                    fileSha256: obj.fileSha256,
                    unprocessedLicenseExpressionSPDX:
                        obj.unprocessedLicenseExpressionSPDX,
                    scanner: obj.scanner,
                    scannerConfig: obj.scannerConfig,
                },
            });

        for (const match of obj.licenseFindingMatches) {
            let licenseFindingMatch;

            if (licenseFindingExists) {
                licenseFindingMatch =
                    await prisma.licenseFindingMatch.findFirst({
                        where: {
                            licenseExpression: match.licenseExpression,
                            startLine: match.startLine,
                            endLine: match.endLine,
                            score: match.score,
                            licenseFindingId: licenseFinding.id,
                        },
                    });
            }

            if (!licenseFindingMatch)
                await prisma.licenseFindingMatch.create({
                    data: {
                        licenseFindingId: licenseFinding.id,
                        licenseExpression: match.licenseExpression,
                        startLine: match.startLine,
                        endLine: match.endLine,
                        score: match.score,
                    },
                });
        }
    }

    console.log(
        "Upserting CopyrightFinding rows from test_data/copyright_findings.source to database",
    );

    const rl4 = readline.createInterface({
        input: fs.createReadStream(
            path.join(__dirname, "./test_data/copyright_findings.source"),
        ),
        crlfDelay: Infinity,
    });

    for await (const line of rl4) {
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
    }

    console.log("Upserting Clearance Group to database");

    const clearanceGroup = await prisma.clearanceGroup.upsert({
        where: {
            name: "Test Clearance Group",
        },
        update: {},
        create: {
            name: "Test Clearance Group",
        },
    });

    console.log("Adding users as Curators to the Clearance Group");

    await kcClient.auth({
        clientId: authConfig.clientIdAPI,
        clientSecret: authConfig.clientSecretAPI,
        grantType: "client_credentials",
    });

    const users = await kcClient.users.find({
        realm: authConfig.realm,
    });

    for (const user of users) {
        if (!user.id || !user.username) continue;

        const realmRoles = await kcClient.users.listRealmRoleMappings({
            id: user.id,
            realm: authConfig.realm,
        });

        const curator = await prisma.curator.upsert({
            where: {
                remoteId: user.id,
            },
            update: {
                username: user.username,
            },
            create: {
                remoteId: user.id,
                username: user.username,
            },
        });

        await prisma.clearanceGroup_Curator.upsert({
            where: {
                clearanceGroupId_curatorId: {
                    clearanceGroupId: clearanceGroup.id,
                    curatorId: curator.id,
                },
            },
            update: {},
            create: {
                clearanceGroupId: clearanceGroup.id,
                curatorId: curator.id,
                role: realmRoles.some(
                    (role) => role.name === "app-read-only-user",
                )
                    ? "READER"
                    : "WRITER",
            },
        });
    }
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
