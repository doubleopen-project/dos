// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import { CopyrightFinding, File, FileTree, LicenseFinding, LicenseFindingMatch, Package, PrismaClient, ScannerJob, ScanIssue, Prisma } from 'database';
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

export const createManyLicenseFindings = async (licenseFindings: Prisma.LicenseFindingCreateManyInput[]): Promise<Prisma.BatchPayload> => {
    return await prisma.licenseFinding.createMany({
        data: licenseFindings
    });
}

export const createManyLicenseFindingMatches = async (licenseFindingMatches: Prisma.LicenseFindingMatchCreateManyInput[]): Promise<Prisma.BatchPayload> => {
    return await prisma.licenseFindingMatch.createMany({
        data: licenseFindingMatches
    });
}

export const createManyCopyrightFindings = async (copyrightFindings: Prisma.CopyrightFindingCreateManyInput[]): Promise<Prisma.BatchPayload> => {
    return await prisma.copyrightFinding.createMany({
        data: copyrightFindings
    });
}

export const createManyScanIssues = async (scanIssues: Prisma.ScanIssueCreateManyInput[]): Promise<Prisma.BatchPayload> => {
    return await prisma.scanIssue.createMany({
        data: scanIssues
    });
}

// Create file if it doesn't exist, otherwise return existing file
export const createFileIfNotExists = async (input: dbZodSchemas.CreateFileInput): Promise<File> => {
    return await prisma.file.upsert({
        where: {
            sha256: input.data.sha256
        },
        create: input.data,
        update: input.data
    });
}

// Create file tree if it doesn't exist, otherwise return existing file tree
export const createFileTreeIfNotExists = async (input: dbZodSchemas.CreateFileTreeInput): Promise<FileTree> => {
    const existingFileTree = await prisma.fileTree.findFirst({
        where: {
            fileSha256: input.data.fileSha256,
            packageId: input.data.packageId,
            path: input.data.path
        }
    });

    if (!existingFileTree) {
        return await prisma.fileTree.create({
            data: input.data
        });
    } else {
        return existingFileTree;
    }
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

export const findFileTreeByHashAndPackageIdAndPath = async (hash: string, packageId: number, path: string): Promise<FileTree | null> => {
    return await prisma.fileTree.findFirst({
        where: {
            fileSha256: hash,
            packageId: packageId,
            path: path
        },
    })
}

export const findScannerJobStateById = async (id: string): Promise<{ id: string, state: string } | null> => {
    return await prisma.scannerJob.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            state: true
        }
    })
}

export const findScannerJobIdStateByPackageId = async (packageId: number): Promise<{ id: string, state: string } | null> => {
    return await prisma.scannerJob.findFirst({
        where: {
            packageId: packageId
        },
        select: {
            id: true,
            state: true
        }
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

export const findPackageIdByPurl = async (purl: string): Promise<number | null> => {
    return await prisma.package.findFirst({
        where: {
            purl: purl
        },
        select: {
            id: true
        }
    }).then((foundPackage: { id: number } | null) => {
        return foundPackage ? foundPackage.id : null
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

// Delete all scan issues related to files
export const deleteScanIssuesByFileHashes = async (fileHashes: string[]): Promise<{ count: number }> => {
    return await prisma.scanIssue.deleteMany({
        where: {
            fileSha256: {
                in: fileHashes
            }
        }
    })
}

