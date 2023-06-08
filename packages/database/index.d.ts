// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}
declare const prisma: any;

export { prisma };
