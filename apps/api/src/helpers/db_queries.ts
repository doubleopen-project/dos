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
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: ScannerJob | null = null;

    while (!scannerJob && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating ScannerJob: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!scannerJob) {
        throw ('Error: Unable to create ScannerJob');
    }

    return scannerJob;
}

export const createPackage = async (input: dbZodSchemas.CreatePackageInput): Promise<Package> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageObj: Package | null = null;

    while (!packageObj && retries > 0) {
        try {
            packageObj = await prisma.package.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating Package: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!packageObj) {
        throw ('Error: Unable to create Package');
    }

    return packageObj;
}

export const createFile = async (input: dbZodSchemas.CreateFileInput): Promise<File> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let file: File | null = null;

    while (!file && retries > 0) {
        try {
            file = await prisma.file.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating File: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!file) {
        throw ('Error: Unable to create File');
    }

    return file;
}

export const createFileTree = async (input: dbZodSchemas.CreateFileTreeInput): Promise<FileTree> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileTree: FileTree | null = null;

    while (!fileTree && retries > 0) {
        try {
            fileTree = await prisma.fileTree.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating FileTree: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!fileTree) {
        throw ('Error: Unable to create FileTree');
    }

    return fileTree;
}

export const createLicenseFinding = async (input: dbZodSchemas.CreateLicenseFindingInput): Promise<LicenseFinding> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let licenseFinding: LicenseFinding | null = null;

    while (!licenseFinding && retries > 0) {
        try {
            licenseFinding = await prisma.licenseFinding.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating LicenseFinding: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!licenseFinding) {
        throw ('Error: Unable to create LicenseFinding');
    }

    return licenseFinding;
}

export const createLicenseFindingMatch = async (input: dbZodSchemas.CreateLicenseFindingMatchInput): Promise<LicenseFindingMatch> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let licenseFindingMatch: LicenseFindingMatch | null = null;

    while (!licenseFindingMatch && retries > 0) {
        try {
            licenseFindingMatch = await prisma.licenseFindingMatch.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating LicenseFindingMatch: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!licenseFindingMatch) {
        throw ('Error: Unable to create LicenseFindingMatch');
    }

    return licenseFindingMatch;
}

export const createCopyrightFinding = async (input: dbZodSchemas.CreateCopyrightFindingInput): Promise<CopyrightFinding> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let copyrightFinding: CopyrightFinding | null = null;

    while (!copyrightFinding && retries > 0) {
        try {
            copyrightFinding = await prisma.copyrightFinding.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating CopyrightFinding: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!copyrightFinding) {
        throw ('Error: Unable to create CopyrightFinding');
    }

    return copyrightFinding;
}

export const createScanIssue = async (input: dbZodSchemas.CreateScanIssueInput): Promise<ScanIssue> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scanIssue: ScanIssue | null = null;

    while (!scanIssue && retries > 0) {
        try {
            scanIssue = await prisma.scanIssue.create({
                data: input.data
            });
        } catch (error) {
            console.log('Error creating ScanIssue: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!scanIssue) {
        throw ('Error: Unable to create ScanIssue');
    }

    return scanIssue;
}

// Create file if it doesn't exist, otherwise return existing file
export const createFileIfNotExists = async (input: dbZodSchemas.CreateFileInput): Promise<File> => {
    let file: File | null = await findFileByHash(input.data.sha256);

    if (!file) {
        file = await createFile(input);
    }

    return file;
}

// Create file tree if it doesn't exist, otherwise return existing file tree
export const createFileTreeIfNotExists = async (input: dbZodSchemas.CreateFileTreeInput): Promise<FileTree> => {
    let fileTree = await findFileTree(input);

    if (!fileTree) {
        fileTree = await createFileTree(input);
    }

    return fileTree;
}

// ------------------------------ Update ------------------------------

export const updateScannerJob = async (input: dbZodSchemas.UpdateScannerJobInput): Promise<ScannerJob> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: ScannerJob | null = null;

    while (!scannerJob && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.update({
                where: {
                    id: input.id
                },
                data: input.data
            })
        } catch (error) {
            console.log('Error with trying to update ScannerJob: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!scannerJob) {
        throw ('Error: Unable to update ScannerJob');
    }

    return scannerJob;
}

export const updateScannerJobsStatesByPackageIds = async (packageIds: number[], state: string): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.scannerJob.updateMany({
                where: {
                    packageId: {
                        in: packageIds
                    }
                },
                data: {
                    state: state,
                }
            })
        } catch (error) {
            console.log('Error with trying to update ScannerJobs: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!batchUpdate) {
        throw ('Error: Unable to update ScannerJobs');
    }

    return batchUpdate;
}

export const updateFile = async (input: dbZodSchemas.UpdateFileInput): Promise<File> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let file = null;

    while (!file && retries > 0) {
        try {
            file = await prisma.file.update({
                where: {
                    id: input.id
                },
                data: input.data
            })
        } catch (error) {
            console.log('Error with trying to update File: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!file) {
        throw ('Error: Unable to update File');
    }

    return file;
}

export const updateManyFilesStatuses = async (fileHashes: string[], scanStatus: string): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.file.updateMany({
                where: {
                    sha256: {
                        in: fileHashes
                    }
                },
                data: {
                    scanStatus: scanStatus,
                }
            })
        } catch (error) {
            console.log('Error with trying to update Files: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!batchUpdate) {
        throw ('Error: Unable to update Files');
    }

    return batchUpdate;
}

