// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import {
    BulkCuration,
    CopyrightFinding,
    File,
    FileTree,
    LicenseConclusion,
    LicenseFinding,
    LicenseFindingMatch,
    Package,
    PathExclusion,
    Prisma,
    PrismaClient,
    ScanIssue,
    ScannerJob,
    SystemIssue,
    User,
} from "database";

const prisma: PrismaClient = new PrismaClient();

const initialRetryCount = parseInt(process.env.DB_RETRIES as string) || 5;
const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL as string) || 1000;

const handleError = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log("Prisma error code: ", error.code);
        // Prisma error codes reference: https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
        switch (error.code) {
            case "P2000":
            case "P2001":
            case "P2002":
            case "P2003":
            case "P2004":
            case "P2015":
            case "P2025":
                throw error;
            default:
                break;
        }
    }
};

const waitToRetry = async () => {
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
    console.log("Retrying database query");
};

// ------------------------- Database queries -------------------------

// ------------------------------ Create ------------------------------

export const createScannerJob = async (input: {
    state: string;
    packageId: number;
    objectStorageKey?: string;
    parentId?: string;
}): Promise<ScannerJob> => {
    let retries = initialRetryCount;
    let scannerJob: ScannerJob | null = null;

    while (!scannerJob && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating ScannerJob: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!scannerJob) throw new Error("Error: Unable to create ScannerJob");

    return scannerJob;
};

