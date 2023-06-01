// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { PrismaClient, ScannerJob, File } from 'database';
const prisma: PrismaClient = new PrismaClient();
import { CreateFileInput, CreateScannerJobInput, EditScannerJobInput } from 'validation-helpers';

export const addNewScannerJob = async (input: CreateScannerJobInput): Promise<ScannerJob> => {
    return await prisma.scannerJob.create({
        data: {
            state: input.state
        }
    });
}

export const editScannerJob = async (input: EditScannerJobInput): Promise<ScannerJob> => {
    return await prisma.scannerJob.update({
        where: {
            id: input.id
        },
        data: input.data
    })
}

export const findFileWithHash = async (hash: string): Promise<File | null> => {
    return await prisma.file.findUnique({
        where: {
            sha256: hash
        },
    })
}

export const addNewFile = async (input: CreateFileInput): Promise<File> => {
    return await prisma.file.create({
        data: input.data
    });
}