// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import {
    CopyrightFinding,
    File,
    FileTree,
    LicenseFinding,
    LicenseFindingMatch,
    Package,
    PrismaClient,
    ScannerJob,
    ScanIssue,
    Prisma,
    User,
    LicenseConclusion,
} from "database";
const prisma: PrismaClient = new PrismaClient();
import * as dbZodSchemas from "validation-helpers";

// ------------------------- Database queries -------------------------

// ------------------------------ Create ------------------------------

export const createScannerJob = async (
    input: dbZodSchemas.CreateScannerJobInput,
): Promise<ScannerJob> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: ScannerJob | null = null;

    while (!scannerJob && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating ScannerJob: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!scannerJob) {
        throw "Error: Unable to create ScannerJob";
    }

    return scannerJob;
};

export const createPackage = async (
    input: dbZodSchemas.CreatePackageInput,
): Promise<Package> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageObj: Package | null = null;

    while (!packageObj && retries > 0) {
        try {
            packageObj = await prisma.package.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating Package: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!packageObj) {
        throw "Error: Unable to create Package";
    }

    return packageObj;
};

export const createFile = async (
    input: dbZodSchemas.CreateFileInput,
): Promise<File> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let file: File | null = null;

    while (!file && retries > 0) {
        try {
            file = await prisma.file.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating File: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!file) {
        throw "Error: Unable to create File";
    }

    return file;
};

export const createFileTree = async (
    input: dbZodSchemas.CreateFileTreeInput,
): Promise<FileTree> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileTree: FileTree | null = null;

    while (!fileTree && retries > 0) {
        try {
            fileTree = await prisma.fileTree.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating FileTree: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!fileTree) {
        throw "Error: Unable to create FileTree";
    }

    return fileTree;
};

export const createLicenseFinding = async (
    input: dbZodSchemas.CreateLicenseFindingInput,
): Promise<LicenseFinding> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let licenseFinding: LicenseFinding | null = null;

    while (!licenseFinding && retries > 0) {
        try {
            licenseFinding = await prisma.licenseFinding.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating LicenseFinding: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!licenseFinding) {
        throw "Error: Unable to create LicenseFinding";
    }

    return licenseFinding;
};

export const createLicenseFindingMatch = async (
    input: dbZodSchemas.CreateLicenseFindingMatchInput,
): Promise<LicenseFindingMatch> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let licenseFindingMatch: LicenseFindingMatch | null = null;

    while (!licenseFindingMatch && retries > 0) {
        try {
            licenseFindingMatch = await prisma.licenseFindingMatch.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating LicenseFindingMatch: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!licenseFindingMatch) {
        throw "Error: Unable to create LicenseFindingMatch";
    }

    return licenseFindingMatch;
};

export const createLicenseConclusion = async (
    input: dbZodSchemas.CreateLicenseConclusionInput,
): Promise<LicenseConclusion> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let licenseConclusion: LicenseConclusion | null = null;

    while (!licenseConclusion && retries > 0) {
        try {
            licenseConclusion = await prisma.licenseConclusion.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating LicenseConclusion: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
            }
        }
    }

    if (!licenseConclusion) {
        throw "Error: Unable to create LicenseConclusion";
    }

    return licenseConclusion;
};

export const createCopyrightFinding = async (
    input: dbZodSchemas.CreateCopyrightFindingInput,
): Promise<CopyrightFinding> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let copyrightFinding: CopyrightFinding | null = null;

    while (!copyrightFinding && retries > 0) {
        try {
            copyrightFinding = await prisma.copyrightFinding.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating CopyrightFinding: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!copyrightFinding) {
        throw "Error: Unable to create CopyrightFinding";
    }

    return copyrightFinding;
};