export const updatePackage = async (input: dbZodSchemas.UpdatePackageInput): Promise<Package> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageObj = null;

    while (!packageObj && retries > 0) {
        try {
            packageObj = await prisma.package.update({
                where: {
                    id: input.id
                },
                data: input.data
            })
        } catch (error) {
            console.log('Error with trying to update Package: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!packageObj) {
        throw ('Error: Unable to update Package');
    }

    return packageObj;
}

export const updatePackagesScanStatusesByPurl = async (purl: string, scanStatus: string): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.package.updateMany({
                where: {
                    purl: purl
                },
                data: {
                    scanStatus: scanStatus,
                }
            })
        } catch (error) {
            console.log('Error with trying to update Packages: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!batchUpdate) {
        throw ('Error: Unable to update Packages');
    }

    return batchUpdate;
}

// ------------------------------- Find -------------------------------

export const findFileByHash = async (hash: string): Promise<File | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let file: File | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            file = await prisma.file.findUnique({
                where: {
                    sha256: hash
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find File: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    return file;
}

export const findFileHashesByPackageIds = async (packageIds: number[]): Promise<string[] | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileHashes = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileHashes = await prisma.fileTree.findMany({
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
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find File hashes: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return fileHashes;
}

export const findFileTree = async (input: dbZodSchemas.CreateFileTreeInput): Promise<FileTree | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileTree = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileTree = await prisma.fileTree.findFirst({
                where: {
                    fileSha256: input.data.fileSha256,
                    packageId: input.data.packageId,
                    path: input.data.path
                }
            });
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find FileTree: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return fileTree;
}

export const findFileTreeByHashAndPackageId = async (hash: string, packageId: number): Promise<FileTree | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileTree: FileTree | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileTree = await prisma.fileTree.findFirst({
                where: {
                    fileSha256: hash,
                    packageId: packageId
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find FileTree: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return fileTree;
}

export const findScannerJobStateById = async (id: string): Promise<{ id: string, state: string } | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: { id: string, state: string } | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    state: true
                }
            })
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find ScannerJob: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return scannerJob;
}

export const findScannerJobIdStateByPackageId = async (packageId: number): Promise<{ id: string, state: string } | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: { id: string, state: string } | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findFirst({
                where: {
                    packageId: packageId
                },
                select: {
                    id: true,
                    state: true
                }
            })
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find ScannerJob: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return scannerJob;
}

export const findScannerJobsByPackageIds = async (packageIds: number[]): Promise<ScannerJob[] | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJobs: ScannerJob[] | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJobs = await prisma.scannerJob.findMany({
                where: {
                    packageId: {
                        in: packageIds
                    }
                },
            })
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find ScannerJobs: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return scannerJobs;
}

export const findPackageByPurl = async (purl: string): Promise<Package | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageObj: Package | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageObj = await prisma.package.findFirst({
                where: {
                    purl: purl
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find Package: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return packageObj;
}

export const findPackageIdByPurl = async (purl: string): Promise<number | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageId: number | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageId = await prisma.package.findFirst({
                where: {
                    purl: purl
                },
                select: {
                    id: true
                }
            }).then((foundPackage: { id: number } | null) => {
                return foundPackage ? foundPackage.id : null
            })
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find Package id: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return packageId;
}

export const findPackageIdsByPurl = async (purl: string): Promise<number[] | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageIds: number[] | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageIds = await prisma.package.findMany({
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
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find Package ids: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return packageIds;
}

export const getPackageScanResults = async (packageId: number) => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let results = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            results = await prisma.fileTree.findMany({
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
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find scan results: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }

    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return results;
}

// Find the id of the most recent scanner job with package id
export const findMostRecentScannerJobByPackageId = async (packageId: number): Promise<dbZodSchemas.ScannerJobOnlyIdOutput | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findFirst({
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
            querySuccess = true;
        } catch (error) {
            console.log('Error with trying to find ScannerJob: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw ('Error: Unable to find File hashes');
    }

    return scannerJob;
}

// ------------------------------ Delete ------------------------------

// Delete all license findings related to files
export const deleteLicenseFindingsByFileHashes = async (fileHashes: string[]): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.licenseFinding.deleteMany({
                where: {
                    fileSha256: {
                        in: fileHashes
                    }
                }
            })
        } catch (error) {
            console.log('Error with trying to delete LicenseFindings: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!batchDelete) {
        throw ('Error: Unable to delete LicenseFindings');
    }

    return batchDelete;
}

// Delete all copyright findings related to files
export const deleteCopyrightFindingsByFileHashes = async (fileHashes: string[]): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.copyrightFinding.deleteMany({
                where: {
                    fileSha256: {
                        in: fileHashes
                    }
                }
            })
        } catch (error) {
            console.log('Error with trying to delete CopyrightFindings: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!batchDelete) {
        throw ('Error: Unable to delete CopyrightFindings');
    }

    return batchDelete;
}

// Delete all scan issues related to files
export const deleteScanIssuesByFileHashes = async (fileHashes: string[]): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.scanIssue.deleteMany({
                where: {
                    fileSha256: {
                        in: fileHashes
                    }
                }
            })
        } catch (error) {
            console.log('Error with trying to delete ScanIssues: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (!batchDelete) {
        throw ('Error: Unable to delete ScanIssues');
    }

    return batchDelete;
}

// ------------------------------ Count --------------------------------

export const countFileTreesByPackageId = async (packageId: number): Promise<number> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let count = null;

    while (!count && retries > 0) {
        try {
            count = await prisma.fileTree.count({
                where: {
                    packageId: packageId
                }
            })
        } catch (error) {
            console.log('Error with trying to count FileTrees: ' + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) => setTimeout(resolve, retryInterval));
                console.log("Retrying database query");
            }
        }
    }

    if (count != 0 && !count) {
        throw ('Error: Unable to count FileTrees');
    }

    return count;
}