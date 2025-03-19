// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
    prisma: PrismaClientSingleton;
    pool: Pool;
};

const pool =
    globalForDb.pool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        max: process.env.DB_MAX_CLIENTS
            ? parseInt(process.env.DB_MAX_CLIENTS)
            : undefined,
        idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MS
            ? parseInt(process.env.DB_IDLE_TIMEOUT_MS)
            : undefined,
        connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT_MS
            ? parseInt(process.env.DB_CONNECTION_TIMEOUT_MS)
            : undefined,
    });

const adapter = new PrismaPg(pool);

// Workaround to get the correct type for the prisma client with the computed fields
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: ["info"],
        adapter,
    }).$extends({
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

export const prisma = globalForDb.prisma ?? prismaClientSingleton();
export const connectionPool = pool;

// Assign the prisma client and the pool to the global object in dev environment to prevent hot reloading from creating new instances
if (process.env.NODE_ENV !== "production") {
    globalForDb.prisma = prisma;
    globalForDb.pool = pool;
}

export * from "@prisma/client";
