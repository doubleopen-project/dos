// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { CopyrightFinding, File, FileTree, LicenseFinding, Package, PrismaClient, ScannerJob } from 'database';
const prisma: PrismaClient = new PrismaClient();
import * as dbZodSchemas from 'validation-helpers';

export const createScannerJob = async (input: dbZodSchemas.CreateScannerJobInput): Promise<ScannerJob> => {
    return await prisma.scannerJob.create({
        data: input.data
    });
}

export const updateScannerJob = async (input: dbZodSchemas.UpdateScannerJobInput): Promise<ScannerJob> => {
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

export const createFile = async (input: dbZodSchemas.CreateFileInput): Promise<File> => {
    return await prisma.file.create({
        data: input.data
    });
}

export const updateFile = async (input: dbZodSchemas.UpdateFileInput): Promise<File> => {
    return await prisma.file.update({
        where: {
            id: input.id
        },
        data: input.data
    })
}

export const createLicenseFinding = async (input: dbZodSchemas.CreateLicenseFindingInput): Promise<LicenseFinding> => {
    return await prisma.licenseFinding.create({
        data: input.data
    });
}

export const createCopyrightFinding = async (input: dbZodSchemas.CreateCopyrightFindingInput): Promise<CopyrightFinding> => {
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

export const createPackage = async (input: dbZodSchemas.CreatePackageInput): Promise<Package> => {
    return await prisma.package.create({
        data: input.data
    });
}

export const updatePackage = async (input: dbZodSchemas.UpdatePackageInput): Promise<Package> => {
    return await prisma.package.update({
        where: {
            id: input.id
        },
        data: input.data
    })
}

export const createFileTree = async (input: dbZodSchemas.CreateFileTreeInput): Promise<FileTree> => {
    return await prisma.fileTree.create({
        data: input.data
    });
}

export const findPackageByPurl = async (purl: string): Promise<Package | null> => {
    return await prisma.package.findFirst({
        where: {
            purl: purl
        },
    })
}

export const getPackageScanResults = async (packageId: number) => {
    return await prisma.fileTree.findMany({
        where: {
            packageId: packageId
        },
        include: {
            file: {
                include: {
                    licenseFindings: true,
                    copyrightFindings: true,
                }
            }
        }
    })
}

// Find the id of the most recent scanner job with package id
export const findMostRecentScannerJobByPackageId = async (packageId: number): Promise<dbZodSchemas.ScannerJobOnlyIdOutput | null> => {
    return await prisma.scannerJob.findFirst({
        where: {
            packageId: packageId
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true
        }
    })
}

