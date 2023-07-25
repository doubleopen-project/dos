// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { CopyrightFinding, File, FileTree, LicenseFinding, Package, PrismaClient, ScannerJob } from 'database';
const prisma: PrismaClient = new PrismaClient();
import * as dbZodSchemas from 'validation-helpers';

// ------------------------- Database queries -------------------------

// ------------------------------ Create ------------------------------

export const createScannerJob = async (input: dbZodSchemas.CreateScannerJobInput): Promise<ScannerJob> => {
    return await prisma.scannerJob.create({
        data: input.data
    });
}

export const createPackage = async (input: dbZodSchemas.CreatePackageInput): Promise<Package> => {
    return await prisma.package.create({
        data: input.data
    });
}

export const createFile = async (input: dbZodSchemas.CreateFileInput): Promise<File> => {
    return await prisma.file.create({
        data: input.data
    });
}

export const createFileTree = async (input: dbZodSchemas.CreateFileTreeInput): Promise<FileTree> => {
    return await prisma.fileTree.create({
        data: input.data
    });
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

// ------------------------------ Update ------------------------------

export const updateScannerJob = async (input: dbZodSchemas.UpdateScannerJobInput): Promise<ScannerJob> => {
    return await prisma.scannerJob.update({
        where: {
            id: input.id
        },
        data: input.data
    })
}

export const updateFile = async (input: dbZodSchemas.UpdateFileInput): Promise<File> => {
    return await prisma.file.update({
        where: {
            id: input.id
        },
        data: input.data
    })
}

export const updatePackage = async (input: dbZodSchemas.UpdatePackageInput): Promise<Package> => {
    return await prisma.package.update({
        where: {
            id: input.id
        },
        data: input.data
    })
}

// ------------------------------- Find -------------------------------

export const findFileByHash = async (hash: string): Promise<File | null> => {
    return await prisma.file.findUnique({
        where: {
            sha256: hash
        },
    })
}

export const findFileTreesByPackageId = async (packageId: number): Promise<FileTree[] | null> => {
    return await prisma.fileTree.findMany({
        where: {
            packageId: packageId
        },
    })
}

export const findScannerJobById = async (id: string): Promise<ScannerJob | null> => {
    return await prisma.scannerJob.findUnique({
        where: {
            id: id
        },
    })
}

export const findScannerJobByPackageId = async (packageId: number): Promise<ScannerJob | null> => {
    return await prisma.scannerJob.findFirst({
        where: {
            packageId: packageId
        },
    })
}

export const findScannerJobsByPackageIds = async (packages: Package[]): Promise<ScannerJob[] | null> => {
    return await prisma.scannerJob.findMany({
        where: {
            packageId: {
                in: packages.map(p => p.id)
            }
        },
    })
}

export const findPackageByPurl = async (purl: string): Promise<Package | null> => {
    return await prisma.package.findFirst({
        where: {
            purl: purl
        },
    })
}

export const findPackagesByPurl = async (purl: string): Promise<Package[] | null> => {
    return await prisma.package.findMany({
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

// ------------------------------ Delete ------------------------------

// Delete all license findings related to scanner jobs
export const deleteLicenseFindingsByScannerJobIds = async (scannerJobs: ScannerJob[]): Promise<void> => {
    await prisma.licenseFinding.deleteMany({
        where: {
            scannerJobId: {
                in: scannerJobs.map(s => s.id)
            }
        }
    })
}

// Delete all copyright findings related to scanner jobs
export const deleteCopyrightFindingsByScannerJobIds = async (scannerJobs: ScannerJob[]): Promise<void> => {
    await prisma.copyrightFinding.deleteMany({
        where: {
            scannerJobId: {
                in: scannerJobs.map(s => s.id)
            }
        }
    })
}

// Delete all FileTrees related to packages
export const deleteFileTreesByPackageIds = async (packages: Package[]): Promise<void> => {
    await prisma.fileTree.deleteMany({
        where: {
            packageId: {
                in: packages.map(p => p.id)
            }
        }
    })
}

// Delete all scanner jobs related to packages
export const deleteScannerJobsByPackageIds = async (packages: Package[]): Promise<void> => {
    await prisma.scannerJob.deleteMany({
        where: {
            packageId: {
                in: packages.map(p => p.id)
            }
        }
    })
}

// Delete all packages with purl
export const deletePackagesByPurl = async (purl: string): Promise<void> => {
    await prisma.package.deleteMany({
        where: {
            purl: purl
        }
    })
}

// Delete all files that are not used by any FileTree
export const deleteFilesNotUsedByFileTrees = async (): Promise<void> => {
    const sha256s = await prisma.fileTree.findMany({
        select: {
            sha256: true
        }
    })

    console.log(sha256s);

    await prisma.file.deleteMany({
        where: {
            NOT: {
                sha256: {
                    in: sha256s.map(s => s.sha256)
                }
            }
        }
    })
}
