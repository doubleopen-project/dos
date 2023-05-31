// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { PrismaClient, ScannerJob, File } from 'database';
const prisma: PrismaClient = new PrismaClient();

export const addNewScannerJob = async (state: string): Promise<ScannerJob> => {
    return await prisma.scannerJob.create({
        data: {
            state: state
        }
    });
}

interface ScannerJobUpdateData {
    state?: string;
    scannerName?: string;
    scannerVersion?: string;
    duration?: number;
    scanStartTS?: Date;
    scanEndTS?: Date;
    spdxLicenseListVersion?: string;
}

export const editScannerJob = async (id: string, data: ScannerJobUpdateData): Promise<ScannerJob> => {
    return await prisma.scannerJob.update({
        where: {
            id: id
        },
        data: data
    })
}

export const findFileWithHash = async (hash: string): Promise<File | null> => {
    return await prisma.file.findUnique({
        where: {
            sha256: hash
        },
    })
}