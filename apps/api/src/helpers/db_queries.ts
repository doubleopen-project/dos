// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { CopyrightFinding, File, LicenseFinding, Package, PrismaClient, ScannerJob } from 'database';
const prisma: PrismaClient = new PrismaClient();
import { CreateFileInput, EditFileInput, CreateScannerJobInput, EditScannerJobInput, CreateLicenseFindingInput, CreateCopyrightFindingInput, CreatePackageInput } from 'validation-helpers';

export const createScannerJob = async (input: CreateScannerJobInput): Promise<ScannerJob> => {
    return await prisma.scannerJob.create({
        data: input.data
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

export const createFile = async (input: CreateFileInput): Promise<File> => {
    return await prisma.file.create({
        data: input.data
    });
}

export const editFile = async (input: EditFileInput): Promise<File> => {
    return await prisma.file.update({
        where: {
            id: input.id
        },
        data: input.data
    })
}

export const createLicenseFinding = async (input: CreateLicenseFindingInput): Promise<LicenseFinding> => {
    return await prisma.licenseFinding.create({
        data: input.data
    });
}

export const createCopyrightFinding = async (input: CreateCopyrightFindingInput): Promise<CopyrightFinding> => {
    return await prisma.copyrightFinding.create({
        data: input.data
    });
}

export const findScannerJobById = async (id: string): Promise<ScannerJob | null> => {
    return await prisma.scannerJob.findUnique({
        where: {
            id: id
        },
    })
}

export const createPackage = async (input: CreatePackageInput): Promise<Package> => {
    return await prisma.package.create({
        data: input.data
    });
}