export const createPackage = async (
    input: Prisma.PackageCreateInput,
): Promise<Package> => {
    let retries = initialRetryCount;
    let packageObj: Package | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageObj = await prisma.package.create({
                data: input,
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error creating Package: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!packageObj) throw new Error("Error: Unable to create Package");

    return packageObj;
};

export const createFile = async (
    input: Prisma.FileCreateInput,
): Promise<File> => {
    let retries = initialRetryCount;
    let file: File | null = null;

    while (!file && retries > 0) {
        try {
            file = await prisma.file.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating File: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!file) throw new Error("Error: Unable to create File");

    return file;
};

type CreateFileTreeType = {
    path: string;
    packageId: number;
    fileSha256: string;
};

export const createFileTree = async (
    input: CreateFileTreeType,
): Promise<FileTree> => {
    let retries = initialRetryCount;
    let fileTree: FileTree | null = null;

    while (!fileTree && retries > 0) {
        try {
            fileTree = await prisma.fileTree.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating FileTree: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!fileTree) throw new Error("Error: Unable to create FileTree");

    return fileTree;
};

export const createLicenseFinding = async (input: {
    licenseExpressionSPDX: string;
    scanner: string;
    scannerConfig: string;
    fileSha256: string;
}): Promise<LicenseFinding> => {
    let retries = initialRetryCount;
    let licenseFinding: LicenseFinding | null = null;

    while (!licenseFinding && retries > 0) {
        try {
            licenseFinding = await prisma.licenseFinding.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating LicenseFinding: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!licenseFinding)
        throw new Error("Error: Unable to create LicenseFinding");

    return licenseFinding;
};

export const createLicenseFindingMatch = async (input: {
    licenseExpression: string;
    startLine: number;
    endLine: number;
    score: number;
    licenseFindingId: number;
}): Promise<LicenseFindingMatch> => {
    let retries = initialRetryCount;
    let licenseFindingMatch: LicenseFindingMatch | null = null;

    while (!licenseFindingMatch && retries > 0) {
        try {
            licenseFindingMatch = await prisma.licenseFindingMatch.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating LicenseFindingMatch: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!licenseFindingMatch)
        throw new Error("Error: Unable to create LicenseFindingMatch");

    return licenseFindingMatch;
};

export const createLicenseConclusion = async (input: {
    concludedLicenseExpressionSPDX: string;
    detectedLicenseExpressionSPDX: string | null;
    comment: string | null;
    local: boolean | undefined;
    contextPurl: string;
    fileSha256: string;
    userId: number;
}): Promise<LicenseConclusion> => {
    let retries = initialRetryCount;
    let licenseConclusion: LicenseConclusion | null = null;

    while (!licenseConclusion && retries > 0) {
        try {
            licenseConclusion = await prisma.licenseConclusion.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating LicenseConclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!licenseConclusion)
        throw new Error("Error: Unable to create LicenseConclusion");

    return licenseConclusion;
};

export const createManyLicenseConclusions = async (
    input: Prisma.LicenseConclusionCreateManyInput[],
): Promise<Prisma.BatchPayload> => {
    let retries = initialRetryCount;
    let batchCreate = null;

    while (!batchCreate && retries > 0) {
        try {
            batchCreate = await prisma.licenseConclusion.createMany({
                data: input,
            });
        } catch (error) {
            console.log("Error creating LicenseConclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchCreate)
        throw new Error("Error: Unable to create LicenseConclusions");

    return batchCreate;
};

export const createBulkCuration = async (input: {
    pattern: string;
    concludedLicenseExpressionSPDX: string;
    detectedLicenseExpressionSPDX: string | null;
    comment: string | null;
    local: boolean | undefined;
    packageId: number;
    userId: number;
}): Promise<BulkCuration> => {
    let retries = initialRetryCount;
    let bulkCuration: BulkCuration | null = null;

    while (!bulkCuration && retries > 0) {
        try {
            bulkCuration = await prisma.bulkCuration.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating BulkCuration: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!bulkCuration) throw new Error("Error: Unable to create BulkCuration");

    return bulkCuration;
};

export const createCopyrightFinding = async (input: {
    copyright: string;
    startLine: number;
    endLine: number;
    scanner: string;
    scannerConfig: string;
    fileSha256: string;
}): Promise<CopyrightFinding> => {
    let retries = initialRetryCount;
    let copyrightFinding: CopyrightFinding | null = null;

    while (!copyrightFinding && retries > 0) {
        try {
            copyrightFinding = await prisma.copyrightFinding.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating CopyrightFinding: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!copyrightFinding)
        throw new Error("Error: Unable to create CopyrightFinding");

    return copyrightFinding;
};

export const createScanIssue = async (input: {
    severity: string;
    message: string;
    scanner: string;
    scannerConfig: string;
    fileSha256: string;
}): Promise<ScanIssue> => {
    let retries = initialRetryCount;
    let scanIssue: ScanIssue | null = null;

    while (!scanIssue && retries > 0) {
        try {
            scanIssue = await prisma.scanIssue.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating ScanIssue: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!scanIssue) throw new Error("Error: Unable to create ScanIssue");

    return scanIssue;
};

export const createSystemIssue = async (
    input: Prisma.SystemIssueCreateInput,
) => {
    let retries = initialRetryCount;
    let systemIssue: SystemIssue | null = null;

    while (!systemIssue && retries > 0) {
        try {
            systemIssue = await prisma.systemIssue.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating SystemIssue: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }

        if (!systemIssue)
            throw new Error("Error: Unable to create SystemIssue");
    }

    return systemIssue;
};

export const createUser = async (
    input: Prisma.UserCreateInput,
): Promise<User> => {
    let retries = initialRetryCount;
    let user: User | null = null;

    while (!user && retries > 0) {
        try {
            user = await prisma.user.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating User: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!user) throw new Error("Error: Unable to create User");

    return user;
};

export const createPathExclusion = async (input: {
    pattern: string;
    reason: string;
    comment: string | null;
    packageId: number;
    userId: number;
}): Promise<PathExclusion> => {
    let retries = initialRetryCount;
    let pathExclusion: PathExclusion | null = null;

    while (!pathExclusion && retries > 0) {
        try {
            pathExclusion = await prisma.pathExclusion.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating PathExclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!pathExclusion)
        throw new Error("Error: Unable to create PathExclusion");

    return pathExclusion;
};

// Create file if it doesn't exist, otherwise return existing file
export const createFileIfNotExists = async (
    input: Prisma.FileCreateInput,
): Promise<File> => {
    let file: File | null = await findFileByHash(input.sha256);

    if (!file) {
        file = await createFile(input);
    }

    return file;
};

// Create file tree if it doesn't exist, otherwise return existing file tree
export const createFileTreeIfNotExists = async (
    input: CreateFileTreeType,
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
    let retries = initialRetryCount;
    let scannerJob: ScannerJob | null = null;

    if (input.state === "failed") {
        const jobStateObj = await findScannerJobStateById(id);
        if (jobStateObj) input.failureState = jobStateObj.state;
    }

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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!scannerJob) throw new Error("Error: Unable to update ScannerJob");

    return scannerJob;
};

export const updateManyScannerJobStates = async (
    ids: string[],
    state: string,
    failureState?: string,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.scannerJob.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
                data: {
                    state: state,
                    failureState: failureState,
                },
            });
        } catch (error) {
            console.log("Error with trying to update ScannerJobs: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchUpdate) throw new Error("Error: Unable to update ScannerJobs");

    return batchUpdate;
};

export const updateManyPackagesScanStatuses = async (
    packageIds: number[],
    scanStatus: string,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.package.updateMany({
                where: {
                    id: {
                        in: packageIds,
                    },
                },
                data: {
                    scanStatus: scanStatus,
                },
            });
        } catch (error) {
            console.log("Error with trying to update Packages: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchUpdate) throw new Error("Error: Unable to update Packages");

    return batchUpdate;
};

export const updateFile = async (input: {
    id: number;
    data: Prisma.FileUpdateInput;
}): Promise<File> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!file) throw new Error("Error: Unable to update File");

    return file;
};

export const updateManyFilesStatuses = async (
    fileHashes: string[],
    scanStatus: string,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!batchUpdate) throw new Error("Error: Unable to update Files");

    return batchUpdate;
};

export const updatePackage = async (input: {
    id: number;
    data: Prisma.PackageUpdateInput;
}): Promise<Package> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!packageObj) throw new Error("Error: Unable to update Package");

    return packageObj;
};

export const updatePackagesScanStatusesByPurl = async (
    purl: string,
    scanStatus: string,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!batchUpdate) throw new Error("Error: Unable to update Packages");

    return batchUpdate;
};

export const updateLicenseConclusion = async (
    id: number,
    input: {
        concludedLicenseExpressionSPDX: string | undefined;
        detectedLicenseExpressionSPDX: string | null | undefined;
        comment: string | null | undefined;
        local: boolean | undefined;
        bulkCurationId: number | null | undefined;
    },
): Promise<LicenseConclusion> => {
    let retries = initialRetryCount;
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

            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!licenseConclusion)
        throw new Error("Error: Unable to update LicenseConclusion");

    return licenseConclusion;
};

export const updateManyLicenseConclusions = async (
    bulkCurationId: number,
    input: Prisma.LicenseConclusionUpdateInput,
): Promise<Prisma.BatchPayload> => {
    let retries = initialRetryCount;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.licenseConclusion.updateMany({
                where: {
                    bulkCurationId: bulkCurationId,
                },
                data: input,
            });
        } catch (error) {
            console.log(
                "Error with trying to update LicenseConclusions: " + error,
            );

            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!batchUpdate)
        throw new Error("Error: Unable to update LicenseConclusions");

    return batchUpdate;
};

export const updateBulkCuration = async (
    id: number,
    input: Prisma.BulkCurationUpdateInput,
): Promise<BulkCuration> => {
    let retries = initialRetryCount;
    let bulkCuration: BulkCuration | null = null;

    while (!bulkCuration && retries > 0) {
        try {
            bulkCuration = await prisma.bulkCuration.update({
                where: {
                    id: id,
                },
                data: input,
            });
        } catch (error) {
            console.log("Error with trying to update BulkCuration: " + error);

            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!bulkCuration) throw new Error("Error: Unable to update BulkCuration");

    return bulkCuration;
};

export const updateUser = async (
    id: number,
    input: Prisma.UserUpdateInput,
): Promise<User> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!user) throw new Error("Error: Unable to update User");

    return user;
};

// ------------------------------- Find -------------------------------

export const findFileByHash = async (hash: string): Promise<File | null> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return file;
};

export const findFileHashesByPackageId = async (
    packageId: number,
): Promise<string[]> => {
    let retries = initialRetryCount;
    let fileHashes: string[] = [];
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileHashes = await prisma.fileTree
                .findMany({
                    where: {
                        packageId: packageId,
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return fileHashes;
};

export const findFileHashesNotInOtherPackages = async (
    packageId: number,
    fileHashes: string[],
): Promise<string[]> => {
    let retries = initialRetryCount;
    let fileHashesInOtherPackages: string[] = [];
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileHashesInOtherPackages = await prisma.fileTree
                .findMany({
                    where: {
                        packageId: {
                            not: packageId,
                        },
                        fileSha256: {
                            in: fileHashes,
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
            console.log(
                "Error with trying to find File hashes not in other packages: " +
                    error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return fileHashes.filter((elem) => {
        return !fileHashesInOtherPackages.includes(elem);
    });
};

export const findFileTree = async (
    input: CreateFileTreeType,
): Promise<FileTree | null> => {
    let retries = initialRetryCount;
    let fileTree = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileTree = await prisma.fileTree.findFirst({
                where: {
                    fileSha256: input.fileSha256,
                    packageId: input.packageId,
                    path: input.path,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileTree: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return fileTree;
};

export const findFileTreeByHashAndPackageId = async (
    hash: string,
    packageId: number,
): Promise<FileTree | null> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
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
    let retries = initialRetryCount;
    let querySuccess = false;
    let filetrees: FileTreeWithRelations[] = [];

    while (!querySuccess && retries > 0) {
        try {
            filetrees = await prisma.fileTree.findMany({
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
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileTrees: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return filetrees;
};

export const findFileTreesByPackageId = async (
    packageId: number,
): Promise<FileTree[]> => {
    let retries = initialRetryCount;
    let fileTrees: FileTree[] = [];
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileTrees = await prisma.fileTree.findMany({
                where: {
                    packageId: packageId,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileTrees: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return fileTrees;
};

export const findFiletreeByPackageIdAndFileSha256 = async (
    packageId: number,
    fileSha256: string,
): Promise<FileTree | null> => {
    let retries = initialRetryCount;
    let querySuccess = false;
    let filetree: FileTree | null = null;

    while (!querySuccess && retries > 0) {
        try {
            filetree = await prisma.fileTree.findFirst({
                where: {
                    packageId: packageId,
                    fileSha256: fileSha256,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileTree: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return filetree;
};

export const findMatchingPath = async (input: {
    purl: string;
    path: string;
}): Promise<boolean> => {
    let retries = initialRetryCount;
    let querySuccess = false;
    let match = null;

    while (!querySuccess && retries > 0) {
        try {
            match = await prisma.fileTree.findFirst({
                where: {
                    package: {
                        purl: input.purl,
                    },
                    path: input.path,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log(
                "Error with trying to find matching path in filetree: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (match) return true;

    return false;
};

export const findFilePathsByPackagePurl = async (
    purl: string,
): Promise<string[]> => {
    let retries = initialRetryCount;
    let querySuccess = false;
    let filepaths: string[] = [];

    while (!querySuccess && retries > 0) {
        try {
            filepaths = await prisma.fileTree
                .findMany({
                    where: {
                        package: {
                            purl: purl,
                        },
                    },
                    select: {
                        path: true,
                    },
                })
                .then((filetrees: { path: string }[]) => {
                    return filetrees.map((filetree) => filetree.path);
                });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileTrees: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return filepaths;
};

export const findScannerJobByPackageId = async (
    packageId: number,
): Promise<ScannerJob | null> => {
    let retries = initialRetryCount;
    let scannerJob: ScannerJob | null = null;

    while (!scannerJob && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findFirst({
                where: {
                    packageId: packageId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find ScannerJob: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return scannerJob;
};

export const findScannerJobById = async (
    id: string,
): Promise<ScannerJob | null> => {
    let retries = initialRetryCount;
    let scannerJob: ScannerJob | null = null;

    while (!scannerJob && retries > 0) {
        try {
            scannerJob = await prisma.scannerJob.findUnique({
                where: {
                    id: id,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find ScannerJob: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return scannerJob;
};

export const findScannerJobStateById = async (
    id: string,
): Promise<{ id: string; state: string } | null> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return scannerJob;
};

export const findScannerJobIdStateByPackageId = async (
    packageId: number,
): Promise<{ id: string; state: string } | null> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return scannerJob;
};

export const findScannerJobsWithStates = async (
    states: string[],
): Promise<
    Map<
        string,
        {
            state: string;
            packageId: number;
            parentId: string | null;
        }
    >
> => {
    let retries = initialRetryCount;
    const scannerJobsMap = new Map<
        string,
        {
            state: string;
            packageId: number;
            parentId: string | null;
        }
    >();
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            const scannerJobs = await prisma.scannerJob.findMany({
                where: {
                    state: {
                        in: states,
                    },
                },
            });

            for (const scannerJob of scannerJobs) {
                scannerJobsMap.set(scannerJob.id, {
                    state: scannerJob.state,
                    packageId: scannerJob.packageId,
                    parentId: scannerJob.parentId,
                });
            }
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find ScannerJobs: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return scannerJobsMap;
};

export const findScannerJobsByParentId = async (
    parentId: string,
): Promise<ScannerJob[]> => {
    let retries = initialRetryCount;
    let scannerJobs: ScannerJob[] = [];

    while (retries > 0) {
        try {
            scannerJobs = await prisma.scannerJob.findMany({
                where: {
                    parentId: parentId,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find ScannerJobs: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return scannerJobs;
};

export const findPackageByPurl = async (
    purl: string,
): Promise<Package | null> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return packageObj;
};

export const findPackagesByPurls = async (
    purls: string[],
): Promise<Package[]> => {
    let retries = initialRetryCount;
    let packages: Package[] = [];

    while (retries > 0) {
        try {
            packages = await prisma.package.findMany({
                where: {
                    purl: {
                        in: purls,
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find Packages: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return packages;
};

export const findPackageIdByPurl = async (
    purl: string,
): Promise<number | null> => {
    let retries = initialRetryCount;
    let packageId: number | null = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            packageId = await prisma.package
                .findUnique({
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return packageId;
};

type PackageWithRelations = Prisma.PackageGetPayload<{
    select: {
        id: true;
        pathExclusions: {
            select: {
                pattern: true;
                reason: true;
                comment: true;
            };
        };
    };
}>;

export const findPackageWithPathExclusionsByPurl = async (
    purl: string,
): Promise<PackageWithRelations> => {
    let retries = initialRetryCount;
    let querySuccess = false;
    let packageObj: PackageWithRelations | null = null;

    while (!querySuccess && retries > 0) {
        try {
            packageObj = await prisma.package.findUnique({
                where: {
                    purl: purl,
                },
                select: {
                    id: true,
                    pathExclusions: {
                        select: {
                            pattern: true,
                            reason: true,
                            comment: true,
                        },
                    },
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find Package: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!packageObj) throw new Error("Error: Unable to find Package");

    return packageObj;
};

export const getPathExclusionsByPackagePurl = async (
    purl: string,
): Promise<
    {
        id: number;
        updatedAt: Date;
        pattern: string;
        reason: string;
        comment: string | null;
        user: {
            username: string;
        };
    }[]
> => {
    let retries = initialRetryCount;
    let querySuccess = false;
    let packageObj = null;

    while (!querySuccess && retries > 0) {
        try {
            packageObj = await prisma.package.findUnique({
                where: {
                    purl: purl,
                },
                select: {
                    pathExclusions: {
                        select: {
                            id: true,
                            updatedAt: true,
                            pattern: true,
                            reason: true,
                            comment: true,
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
            console.log("Error with trying to find Package: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!packageObj) throw new Error("Error: Unable to find Package");

    return packageObj.pathExclusions;
};

export const getPackageScanResults = async (packageId: number) => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return results;
};

// Find the id of the most recent scanner job with package id
export const findMostRecentScannerJobByPackageId = async (
    packageId: number,
): Promise<{ id: string } | null> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
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
        let retries = initialRetryCount;
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
                handleError(error);
                retries--;
                if (retries > 0) await waitToRetry();
                else throw error;
            }
        }
        return scanIssues;
    };

export const findUser = async (token: string): Promise<User | null> => {
    let user: User | null = null;
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return user;
};

export const findUserById = async (id: number): Promise<User | null> => {
    let user: User | null = null;
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return user;
};

export const findUserByUsername = async (
    username: string,
): Promise<User | null> => {
    let user: User | null = null;
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return user;
};

type findScannedPackagesOutput = Prisma.PackageGetPayload<{
    select: {
        purl: true;
        updatedAt: true;
        name: true;
        version: true;
        type: true;
        namespace: true;
        qualifiers: true;
        subpath: true;
    };
}>[];

export const findScannedPackages =
    async (): Promise<findScannedPackagesOutput> => {
        let scannedPackages: findScannedPackagesOutput = [];
        let retries = initialRetryCount;
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
                        name: true,
                        version: true,
                        type: true,
                        namespace: true,
                        qualifiers: true,
                        subpath: true,
                    },
                    orderBy: {
                        purl: "asc",
                    },
                });
                querySuccess = true;
            } catch (error) {
                console.log(
                    "Error with trying to find ScannedPackages: " + error,
                );
                handleError(error);
                retries--;
                if (retries > 0) await waitToRetry();
                else throw error;
            }
        }
        return scannedPackages;
    };

export const findFileSha256 = async (
    purl: string,
    path: string,
): Promise<string> => {
    let fileSha256: string | null = null;
    let retries = initialRetryCount;
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
                    if (!fileTree)
                        throw new Error("Error: Unable to find file sha256");

                    return fileTree.fileSha256;
                });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileSha256: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
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
                bulkCurationId: true;
            };
        };
    };
}>;

export const findFileData = async (
    sha256: string,
): Promise<FileWithRelations | null> => {
    let file: FileWithRelations | null = null;
    let retries = initialRetryCount;
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
                            bulkCurationId: true,
                        },
                    },
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find FileData: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return file;
};

export const findLicenseConclusionById = async (
    id: number,
): Promise<LicenseConclusion | null> => {
    let licenseConclusion: LicenseConclusion | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            licenseConclusion = await prisma.licenseConclusion.findUnique({
                where: {
                    id: id,
                },
            });
            break;
        } catch (error) {
            console.log(
                "Error with trying to find LicenseConclusion: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return licenseConclusion;
};

export const findLicenseConclusionUserId = async (
    id: number,
): Promise<number | null> => {
    let licenseConclusion: { userId: number } | null = null;
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return licenseConclusion ? licenseConclusion.userId : null;
};

type LicenseConclusionWithRelations = Prisma.LicenseConclusionGetPayload<{
    select: {
        id: true;
        updatedAt: true;
        concludedLicenseExpressionSPDX: true;
        detectedLicenseExpressionSPDX: true;
        comment: true;
        local: true;
        contextPurl: true;
        user: {
            select: {
                username: true;
            };
        };
        bulkCurationId: true;
        file: {
            select: {
                sha256: true;
                filetrees: {
                    select: {
                        path: true;
                        package: {
                            select: {
                                id: true;
                                purl: true;
                            };
                        };
                    };
                };
            };
        };
    };
}>;

export const findAllLicenseConclusions = async (): Promise<
    LicenseConclusionWithRelations[]
> => {
    let licenseConclusions: LicenseConclusionWithRelations[] = [];
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            licenseConclusions = await prisma.licenseConclusion.findMany({
                select: {
                    id: true,
                    updatedAt: true,
                    concludedLicenseExpressionSPDX: true,
                    detectedLicenseExpressionSPDX: true,
                    comment: true,
                    local: true,
                    contextPurl: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    bulkCurationId: true,
                    file: {
                        select: {
                            sha256: true,
                            filetrees: {
                                select: {
                                    path: true,
                                    package: {
                                        select: {
                                            id: true,
                                            purl: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            break;
        } catch (error) {
            console.log(
                "Error with trying to find LicenseConclusions: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return licenseConclusions;
};

type BulkCurationWithPackageRelation = Prisma.BulkCurationGetPayload<{
    select: {
        id: true;
        pattern: true;
        comment: true;
        concludedLicenseExpressionSPDX: true;
        detectedLicenseExpressionSPDX: true;
        local: true;
        package: {
            select: {
                id: true;
                purl: true;
            };
        };
        userId: true;
    };
}>;

export const findBulkCurationById = async (
    id: number,
): Promise<BulkCurationWithPackageRelation | null> => {
    let bulkCuration: BulkCurationWithPackageRelation | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            bulkCuration = await prisma.bulkCuration.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    pattern: true,
                    comment: true,
                    concludedLicenseExpressionSPDX: true,
                    detectedLicenseExpressionSPDX: true,
                    local: true,
                    package: {
                        select: {
                            id: true,
                            purl: true,
                        },
                    },
                    userId: true,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkCuration: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkCuration;
};

type BulkCurationWithRelations = Prisma.BulkCurationGetPayload<{
    select: {
        id: true;
        updatedAt: true;
        pattern: true;
        comment: true;
        concludedLicenseExpressionSPDX: true;
        detectedLicenseExpressionSPDX: true;
        local: true;
        package: {
            select: {
                id: true;
                purl: true;
            };
        };
        licenseConclusions: {
            select: {
                id: true;
                file: {
                    select: {
                        sha256: true;
                        filetrees: {
                            select: {
                                path: true;
                                package: {
                                    select: {
                                        purl: true;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        user: {
            select: {
                username: true;
            };
        };
    };
}>;

export const findBulkCurationWithRelationsById = async (
    bulkCurationId: number,
    packageId: number,
): Promise<BulkCurationWithRelations | null> => {
    let bulkCuration: BulkCurationWithRelations | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            bulkCuration = await prisma.bulkCuration.findUnique({
                where: {
                    id: bulkCurationId,
                },
                select: {
                    id: true,
                    updatedAt: true,
                    pattern: true,
                    comment: true,
                    concludedLicenseExpressionSPDX: true,
                    detectedLicenseExpressionSPDX: true,
                    local: true,
                    package: {
                        select: {
                            id: true,
                            purl: true,
                        },
                    },
                    licenseConclusions: {
                        select: {
                            id: true,
                            file: {
                                select: {
                                    sha256: true,
                                    filetrees: {
                                        where: {
                                            packageId: packageId,
                                        },
                                        select: {
                                            path: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkCuration: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkCuration;
};

export const findBulkCurationsByPackageId = async (
    packageId: number,
): Promise<BulkCurationWithRelations[]> => {
    let retries = initialRetryCount;
    let bulkCurations: BulkCurationWithRelations[] = [];

    while (retries > 0) {
        try {
            bulkCurations = await prisma.bulkCuration.findMany({
                where: {
                    packageId: packageId,
                },
                select: {
                    id: true,
                    updatedAt: true,
                    pattern: true,
                    comment: true,
                    concludedLicenseExpressionSPDX: true,
                    detectedLicenseExpressionSPDX: true,
                    local: true,
                    package: {
                        select: {
                            id: true,
                            purl: true,
                        },
                    },
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    licenseConclusions: {
                        select: {
                            id: true,
                            file: {
                                select: {
                                    sha256: true,
                                    filetrees: {
                                        where: {
                                            packageId: packageId,
                                        },
                                        select: {
                                            path: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkCurations: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkCurations;
};

export const findBulkCurationsWithRelations = async (): Promise<
    BulkCurationWithRelations[]
> => {
    let retries = initialRetryCount;
    let bulkCurations: BulkCurationWithRelations[] = [];

    while (retries > 0) {
        try {
            bulkCurations = await prisma.bulkCuration.findMany({
                select: {
                    id: true,
                    updatedAt: true,
                    pattern: true,
                    concludedLicenseExpressionSPDX: true,
                    detectedLicenseExpressionSPDX: true,
                    comment: true,
                    local: true,
                    package: {
                        select: {
                            id: true,
                            purl: true,
                        },
                    },
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    licenseConclusions: {
                        select: {
                            id: true,
                            file: {
                                select: {
                                    sha256: true,
                                    filetrees: {
                                        select: {
                                            path: true,
                                            package: {
                                                select: {
                                                    purl: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkCurations: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkCurations;
};

export const findBulkCurationUserId = async (
    id: number,
): Promise<number | null> => {
    let bulkCuration: { userId: number } | null = null;
    let retries = initialRetryCount;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            bulkCuration = await prisma.bulkCuration.findUnique({
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
                "Error with trying to find BulkCurationUserId: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return bulkCuration?.userId || null;
};

export const findPathExclusionUserId = async (
    id: number,
): Promise<number | null> => {
    let pathExclusion: { userId: number } | null = null;
    let retries = initialRetryCount;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            pathExclusion = await prisma.pathExclusion.findUnique({
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
                "Error with trying to find PathExclusion userId: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return pathExclusion ? pathExclusion.userId : null;
};

type PathExclusionWithRelations = Prisma.PathExclusionGetPayload<{
    select: {
        id: true;
        updatedAt: true;
        pattern: true;
        reason: true;
        comment: true;
        user: {
            select: {
                username: true;
            };
        };
        package: {
            select: {
                id: true;
                purl: true;
                fileTrees: {
                    select: {
                        path: true;
                    };
                };
            };
        };
    };
}>;

export const findPathExclusions = async (): Promise<
    PathExclusionWithRelations[]
> => {
    let retries = initialRetryCount;
    let pathExclusions: PathExclusionWithRelations[] = [];

    while (retries > 0) {
        try {
            pathExclusions = await prisma.pathExclusion.findMany({
                select: {
                    id: true,
                    updatedAt: true,
                    pattern: true,
                    reason: true,
                    comment: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    package: {
                        select: {
                            id: true,
                            purl: true,
                            fileTrees: {
                                select: {
                                    path: true,
                                },
                            },
                        },
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find PathExclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return pathExclusions;
};

export const findLicenseConclusionsByPackageId = async (
    id: number,
): Promise<
    {
        path: string;
        detectedLicenseExpressionSPDX: string | null;
        concludedLicenseExpressionSPDX: string;
        comment: string | null;
    }[]
> => {
    let retries = initialRetryCount;
    let querySuccess = false;
    let filetrees = null;

    while (!querySuccess && retries > 0) {
        try {
            filetrees = await prisma.fileTree.findMany({
                where: {
                    package: {
                        id: id,
                    },
                },
                select: {
                    path: true,
                    file: {
                        select: {
                            licenseConclusions: {
                                select: {
                                    detectedLicenseExpressionSPDX: true,
                                    concludedLicenseExpressionSPDX: true,
                                    comment: true,
                                },
                            },
                        },
                    },
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log(
                "Error with trying to find LicenseConclusions: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!filetrees) throw new Error("Error: Unable to find LicenseConclusions");

    const licenseConclusions = [];

    for (const filetree of filetrees) {
        for (const licenseConclusion of filetree.file.licenseConclusions) {
            licenseConclusions.push({
                path: filetree.path,
                detectedLicenseExpressionSPDX:
                    licenseConclusion.detectedLicenseExpressionSPDX,
                concludedLicenseExpressionSPDX:
                    licenseConclusion.concludedLicenseExpressionSPDX,
                comment: licenseConclusion.comment,
            });
        }
    }

    return licenseConclusions;
};

type LicenseConclusionWithUserRelation = Prisma.LicenseConclusionGetPayload<{
    select: {
        id: true;
        updatedAt: true;
        detectedLicenseExpressionSPDX: true;
        concludedLicenseExpressionSPDX: true;
        comment: true;
        local: true;
        contextPurl: true;
        user: {
            select: {
                username: true;
            };
        };
        bulkCurationId: true;
    };
}>;

export const findLicenseConclusionsByFileSha256 = async (
    sha256: string,
): Promise<LicenseConclusionWithUserRelation[]> => {
    let licenseConclusions: LicenseConclusionWithUserRelation[] = [];
    let retries = initialRetryCount;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            licenseConclusions = await prisma.licenseConclusion.findMany({
                where: {
                    fileSha256: sha256,
                },
                select: {
                    id: true,
                    updatedAt: true,
                    detectedLicenseExpressionSPDX: true,
                    concludedLicenseExpressionSPDX: true,
                    comment: true,
                    local: true,
                    contextPurl: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    bulkCurationId: true,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log(
                "Error with trying to find LicenseConclusions: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return licenseConclusions;
};

// ------------------------------ Delete ------------------------------

// Delete all license findings related to files
export const deleteLicenseFindingsByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!batchDelete)
        throw new Error("Error: Unable to delete LicenseFindings");

    return batchDelete;
};

// Delete all copyright findings related to files
export const deleteCopyrightFindingsByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!batchDelete)
        throw new Error("Error: Unable to delete CopyrightFindings");

    return batchDelete;
};

// Delete all scan issues related to files
export const deleteScanIssuesByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!batchDelete) throw new Error("Error: Unable to delete ScanIssues");

    return batchDelete;
};

export const deleteLicenseConclusion = async (
    id: number,
): Promise<LicenseConclusion | null> => {
    let retries = initialRetryCount;
    let licenseConclusion: LicenseConclusion | null = null;

    while (!licenseConclusion && retries > 0) {
        try {
            licenseConclusion = await prisma.licenseConclusion.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            console.log(
                "Error with trying to delete LicenseConclusion: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return licenseConclusion;
};

export const deleteLicenseConclusionsByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.licenseConclusion.deleteMany({
                where: {
                    fileSha256: {
                        in: fileHashes,
                    },
                },
            });
        } catch (error) {
            console.log(
                "Error with trying to delete LicenseConclusions: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchDelete)
        throw new Error("Error: Unable to delete LicenseConclusions");

    return batchDelete;
};

export const deleteManyLicenseConclusionsByBulkCurationId = async (
    bulkCurationId: number,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.licenseConclusion.deleteMany({
                where: {
                    bulkCurationId: bulkCurationId,
                },
            });
        } catch (error) {
            console.log(
                "Error with trying to delete LicenseConclusions: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchDelete)
        throw new Error("Error: Unable to delete LicenseConclusions");

    return batchDelete;
};

export const deleteBulkCuration = async (
    id: number,
): Promise<BulkCuration | null> => {
    let retries = initialRetryCount;
    let bulkCuration: BulkCuration | null = null;

    while (!bulkCuration && retries > 0) {
        try {
            bulkCuration = await prisma.bulkCuration.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete BulkCuration: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkCuration;
};

export const deleteFilesByFileHashes = async (
    fileHashes: string[],
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.file.deleteMany({
                where: {
                    sha256: {
                        in: fileHashes,
                    },
                },
            });
        } catch (error) {
            console.log("Error with trying to delete Files: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchDelete) throw new Error("Error: Unable to delete Files");

    return batchDelete;
};

export const deleteUser = async (id: number): Promise<User | null> => {
    let retries = initialRetryCount;
    let user: User | null = null;

    while (!user && retries > 0) {
        try {
            user = await prisma.user.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete User: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return user;
};

export const deletePackage = async (id: number): Promise<Package | null> => {
    let retries = initialRetryCount;
    let pkg: Package | null = null;

    while (!pkg && retries > 0) {
        try {
            pkg = await prisma.package.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete Package: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return pkg;
};

export const deletePathExclusion = async (
    id: number,
): Promise<PathExclusion> => {
    let retries = initialRetryCount;
    let pathExclusion: PathExclusion | null = null;

    while (!pathExclusion && retries > 0) {
        try {
            pathExclusion = await prisma.pathExclusion.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete Package: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!pathExclusion)
        throw new Error("Error: Unable to delete PathExclusion");

    return pathExclusion;
};

export const deletePathExclusionsByPackageId = async (
    packageId: number,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.pathExclusion.deleteMany({
                where: {
                    packageId: packageId,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete PathExclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!batchDelete) throw new Error("Error: Unable to delete PathExclusions");

    return batchDelete;
};

export const deleteScannerJobsByPackageId = async (
    packageId: number,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.scannerJob.deleteMany({
                where: {
                    packageId: packageId,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete ScannerJobs: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchDelete) throw new Error("Error: Unable to delete ScannerJobs");

    return batchDelete;
};

export const deleteFileTreesByPackageId = async (
    packageId: number,
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchDelete = null;

    while (!batchDelete && retries > 0) {
        try {
            batchDelete = await prisma.fileTree.deleteMany({
                where: {
                    packageId: packageId,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete FileTrees: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchDelete) throw new Error("Error: Unable to delete FileTrees");

    return batchDelete;
};

// ------------------------------ Count --------------------------------

export const countFileTreesByPackageId = async (
    packageId: number,
): Promise<number> => {
    let retries = initialRetryCount;
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
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (count != 0 && !count)
        throw new Error("Error: Unable to count FileTrees");

    return count;
};

export const bulkCurationAffectedRecords = async (
    bulkCurationId: number,
    packageId: number,
    local: boolean,
): Promise<{
    affectedPackageFileTreesCount: number;
    affectedTotalFileTreesCount: number;
}> => {
    let retries = initialRetryCount;
    let affectedPackageFileTreesCount = 0;
    let affectedTotalFileTreesCount = 0;

    while (retries > 0) {
        try {
            affectedPackageFileTreesCount = await prisma.fileTree.count({
                where: {
                    file: {
                        licenseConclusions: {
                            some: {
                                bulkCurationId: bulkCurationId,
                            },
                        },
                    },
                    packageId: packageId,
                },
            });
            break;
        } catch (error) {
            console.log(
                "Error with trying to count affected FileTrees: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    retries = initialRetryCount;

    if (!local) {
        while (retries > 0) {
            try {
                affectedTotalFileTreesCount = await prisma.fileTree.count({
                    where: {
                        file: {
                            licenseConclusions: {
                                some: {
                                    bulkCurationId: bulkCurationId,
                                },
                            },
                        },
                    },
                });
                break;
            } catch (error) {
                console.log(
                    "Error with trying to count affected FileTrees: " + error,
                );
                handleError(error);
                retries--;
                if (retries > 0) await waitToRetry();
                else throw error;
            }
        }
    }

    return {
        affectedPackageFileTreesCount: affectedPackageFileTreesCount,
        affectedTotalFileTreesCount: affectedTotalFileTreesCount,
    };
};
