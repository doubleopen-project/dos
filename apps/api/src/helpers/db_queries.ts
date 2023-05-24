// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { PrismaClient, ScannerJob } from 'database';
const prisma: PrismaClient = new PrismaClient();

export const addNewScannerJob = async (state: string, packageName: string, packageVersion: string, packageRegistry: string): Promise<ScannerJob> => {
    return await prisma.scannerJob.create({
        data: {
            state: state,
            packageName: packageName,
            packageVersion: packageVersion,
            packageRegistry: packageRegistry
        }
    });
}

interface ScannerJobUpdateData {
    state?: string;
}

export const editScannerJob = async (id: string, data: ScannerJobUpdateData): Promise<ScannerJob> => {
    return await prisma.scannerJob.update({
        where: {
            id: id
        },
        data: data
    })
}