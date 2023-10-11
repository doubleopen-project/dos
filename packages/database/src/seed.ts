// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
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
