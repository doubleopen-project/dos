// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// Workaround to get the correct type for the prisma client with the computed fields
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const prismaClientSingleton = () => {
    return new PrismaClient({ adapter }).$extends({
        result: {
            licenseFinding: {
                licenseExpressionSPDX: {
                    /*
                     * Currently, this is a no-op, but it could be used to compute the license expression if
                     * some post processing is needed. The column name can be changed back in the database
                     * (from unprocessedLicenseExpressionSPDX to licenseEcpressionSPDX), if this is not needed,
                     * but leaving this here for now, in case we need to do some post processing in the near future.
                     */
                    needs: { unprocessedLicenseExpressionSPDX: true },
                    compute(licenseFinding): string {
                        return licenseFinding.unprocessedLicenseExpressionSPDX;
                    },
                },
            },
        },
    });
};

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Assign the prisma client to the global object in dev environment to prevent hot reloading from creating new instances
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