export const createScanIssue = async (
    input: dbZodSchemas.CreateScanIssueInput,
): Promise<ScanIssue> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scanIssue: ScanIssue | null = null;

    while (!scanIssue && retries > 0) {
        try {
            scanIssue = await prisma.scanIssue.create({
                data: input.data,
            });
        } catch (error) {
            console.log("Error creating ScanIssue: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!scanIssue) {
        throw "Error: Unable to create ScanIssue";
    }

    return scanIssue;
};

export const createUser = async (
    input: Prisma.UserCreateInput,
): Promise<User> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let user: User | null = null;

    while (!user && retries > 0) {
        try {
            user = await prisma.user.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating User: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!user) {
        throw "Error: Unable to create User";
    }

    return user;
};

// Create file if it doesn't exist, otherwise return existing file
export const createFileIfNotExists = async (
    input: dbZodSchemas.CreateFileInput,
): Promise<File> => {
    let file: File | null = await findFileByHash(input.data.sha256);

    if (!file) {
        file = await createFile(input);
    }

    return file;
};

// Create file tree if it doesn't exist, otherwise return existing file tree
export const createFileTreeIfNotExists = async (
    input: dbZodSchemas.CreateFileTreeInput,
): Promise<FileTree> => {
    let fileTree = await findFileTree(input);

    if (!fileTree) {
        fileTree = await createFileTree(input);
    }

    return fileTree;
};

// ------------------------------ Update ------------------------------

export const updateScannerJob = async (
    id: string,
    input: Prisma.ScannerJobUpdateInput,
): Promise<ScannerJob> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: ScannerJob | null = null;

    while (!scannerJob && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.update({
                where: {
                    id: id,
                },
                data: input,
            });
        } catch (error) {
            console.log("Error with trying to update ScannerJob: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!scannerJob) {
        throw "Error: Unable to update ScannerJob";
    }

    return scannerJob;
};

export const updateScannerJobsStatesByPackageIds = async (
    packageIds: number[],
    state: string,
): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.scannerJob.updateMany({
                where: {
                    packageId: {
                        in: packageIds,
                    },
                },
                data: {
                    state: state,
                },
            });
        } catch (error) {
            console.log("Error with trying to update ScannerJobs: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!batchUpdate) {
        throw "Error: Unable to update ScannerJobs";
    }

    return batchUpdate;
};

export const updateFile = async (
    input: dbZodSchemas.UpdateFileInput,
): Promise<File> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let file = null;

    while (!file && retries > 0) {
        try {
            file = await prisma.file.update({
                where: {
                    id: input.id,
                },
                data: input.data,
            });
        } catch (error) {
            console.log("Error with trying to update File: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!file) {
        throw "Error: Unable to update File";
    }

    return file;
};

export const updateManyFilesStatuses = async (
    fileHashes: string[],
    scanStatus: string,
): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.file.updateMany({
                where: {
                    sha256: {
                        in: fileHashes,
                    },
                },
                data: {
                    scanStatus: scanStatus,
                },
            });
        } catch (error) {
            console.log("Error with trying to update Files: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!batchUpdate) {
        throw "Error: Unable to update Files";
    }

    return batchUpdate;
};

export const updatePackage = async (
    input: dbZodSchemas.UpdatePackageInput,
): Promise<Package> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageObj = null;

    while (!packageObj && retries > 0) {
        try {
            packageObj = await prisma.package.update({
                where: {
                    id: input.id,
                },
                data: input.data,
            });
        } catch (error) {
            console.log("Error with trying to update Package: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!packageObj) {
        throw "Error: Unable to update Package";
    }

    return packageObj;
};

export const updatePackagesScanStatusesByPurl = async (
    purl: string,
    scanStatus: string,
): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.package.updateMany({
                where: {
                    purl: purl,
                },
                data: {
                    scanStatus: scanStatus,
                },
            });
        } catch (error) {
            console.log("Error with trying to update Packages: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!batchUpdate) {
        throw "Error: Unable to update Packages";
    }

    return batchUpdate;
};

export const updateLicenseConclusion = async (
    id: number,
    input: Prisma.LicenseConclusionUpdateInput,
): Promise<LicenseConclusion | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let licenseConclusion: LicenseConclusion | null = null;

    while (!licenseConclusion && retries > 0) {
        try {
            licenseConclusion = await prisma.licenseConclusion.update({
                where: {
                    id: id,
                },
                data: input,
            });
        } catch (error) {
            console.log(
                "Error with trying to update LicenseConclusion: " + error,
            );

            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
            } else {
                throw error;
            }
        }
    }

    if (!licenseConclusion) {
        throw "Error: Unable to update LicenseConclusion";
    }

    return licenseConclusion;
};

export const updateUser = async (
    id: number,
    input: Prisma.UserUpdateInput,
): Promise<User> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let user: User | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            user = await prisma.user.update({
                where: {
                    id: id,
                },
                data: input,
            });
            querySuccess = true;
        } catch (error) {
            // if error contains Unique constraint failed on the fields: (`username`)
            // then the username is already taken
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            )
                throw error;

            console.log("Error with trying to update User: " + error);
            if (retries > 0) {
                retries--;
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            } else {
                throw error;
            }
        }
    }

    if (!user) throw new Error("Error: Unable to update User");

    return user;
};

