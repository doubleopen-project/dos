// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { CopyrightFinding, File, FileTree, LicenseFinding, LicenseFindingMatch, Package, PrismaClient, ScannerJob, ScanIssue } from 'database';
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

export const createLicenseFindingMatch = async (input: dbZodSchemas.CreateLicenseFindingMatchInput): Promise<LicenseFindingMatch> => {
    return await prisma.licenseFindingMatch.create({
        data: input.data
    });
}

export const createCopyrightFinding = async (input: dbZodSchemas.CreateCopyrightFindingInput): Promise<CopyrightFinding> => {
    return await prisma.copyrightFinding.create({
        data: input.data
    });
}

export const createScanIssue = async (input: dbZodSchemas.CreateScanIssueInput): Promise<ScanIssue> => {
    return await prisma.scanIssue.create({
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

export const updateScannerJobsStatesByPackageIds = async (packageIds: number[], state: string): Promise<{ count: number }> => {
    return await prisma.scannerJob.updateMany({
        where: {
            packageId: {
                in: packageIds
            }
        },
        data: {
            state: state,
        }
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

export const updateManyFilesStatuses = async (fileHashes: string[], scanStatus: string): Promise<{ count: number }> => {
    return await prisma.file.updateMany({
        where: {
            sha256: {
                in: fileHashes
            }
        },
        data: {
            scanStatus: scanStatus,
        }
    })
}

export const updateFileStatusesByPackageId = async (packageId: number, scanStatus: string): Promise<{ count: number }> => {
    return await prisma.file.updateMany({
        where: {
            filetrees: {
                every: {
                    packageId: packageId
                }
            }
        },
        data: {
            scanStatus: scanStatus,
        }
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

export const updatePackagesScanStatusesByPurl = async (purl: string, scanStatus: string): Promise<{ count: number }> => {
    return await prisma.package.updateMany({
        where: {
            purl: purl
        },
        data: {
            scanStatus: scanStatus,
        }
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

export const findFileHashesByPackageIds = async (packageIds: number[]): Promise<string[] | null> => {
    return await prisma.fileTree.findMany({
        where: {
            packageId: {
                in: packageIds
            }
        },
        select: {
            fileSha256: true
        }
    }).then((fileTrees: { fileSha256: string }[]) => {
        return fileTrees.map((elem: { fileSha256: string }) => {
            return elem.fileSha256
        })
    })
}

export const findFileTreeByHashAndPackageId = async (hash: string, packageId: number): Promise<FileTree | null> => {
    return await prisma.fileTree.findFirst({
        where: {
            fileSha256: hash,
            packageId: packageId
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

export const findScannerJobsByPackageIds = async (packageIds: number[]): Promise<ScannerJob[] | null> => {
    return await prisma.scannerJob.findMany({
        where: {
            packageId: {
                in: packageIds
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

export const findPackageIdsByPurl = async (purl: string): Promise<number[] | null> => {
    return await prisma.package.findMany({
        where: {
            purl: purl
        },
        select: {
            id: true
        }
    }).then((packages: { id: number }[]) => {
        return packages.map((elem: { id: number }) => {
            return elem.id
        })
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
                    licenseFindings: {
                        include: {
                            licenseFindingMatches: true
                        }
                    },
                    copyrightFindings: true,
                    scanIssues: true
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

// Delete all license findings related to files
export const deleteLicenseFindingsByFileHashes = async (fileHashes: string[]): Promise<{ count: number }> => {
    return await prisma.licenseFinding.deleteMany({
        where: {
            fileSha256: {
                in: fileHashes
            }
        }
    })
}

// Delete all copyright findings related to files
export const deleteCopyrightFindingsByFileHashes = async (fileHashes: string[]): Promise<{ count: number }> => {
    return await prisma.copyrightFinding.deleteMany({
        where: {
            fileSha256: {
                in: fileHashes
            }
        }
    })
}

// Delete all FileTrees related to packages
export const deleteFileTreesByPackageIds = async (packageIds: number[]): Promise<void> => {
    await prisma.fileTree.deleteMany({
        where: {
            packageId: {
                in: packageIds
            }
        }
    })
}

// Delete all scanner jobs related to packages
export const deleteScannerJobsByPackageIds = async (packageIds: number[]): Promise<void> => {
    await prisma.scannerJob.deleteMany({
        where: {
            packageId: {
                in: packageIds
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
export const deleteFilesNotUsedByFileTrees = async (fileHashes: string[]): Promise<void> => {
    const sha256s: { fileSha256: string; }[] = await prisma.fileTree.findMany({
        select: {
            fileSha256: true
        }
    })

    await prisma.file.deleteMany({
        where: {
            sha256: {
                in: fileHashes
            },
            NOT: {
                sha256: {
                    in: sha256s.map(s => s.fileSha256)
                }
            }
        }
    })
}
