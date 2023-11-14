// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PrismaClient } from "@prisma/client";
import * as _prisma_client_runtime_library from "@prisma/client/runtime/library";
import * as _prisma_client from ".prisma/client";

export * from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<
    _prisma_client.Prisma.PrismaClientOptions,
    never,
    _prisma_client_runtime_library.DefaultArgs
>;

export { prisma };