// ------------------------------- Find -------------------------------

export const findFileByHash = async (hash: string): Promise<File | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let file: File | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            file = await prisma.file.findUnique({
                where: {
                    sha256: hash,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find File: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    return file;
};

export const findFileHashesByPackageIds = async (
    packageIds: number[],
): Promise<string[] | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileHashes = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileHashes = await prisma.fileTree
                .findMany({
                    where: {
                        packageId: {
                            in: packageIds,
                        },
                    },
                    select: {
                        fileSha256: true,
                    },
                })
                .then((fileTrees: { fileSha256: string }[]) => {
                    return fileTrees.map((elem: { fileSha256: string }) => {
                        return elem.fileSha256;
                    });
                });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find File hashes: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return fileHashes;
};

export const findFileTree = async (
    input: dbZodSchemas.CreateFileTreeInput,
): Promise<FileTree | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileTree = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileTree = await prisma.fileTree.findFirst({
                where: {
                    fileSha256: input.data.fileSha256,
                    packageId: input.data.packageId,
                    path: input.data.path,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileTree: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return fileTree;
};

export const findFileTreeByHashAndPackageId = async (
    hash: string,
    packageId: number,
): Promise<FileTree | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let fileTree: FileTree | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileTree = await prisma.fileTree.findFirst({
                where: {
                    fileSha256: hash,
                    packageId: packageId,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileTree: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return fileTree;
};

export type FileTreeWithRelations = Prisma.FileTreeGetPayload<{
    select: {
        path: true;
        packageId: true;
        fileSha256: true;
        file: {
            select: {
                licenseFindings: {
                    select: {
                        licenseExpressionSPDX: true;
                    };
                };
                licenseConclusions: {
                    select: {
                        concludedLicenseExpressionSPDX: true;
                    };
                };
            };
        };
    };
}>;

export const findFileTreesByPackagePurl = async (
    purl: string,
): Promise<FileTreeWithRelations[]> => {
    const filetrees = await prisma.fileTree.findMany({
        where: {
            package: {
                purl: purl,
            },
        },
        select: {
            path: true,
            packageId: true,
            fileSha256: true,
            file: {
                select: {
                    licenseFindings: {
                        select: {
                            licenseExpressionSPDX: true,
                        },
                    },
                    licenseConclusions: {
                        select: {
                            concludedLicenseExpressionSPDX: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            path: "asc",
        },
    });

    return filetrees;
};

export const findScannerJobStateById = async (
    id: string,
): Promise<{ id: string; state: string } | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: { id: string; state: string } | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    state: true,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find ScannerJob: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return scannerJob;
};

export const findScannerJobIdStateByPackageId = async (
    packageId: number,
): Promise<{ id: string; state: string } | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob: { id: string; state: string } | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findFirst({
                where: {
                    packageId: packageId,
                },
                select: {
                    id: true,
                    state: true,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find ScannerJob: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return scannerJob;
};

export const findScannerJobsByPackageIds = async (
    packageIds: number[],
): Promise<ScannerJob[] | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJobs: ScannerJob[] | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJobs = await prisma.scannerJob.findMany({
                where: {
                    packageId: {
                        in: packageIds,
                    },
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find ScannerJobs: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return scannerJobs;
};

export const findPackageByPurl = async (
    purl: string,
): Promise<Package | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageObj: Package | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageObj = await prisma.package.findFirst({
                where: {
                    purl: purl,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find Package: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return packageObj;
};

export const findPackageIdByPurl = async (
    purl: string,
): Promise<number | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageId: number | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageId = await prisma.package
                .findFirst({
                    where: {
                        purl: purl,
                    },
                    select: {
                        id: true,
                    },
                })
                .then((foundPackage: { id: number } | null) => {
                    return foundPackage ? foundPackage.id : null;
                });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find Package id: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return packageId;
};

export const findPackageIdsByPurl = async (
    purl: string,
): Promise<number[] | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let packageIds: number[] | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageIds = await prisma.package
                .findMany({
                    where: {
                        purl: purl,
                    },
                    select: {
                        id: true,
                    },
                })
                .then((packages: { id: number }[]) => {
                    return packages.map((elem: { id: number }) => {
                        return elem.id;
                    });
                });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find Package ids: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return packageIds;
};

export const getPackageScanResults = async (packageId: number) => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let results = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            results = await prisma.fileTree.findMany({
                where: {
                    packageId: packageId,
                },
                include: {
                    file: {
                        include: {
                            licenseFindings: {
                                include: {
                                    licenseFindingMatches: true,
                                },
                            },
                            licenseConclusions: true,
                            copyrightFindings: true,
                            scanIssues: true,
                        },
                    },
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find scan results: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return results;
};

// Find the id of the most recent scanner job with package id
export const findMostRecentScannerJobByPackageId = async (
    packageId: number,
): Promise<dbZodSchemas.ScannerJobOnlyIdOutput | null> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let scannerJob = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findFirst({
                where: {
                    packageId: packageId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find ScannerJob: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!querySuccess) {
        throw "Error: Unable to find File hashes";
    }

    return scannerJob;
};

type ScanIssueWithRelations = Prisma.ScanIssueGetPayload<{
    include: {
        file: {
            include: {
                filetrees: {
                    include: {
                        package: true;
                    };
                };
            };
        };
    };
}>;

export const findScanIssuesWithRelatedFileAndPackageAndFileTree =
    async (): Promise<ScanIssueWithRelations[]> => {
        let scanIssues: ScanIssueWithRelations[] = [];
        let retries = parseInt(process.env.DB_RETRIES as string) || 5;
        const retryInterval =
            parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
        let querySuccess = false;

        while (!querySuccess && retries > 0) {
            try {
                scanIssues = await prisma.scanIssue.findMany({
                    include: {
                        file: {
                            include: {
                                filetrees: {
                                    include: {
                                        package: true,
                                    },
                                },
                            },
                        },
                    },
                });
                querySuccess = true;
            } catch (error) {
                console.log("Error with trying to find ScanIssues: " + error);
                retries--;
                if (retries > 0) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, retryInterval),
                    );
                    console.log("Retrying database query");
                }
            }
        }
        return scanIssues;
    };

export const findUser = async (token: string): Promise<User | null> => {
    let user: User | null = null;
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            user = await prisma.user.findUnique({
                where: {
                    token: token,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find User: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }
    return user;
};

export const findUserById = async (id: number): Promise<User | null> => {
    let user: User | null = null;
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find User: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }
    return user;
};

export const findUserByUsername = async (
    username: string,
): Promise<User | null> => {
    let user: User | null = null;
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find User: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }
    return user;
};

export const findScannedPackages = async (): Promise<
    { purl: string; updatedAt: Date }[]
> => {
    let scannedPackages: { purl: string; updatedAt: Date }[] = [];
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannedPackages = await prisma.package.findMany({
                where: {
                    scanStatus: "scanned",
                },
                select: {
                    purl: true,
                    updatedAt: true,
                },
                orderBy: {
                    purl: "asc",
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find ScannedPackages: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            } else {
                throw new Error(
                    "Error: Unable to perform query to find ScannedPackages",
                );
            }
        }
    }
    return scannedPackages;
};

export const findFileSha256 = async (
    purl: string,
    path: string,
): Promise<string> => {
    let fileSha256: string | null = null;
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileSha256 = await prisma.fileTree
                .findFirst({
                    where: {
                        package: {
                            purl: purl,
                        },
                        path: path,
                    },
                    select: {
                        fileSha256: true,
                    },
                })
                .then((fileTree: { fileSha256: string } | null) => {
                    if (!fileTree) {
                        throw new Error("Error: Unable to find file sha256");
                    }
                    return fileTree.fileSha256;
                });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileSha256: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            } else {
                throw new Error(
                    "Error: Unable to perform query to find FileSha256",
                );
            }
        }
    }

    if (!fileSha256) throw new Error("Error: Unable to find FileSha256");
    return fileSha256;
};

export type FileWithRelations = Prisma.FileGetPayload<{
    select: {
        licenseFindings: {
            select: {
                id: true;
                updatedAt: true;
                licenseExpressionSPDX: true;
                licenseFindingMatches: {
                    select: {
                        id: true;
                        updatedAt: true;
                        licenseExpression: true;
                        startLine: true;
                        endLine: true;
                        score: true;
                    };
                };
            };
        };
        copyrightFindings: {
            select: {
                id: true;
                updatedAt: true;
                copyright: true;
                startLine: true;
                endLine: true;
            };
        };
        licenseConclusions: {
            select: {
                id: true;
                createdAt: true;
                updatedAt: true;
                detectedLicenseExpressionSPDX: true;
                concludedLicenseExpressionSPDX: true;
                comment: true;
                contextPurl: true;
                user: {
                    select: {
                        username: true;
                    };
                };
            };
        };
    };
}>;

export const findFileData = async (
    sha256: string,
): Promise<FileWithRelations | null> => {
    let file: FileWithRelations | null = null;
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            file = await prisma.file.findUnique({
                where: {
                    sha256: sha256,
                },
                select: {
                    licenseFindings: {
                        select: {
                            id: true,
                            updatedAt: true,
                            licenseExpressionSPDX: true,
                            licenseFindingMatches: {
                                select: {
                                    id: true,
                                    updatedAt: true,
                                    licenseExpression: true,
                                    startLine: true,
                                    endLine: true,
                                    score: true,
                                },
                            },
                        },
                    },
                    copyrightFindings: {
                        select: {
                            id: true,
                            updatedAt: true,
                            copyright: true,
                            startLine: true,
                            endLine: true,
                        },
                    },
                    licenseConclusions: {
                        select: {
                            id: true,
                            createdAt: true,
                            updatedAt: true,
                            detectedLicenseExpressionSPDX: true,
                            concludedLicenseExpressionSPDX: true,
                            comment: true,
                            contextPurl: true,
                            user: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileData: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            } else {
                throw new Error(
                    "Error: Unable to perform query to find FileData",
                );
            }
        }
    }
    return file;
};

export const findLicenseConclusionUserId = async (
    id: number,
): Promise<number | null> => {
    let licenseConclusion: { userId: number } | null = null;
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            licenseConclusion = await prisma.licenseConclusion.findUnique({
                where: {
                    id: id,
                },
                select: {
                    userId: true,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log(
                "Error with trying to find LicenseConclusionUserId: " + error,
            );
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            } else {
                throw new Error(
                    "Error: Unable to perform query to find LicenseConclusionUserId",
                );
            }
        }
    }
    return licenseConclusion ? licenseConclusion.userId : null;
};

// ------------------------------ Delete ------------------------------

// Delete all license findings related to files
export const deleteLicenseFindingsByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.licenseFinding.deleteMany({
                where: {
                    fileSha256: {
                        in: fileHashes,
                    },
                },
            });
        } catch (error) {
            console.log(
                "Error with trying to delete LicenseFindings: " + error,
            );
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!batchDelete) {
        throw "Error: Unable to delete LicenseFindings";
    }

    return batchDelete;
};

// Delete all copyright findings related to files
export const deleteCopyrightFindingsByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.copyrightFinding.deleteMany({
                where: {
                    fileSha256: {
                        in: fileHashes,
                    },
                },
            });
        } catch (error) {
            console.log(
                "Error with trying to delete CopyrightFindings: " + error,
            );
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!batchDelete) {
        throw "Error: Unable to delete CopyrightFindings";
    }

    return batchDelete;
};

// Delete all scan issues related to files
export const deleteScanIssuesByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.scanIssue.deleteMany({
                where: {
                    fileSha256: {
                        in: fileHashes,
                    },
                },
            });
        } catch (error) {
            console.log("Error with trying to delete ScanIssues: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (!batchDelete) {
        throw "Error: Unable to delete ScanIssues";
    }

    return batchDelete;
};

export const deleteLicenseConclusion = async (
    id: number,
): Promise<LicenseConclusion | null> => {
    return await prisma.licenseConclusion.delete({
        where: {
            id: id,
        },
    });
};

export const deleteUser = async (id: number): Promise<User | null> => {
    return await prisma.user.delete({
        where: {
            id: id,
        },
    });
};

// ------------------------------ Count --------------------------------

export const countFileTreesByPackageId = async (
    packageId: number,
): Promise<number> => {
    let retries = parseInt(process.env.DB_RETRIES as string) || 5;
    const retryInterval =
        parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;
    let count = null;

    while (!count && retries > 0) {
        try {
            count = await prisma.fileTree.count({
                where: {
                    packageId: packageId,
                },
            });
        } catch (error) {
            console.log("Error with trying to count FileTrees: " + error);
            retries--;
            if (retries > 0) {
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
                console.log("Retrying database query");
            }
        }
    }

    if (count != 0 && !count) {
        throw "Error: Unable to count FileTrees";
    }

    return count;
};
