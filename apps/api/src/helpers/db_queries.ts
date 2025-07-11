// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'ScannerJob'
import {
    BulkConclusion,
    CopyrightFinding,
    File,
    FileTree,
    LicenseConclusion,
    LicenseFinding,
    LicenseFindingMatch,
    Package,
    PathExclusion,
    Prisma,
    prisma,
    ScanIssue,
    ScannerJob,
    SystemIssue,
} from "database";
import { omit } from "lodash";

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
            case "P2035":
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
    unprocessedLicenseExpressionSPDX: string;
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
    userId: string;
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

export const createBulkConclusion = async (input: {
    pattern: string;
    concludedLicenseExpressionSPDX: string;
    detectedLicenseExpressionSPDX: string | null;
    comment: string | null;
    local: boolean | undefined;
    packageId: number;
    userId: string;
}): Promise<BulkConclusion> => {
    let retries = initialRetryCount;
    let bulkConclusion: BulkConclusion | null = null;

    while (!bulkConclusion && retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.create({
                data: input,
            });
        } catch (error) {
            console.log("Error creating BulkConclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!bulkConclusion)
        throw new Error("Error: Unable to create BulkConclusion");

    return bulkConclusion;
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
    timeoutIssue?: boolean;
    timeout?: number;
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

export const createPathExclusion = async (input: {
    pattern: string;
    reason: string;
    comment: string | null;
    packageId: number;
    userId: string;
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
    let retries = initialRetryCount;
    let file: File | null = null;

    while (retries > 0) {
        try {
            file = await prisma.file.upsert({
                where: {
                    sha256: input.sha256,
                },
                update: {},
                create: input,
            });
            break;
        } catch (error) {
            console.log("Error with trying to create File: " + error);
            /* In this case, if the error has code "P2002" (unique constraint violation),
             * the query should be retried (the handleError function would throw the error
             * otherwise).
             */
            if (
                !(
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                )
            ) {
                handleError(error);
            }

            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!file) throw new Error("Error: Unable to create File");
    return file;
};

// Create file tree if it doesn't exist, otherwise return existing file tree
export const createFileTreeIfNotExists = async (
    input: CreateFileTreeType,
): Promise<FileTree> => {
    let retries = initialRetryCount;
    let fileTree: FileTree | null = null;

    while (retries > 0) {
        try {
            fileTree = await findFileTree(input);

            if (!fileTree) {
                fileTree = await createFileTree(input);
            }
            break;
        } catch (error) {
            console.log("Error with trying to create File: " + error);
            /* In this case, if the error has code "P2002" (unique constraint violation),
             * the queries should be retried (the handleError function would throw the error
             * otherwise).
             */
            if (
                !(
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                )
            ) {
                handleError(error);
            }

            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!fileTree) throw new Error("Error: Unable to create FileTree");

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

export const updateManyScannerJobChildren = async (
    id: string,
    data: Prisma.ScannerJobUpdateInput & { parentId?: string | null },
): Promise<{ count: number }> => {
    let retries = initialRetryCount;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.scannerJob.updateMany({
                where: {
                    parentId: id,
                },
                data: data,
            });
        } catch (error) {
            console.log(
                "Error with trying to update ScannerJob children: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    if (!batchUpdate)
        throw new Error("Error: Unable to update ScannerJob children");

    return batchUpdate;
};

export const updateManyScannerJobStates = async (
    ids: string[],
    state: string,
    failureState?: string,
    failureMessage?: string,
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
                    failureMessage: failureMessage,
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

export const updatePathExclusion = async (
    id: number,
    input: Prisma.PathExclusionUpdateInput,
): Promise<PathExclusion | null> => {
    let retries = initialRetryCount;
    let pathExclusion: PathExclusion | null = null;

    while (!pathExclusion && retries > 0) {
        try {
            pathExclusion = await prisma.pathExclusion.update({
                where: {
                    id: id,
                },
                data: input,
            });
        } catch (error) {
            console.log("Error with trying to update PathExclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return pathExclusion;
};

export const updatePathExclusionPackageId = async (
    id: number,
    packageId: number,
): Promise<PathExclusion | null> => {
    let retries = initialRetryCount;
    let pathExclusion: PathExclusion | null = null;

    while (!pathExclusion && retries > 0) {
        try {
            pathExclusion = await prisma.pathExclusion.update({
                where: {
                    id: id,
                },
                data: {
                    packageId: packageId,
                },
            });
        } catch (error) {
            console.log("Error with trying to update PathExclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return pathExclusion;
};

export const updateLicenseConclusion = async (
    id: number,
    input: {
        concludedLicenseExpressionSPDX: string | undefined;
        detectedLicenseExpressionSPDX: string | null | undefined;
        comment: string | null | undefined;
        local: boolean | undefined;
        contextPurl: string | undefined;
        bulkConclusionId: number | null | undefined;
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
    bulkConclusionId: number,
    input: Prisma.LicenseConclusionUpdateInput,
): Promise<Prisma.BatchPayload> => {
    let retries = initialRetryCount;
    let batchUpdate = null;

    while (!batchUpdate && retries > 0) {
        try {
            batchUpdate = await prisma.licenseConclusion.updateMany({
                where: {
                    bulkConclusionId: bulkConclusionId,
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

export const updateBulkConclusion = async (
    id: number,
    input: Prisma.BulkConclusionUpdateInput,
): Promise<BulkConclusion> => {
    let retries = initialRetryCount;
    let bulkConclusion: BulkConclusion | null = null;

    while (!bulkConclusion && retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.update({
                where: {
                    id: id,
                },
                data: input,
            });
        } catch (error) {
            console.log("Error with trying to update BulkConclusion: " + error);

            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!bulkConclusion)
        throw new Error("Error: Unable to update BulkConclusion");

    return bulkConclusion;
};

export const updateBulkConclusionPackageId = async (
    id: number,
    packageId: number,
): Promise<BulkConclusion> => {
    let retries = initialRetryCount;
    let bulkConclusion: BulkConclusion | null = null;

    while (!bulkConclusion && retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.update({
                where: {
                    id: id,
                },
                data: {
                    packageId: packageId,
                },
            });
        } catch (error) {
            console.log("Error with trying to update BulkConclusion: " + error);

            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!bulkConclusion)
        throw new Error("Error: Unable to update BulkConclusion");

    return bulkConclusion;
};

export const updateSystemIssue = async (
    id: number,
    updateData: Prisma.SystemIssueUpdateInput,
): Promise<SystemIssue> => {
    let retries = initialRetryCount;
    let systemIssue: SystemIssue | null = null;

    while (retries > 0) {
        try {
            systemIssue = await prisma.systemIssue.update({
                where: {
                    id: id,
                },
                data: updateData,
            });
            break;
        } catch (error) {
            console.log("Error with trying to update SystemIssue: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    if (!systemIssue) throw new Error("Error: Unable to update SystemIssue");

    return systemIssue;
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

export const findFileSha256AndScannerByPurlAndPath = async (
    purl: string,
    path: string,
): Promise<{ sha256: string; scanner: string } | null> => {
    let retries = initialRetryCount;
    let file: { sha256: string; scanner: string } | null = null;

    while (retries > 0) {
        try {
            file =
                (
                    await prisma.fileTree.findFirst({
                        where: {
                            package: {
                                purl: purl,
                            },
                            path: path,
                        },
                        select: {
                            file: {
                                select: {
                                    sha256: true,
                                    scanner: true,
                                },
                            },
                        },
                    })
                )?.file || null;
            break;
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

export const findFileTreeDataByPackageId = async (
    packageId: number,
): Promise<
    {
        path: string;
        fileSha256: string;
        packageId: number;
    }[]
> => {
    let retries = initialRetryCount;
    let fileTreeData: {
        path: string;
        fileSha256: string;
        packageId: number;
    }[] = [];

    while (retries > 0) {
        try {
            fileTreeData = await prisma.fileTree.findMany({
                where: {
                    packageId: packageId,
                },
                select: {
                    path: true,
                    fileSha256: true,
                    packageId: true,
                },
                orderBy: {
                    path: "asc",
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find FileTree data: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return fileTreeData;
};

export const findFileTreesByPackageId = async (
    packageId: number,
    pathContainsString?: string,
): Promise<FileTree[]> => {
    let retries = initialRetryCount;
    let fileTrees: FileTree[] = [];
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            fileTrees = await prisma.fileTree.findMany({
                where: {
                    packageId: packageId,
                    path: {
                        contains: pathContainsString,
                    },
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

export type FileTreeWithPackage = {
    path: string;
    package: {
        id: number;
        purl: string;
    };
};

export const findFileTreesByBulkConclusionId = async (
    bulkConclusionId: number,
    packageId?: number,
    notPackageId?: number,
): Promise<FileTreeWithPackage[]> => {
    let retries = initialRetryCount;
    let fileTrees: FileTreeWithPackage[] = [];

    while (retries > 0) {
        try {
            fileTrees = await prisma.fileTree.findMany({
                where: {
                    file: {
                        licenseConclusions: {
                            some: {
                                bulkConclusionId: bulkConclusionId,
                            },
                        },
                    },
                    packageId: {
                        equals: packageId,
                        not: notPackageId,
                    },
                },
                select: {
                    path: true,
                    package: {
                        select: {
                            id: true,
                            purl: true,
                        },
                    },
                },
            });
            break;
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

export const findFileTreeByPkgIdAndPath = async (
    packageId: number,
    path: string,
): Promise<FileTree | null> => {
    let retries = initialRetryCount;
    let fileTree: FileTree | null = null;

    while (retries > 0) {
        try {
            fileTree = await prisma.fileTree.findFirst({
                where: {
                    packageId: packageId,
                    path: path,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find FileTrees: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return fileTree;
};

export const findFileTreesByPkgIdAndFileSha256 = async (
    fileSha256: string,
    packageId?: number,
    notPackageId?: number,
): Promise<{ path: string; package: { purl: string } }[]> => {
    let retries = initialRetryCount;
    let fileTrees: { path: string; package: { purl: string } }[] = [];

    while (retries > 0) {
        try {
            fileTrees = await prisma.fileTree.findMany({
                select: {
                    path: true,
                    package: {
                        select: {
                            purl: true,
                        },
                    },
                },
                where: {
                    packageId: {
                        equals: packageId,
                        not: notPackageId,
                    },
                    fileSha256: fileSha256,
                },
            });
            break;
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

export const findFileTreesByPackageIdAndPathRegex = async (
    packageId: number,
    regex: string,
): Promise<FileTree[]> => {
    let retries = initialRetryCount;
    let fileTrees: FileTree[] = [];

    while (retries > 0) {
        try {
            fileTrees = await prisma.$queryRaw<FileTree[]>`
                SELECT * FROM "FileTree"
                WHERE "packageId" = ${packageId}
                AND "path" ~ ${regex};
            `;
            break;
        } catch (error) {
            console.log(
                "Error with trying to find FileTrees by regex: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return fileTrees;
};

export const findIfFtByPkgIdAndPathRegexExists = async (
    packageId: number,
    regex: string,
): Promise<boolean> => {
    let retries = initialRetryCount;
    let exists: boolean = false;

    while (retries > 0) {
        try {
            const queryResult = await prisma.$queryRaw<{ exists: boolean }[]>`
                SELECT EXISTS (
                    SELECT 1
                    FROM "FileTree"
                    WHERE "packageId" = ${packageId}
                    AND "path" ~ ${regex}
                );
            `;
            exists = queryResult[0].exists;
            break;
        } catch (error) {
            console.log(
                "Error with trying to find FileTrees by regex: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return exists;
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

export const findScannerJobsByPackageId = async (
    packageId: number,
): Promise<ScannerJob[]> => {
    let retries = initialRetryCount;
    let scannerJobs: ScannerJob[] = [];

    while (retries > 0) {
        try {
            scannerJobs = await prisma.scannerJob.findMany({
                where: {
                    packageId: packageId,
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

export const findScannerJobsByState = async (
    state: string,
): Promise<
    {
        id: string;
        package: {
            id: number;
            purl: string;
        };
    }[]
> => {
    let retries = initialRetryCount;
    let scannerJobs: {
        id: string;
        package: {
            id: number;
            purl: string;
        };
    }[] = [];

    while (retries > 0) {
        try {
            scannerJobs = await prisma.scannerJob.findMany({
                where: {
                    state: state,
                },
                select: {
                    id: true,
                    package: {
                        select: {
                            id: true,
                            purl: true,
                        },
                    },
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
): Promise<{
    id: string;
    state: string;
    failureMessage: string | null;
} | null> => {
    let retries = initialRetryCount;
    let scannerJob: {
        id: string;
        state: string;
        failureMessage: string | null;
    } | null = null;
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
                    failureMessage: true,
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

export const findPackageById = async (id: number): Promise<Package | null> => {
    let retries = initialRetryCount;
    let packageObj: Package | null = null;

    while (!packageObj && retries > 0) {
        try {
            packageObj = await prisma.package.findUnique({
                where: {
                    id: id,
                },
            });
            break;
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
        userId: string;
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
                            userId: true,
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

export const getPathExclusionPatternsByPackagePurl = async (
    purl: string,
): Promise<string[]> => {
    let retries = initialRetryCount;
    let patterns: string[] = [];

    while (retries > 0) {
        try {
            patterns = await prisma.pathExclusion
                .findMany({
                    where: {
                        package: {
                            purl: purl,
                        },
                    },
                    select: {
                        pattern: true,
                    },
                })
                .then((pathExclusions: { pattern: string }[]) => {
                    return pathExclusions.map((pathExclusion) => {
                        return pathExclusion.pattern;
                    });
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

    return patterns;
};

export const getPackageScanResults = async (purl: string) => {
    let retries = initialRetryCount;
    let results = null;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            results = await prisma.fileTree.findMany({
                where: {
                    package: {
                        purl: purl,
                    },
                },
                select: {
                    path: true,
                    file: {
                        select: {
                            licenseFindings: {
                                select: {
                                    licenseExpressionSPDX: true,
                                    licenseFindingMatches: {
                                        select: {
                                            startLine: true,
                                            endLine: true,
                                            score: true,
                                        },
                                    },
                                },
                            },
                            copyrightFindings: {
                                select: {
                                    copyright: true,
                                    startLine: true,
                                    endLine: true,
                                },
                            },
                            scanIssues: {
                                select: {
                                    createdAt: true,
                                    scannerConfig: true,
                                    message: true,
                                    severity: true,
                                    timeoutIssue: true,
                                    timeout: true,
                                },
                            },
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

export const findTimeoutScanIssuesByPackageIdAndTimeout = async (
    packageId: number,
    timeout: number,
): Promise<ScanIssue[]> => {
    let retries = initialRetryCount;
    let scanIssues: ScanIssue[] = [];

    while (retries > 0) {
        try {
            scanIssues = await prisma.scanIssue.findMany({
                where: {
                    timeoutIssue: true,
                    timeout: {
                        lt: timeout,
                    },
                    file: {
                        filetrees: {
                            some: {
                                packageId: packageId,
                            },
                        },
                    },
                },
            });
            break;
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

export const findAllScannedPackages = async (
    pkgNameStartsWith?: string,
): Promise<Package[]> => {
    let packages: Package[] = [];
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            packages = await prisma.package.findMany({
                where: {
                    scanStatus: "scanned",
                    name: {
                        startsWith: pkgNameStartsWith,
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

export const findScannedPackages = async (
    skip: number | undefined,
    take: number | undefined,
    orderProperty:
        | "purl"
        | "name"
        | "version"
        | "type"
        | "namespace"
        | "createdAt"
        | "updatedAt",
    orderPropertyValue: "asc" | "desc" | undefined,
    name: string | undefined,
    version: string | undefined,
    type: string | undefined,
    namespace: string | undefined,
    purl: string | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<Package[]> => {
    let scannedPackages: Package[] = [];
    let retries = initialRetryCount;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            scannedPackages = await prisma.package.findMany({
                skip: skip,
                take: take,
                where: {
                    scanStatus: "scanned",
                    name: {
                        contains: name,
                    },
                    version: {
                        contains: version,
                    },
                    type: {
                        contains: type,
                    },
                    namespace: {
                        contains: namespace,
                    },
                    purl: {
                        contains: purl,
                    },
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                },
                orderBy: {
                    [orderProperty]: orderPropertyValue,
                },
            });
            querySuccess = true;
        } catch (error) {
            console.log("Error with trying to find ScannedPackages: " + error);
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

export type FileWithRelations = {
    licenseFindings: {
        id: number;
        updatedAt: Date;
        licenseExpressionSPDX: string;
        licenseFindingMatches: {
            id: number;
            updatedAt: Date;
            licenseExpression: string;
            startLine: number;
            endLine: number;
            score: number;
        }[];
    }[];
    copyrightFindings: {
        id: number;
        updatedAt: Date;
        copyright: string;
        startLine: number;
        endLine: number;
    }[];
};

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

type LicenseFindingWithRelations = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    scanner: string;
    scannerConfig: string;
    licenseExpressionSPDX: string;
    licenseFindingMatches: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        startLine: number;
        endLine: number;
        score: number;
        licenseExpression: string;
    }[];
};

export const findLicenseFindingsByFileSha256 = async (
    sha256: string,
): Promise<LicenseFindingWithRelations[]> => {
    let licenseFindings: LicenseFindingWithRelations[] = [];
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            licenseFindings = await prisma.licenseFinding.findMany({
                where: {
                    fileSha256: sha256,
                },
                include: {
                    licenseFindingMatches: true,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find LicenseFindings: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return licenseFindings;
};

export const findLicenseFindingsByPackageId = async (
    packageId: number,
): Promise<
    {
        licenseExpressionSPDX: string;
        fileSha256: string;
    }[]
> => {
    let licenseFindings: {
        licenseExpressionSPDX: string;
        fileSha256: string;
    }[] = [];
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            licenseFindings = await prisma.licenseFinding.findMany({
                select: {
                    licenseExpressionSPDX: true,
                    fileSha256: true,
                },
                where: {
                    file: {
                        filetrees: {
                            some: {
                                packageId: packageId,
                            },
                        },
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find LicenseFindings: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return licenseFindings;
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
): Promise<string | null> => {
    let licenseConclusion: { userId: string } | null = null;
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

export const findLicenseConclusions = async (
    skip: number | undefined,
    take: number | undefined,
    orderProperty:
        | "contextPurl"
        | "detectedLicenseExpressionSPDX"
        | "concludedLicenseExpressionSPDX"
        | "comment"
        | "local"
        | "createdAt"
        | "updatedAt"
        | undefined,
    orderPropertyValue: "asc" | "desc" | undefined,
    purl: string | undefined,
    contextPurl: string | undefined,
    contextPurlStrict: boolean,
    userIds: string[] | undefined,
    detectedLicense: string | undefined,
    concludedLicense: string | undefined,
    comment: string | undefined,
    local: boolean | undefined,
    bulkConclusionId: number | undefined,
    hasBulkConclusionId: boolean | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<LicenseConclusion[]> => {
    let licenseConclusions: LicenseConclusion[] = [];
    let retries = initialRetryCount;

    /*
     * The initial idea of these queries was to fetch the license conclusions that are
     * not part of a bulk conclusion (and their count) by setting the bulkConclusionId to
     * null, but for some reason a parameter with null value is completely dropped from the
     * query when using Zodios react hooks with Tanstack query client on the front end, and
     * in the lack of a better solution, a workaround with the parameter hasBulkConclusion
     * is used here.
     */

    while (retries > 0) {
        try {
            licenseConclusions = await prisma.licenseConclusion.findMany({
                skip: skip,
                take: take,
                where: {
                    OR: purl
                        ? [
                              /*
                               * Find license conclusions made in the context of the specified package
                               */
                              {
                                  file: {
                                      filetrees: {
                                          some: {
                                              package: {
                                                  purl: purl,
                                              },
                                          },
                                      },
                                  },
                                  contextPurl: purl,
                              },
                              /*
                               * Find license conclusions made in the context of a package different from
                               * the specified one. Here the local value has to be false, as otherwise the
                               * license conclusion shouldn't be applied in the files of the specified
                               * package.
                               */
                              {
                                  file: {
                                      filetrees: {
                                          some: {
                                              package: {
                                                  purl: purl,
                                              },
                                          },
                                      },
                                  },
                                  contextPurl: {
                                      not: purl,
                                  },
                                  local: false,
                              },
                          ]
                        : undefined,
                    contextPurl: {
                        /*
                         * If the purl is specified, and the local value is set to true,
                         * the contextPurl cannot be used, as it has to be the same as the
                         * purl. This is also mentioned in the API documentation.
                         */
                        equals:
                            purl && local === true
                                ? undefined
                                : contextPurlStrict
                                  ? contextPurl
                                  : undefined,
                        contains:
                            purl && local === true
                                ? undefined
                                : !contextPurlStrict
                                  ? contextPurl
                                  : undefined,
                    },
                    userId: {
                        in: userIds,
                    },
                    detectedLicenseExpressionSPDX: {
                        contains: detectedLicense,
                    },
                    concludedLicenseExpressionSPDX: {
                        contains: concludedLicense,
                    },
                    comment: {
                        contains: comment,
                    },
                    local: local,
                    bulkConclusionId:
                        hasBulkConclusionId !== undefined
                            ? !hasBulkConclusionId
                                ? null
                                : bulkConclusionId
                            : bulkConclusionId,
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                    NOT: {
                        bulkConclusionId:
                            hasBulkConclusionId !== undefined
                                ? hasBulkConclusionId
                                    ? null
                                    : undefined
                                : undefined,
                    },
                },
                orderBy: orderProperty
                    ? {
                          [orderProperty]: orderPropertyValue,
                      }
                    : undefined,
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

type BulkConclusionWithPackageRelation = Prisma.BulkConclusionGetPayload<{
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

export const findBulkConclusionById = async (
    id: number,
): Promise<BulkConclusionWithPackageRelation | null> => {
    let bulkConclusion: BulkConclusionWithPackageRelation | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.findUnique({
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
            console.log("Error with trying to find BulkConclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkConclusion;
};

type BulkConclusionWithRelations = Prisma.BulkConclusionGetPayload<{
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
        userId: true;
    };
}>;

export const findBulkConclusionWithRelationsById = async (
    bulkConclusionId: number,
    packageId: number,
): Promise<BulkConclusionWithRelations | null> => {
    let bulkConclusion: BulkConclusionWithRelations | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.findUnique({
                where: {
                    id: bulkConclusionId,
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
                    userId: true,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkConclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkConclusion;
};

export const findBulkConclusionsWithRelationsByPackageId = async (
    packageId: number,
): Promise<BulkConclusionWithRelations[]> => {
    let retries = initialRetryCount;
    let bulkConclusions: BulkConclusionWithRelations[] = [];

    while (retries > 0) {
        try {
            bulkConclusions = await prisma.bulkConclusion.findMany({
                where: {
                    OR: [
                        {
                            packageId: packageId,
                        },
                        {
                            licenseConclusions: {
                                some: {
                                    file: {
                                        filetrees: {
                                            some: {
                                                packageId: packageId,
                                            },
                                        },
                                    },
                                },
                            },
                            local: false,
                        },
                    ],
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
                    userId: true,
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
            console.log("Error with trying to find BulkConclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkConclusions;
};

type BCWithRelatedLCs = Prisma.BulkConclusionGetPayload<{
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
                fileSha256: true;
            };
        };
        userId: true;
    };
}>;

export const findBCWithRelatedLCsById = async (
    bulkConclusionId: number,
): Promise<BCWithRelatedLCs | null> => {
    let bulkConclusion: BCWithRelatedLCs | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.findUnique({
                where: {
                    id: bulkConclusionId,
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
                            fileSha256: true,
                        },
                    },
                    userId: true,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkConclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkConclusion;
};

type FindBulkConclusionsWithRelationsResult = Prisma.BulkConclusionGetPayload<{
    select: {
        id: true;
        updatedAt: true;
        pattern: true;
        concludedLicenseExpressionSPDX: true;
        detectedLicenseExpressionSPDX: true;
        comment: true;
        local: true;
        package: {
            select: {
                purl: true;
            };
        };
        userId: true;
    };
}>;

export const findBulkConclusionsWithRelations = async (
    skip: number | undefined,
    take: number | undefined,
    orderProperty:
        | "pkg"
        | "pattern"
        | "detectedLicenseExpressionSPDX"
        | "concludedLicenseExpressionSPDX"
        | "comment"
        | "local"
        | "createdAt"
        | "updatedAt"
        | undefined,
    orderPropertyValue: "asc" | "desc" | undefined,
    purl: string | undefined,
    purlStrict: boolean,
    userIds: string[] | undefined,
    pattern: string | undefined,
    detectedLicense: string | undefined,
    concludedLicense: string | undefined,
    comment: string | undefined,
    local: boolean | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<FindBulkConclusionsWithRelationsResult[]> => {
    let retries = initialRetryCount;
    let bulkConclusions: FindBulkConclusionsWithRelationsResult[] = [];

    while (retries > 0) {
        try {
            bulkConclusions = await prisma.bulkConclusion.findMany({
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
                    userId: true,
                },
                skip: skip,
                take: take,
                where: {
                    package: {
                        purl: {
                            equals: purlStrict ? purl : undefined,
                            contains: purlStrict ? undefined : purl,
                        },
                    },
                    userId: {
                        in: userIds,
                    },
                    pattern: {
                        contains: pattern,
                    },
                    detectedLicenseExpressionSPDX: {
                        contains: detectedLicense,
                    },
                    concludedLicenseExpressionSPDX: {
                        contains: concludedLicense,
                    },
                    comment: {
                        contains: comment,
                    },
                    local: local,
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                },
                orderBy: orderProperty
                    ? orderProperty === "pkg"
                        ? {
                              package: {
                                  name: orderPropertyValue,
                              },
                          }
                        : {
                              [orderProperty]: orderPropertyValue,
                          }
                    : undefined,
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkConclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkConclusions;
};

export const findBulkConclusionUserId = async (
    id: number,
): Promise<string | null> => {
    let bulkConclusion: { userId: string } | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.findUnique({
                where: {
                    id: id,
                },
                select: {
                    userId: true,
                },
            });
            break;
        } catch (error) {
            console.log(
                "Error with trying to find BulkConclusionUserId: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return bulkConclusion?.userId || null;
};

export const findBulkConclusionsByPackageId = async (
    packageId: number,
): Promise<BulkConclusion[]> => {
    let retries = initialRetryCount;
    let bulkConclusions: BulkConclusion[] = [];

    while (retries > 0) {
        try {
            bulkConclusions = await prisma.bulkConclusion.findMany({
                where: {
                    packageId: packageId,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find BulkConclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkConclusions;
};

export const findPathExclusionById = async (
    id: number,
): Promise<PathExclusion | null> => {
    let pathExclusion: PathExclusion | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            pathExclusion = await prisma.pathExclusion.findUnique({
                where: {
                    id: id,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find PathExclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return pathExclusion;
};

export const findPathExclusionUserId = async (
    id: number,
): Promise<string | null> => {
    let pathExclusion: { userId: string } | null = null;
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            pathExclusion = await prisma.pathExclusion.findUnique({
                where: {
                    id: id,
                },
                select: {
                    userId: true,
                },
            });
            break;
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
        userId: true;
        package: {
            select: {
                purl: true;
            };
        };
    };
}>;

export const findPathExclusions = async (
    skip: number | undefined,
    take: number | undefined,
    orderProperty:
        | "pkg"
        | "pattern"
        | "reason"
        | "comment"
        | "createdAt"
        | "updatedAt"
        | undefined,
    orderPropertyValue: "asc" | "desc" | undefined,
    purl: string | undefined,
    purlStrict: boolean,
    userIds: string[] | undefined,
    pattern: string | undefined,
    reason: string | undefined,
    comment: string | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<PathExclusionWithRelations[]> => {
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
                    userId: true,
                    package: {
                        select: {
                            purl: true,
                        },
                    },
                },
                skip: skip,
                take: take,
                where: {
                    package: {
                        purl: {
                            equals: purlStrict ? purl : undefined,
                            contains: purlStrict ? undefined : purl,
                        },
                    },
                    userId: {
                        in: userIds,
                    },
                    pattern: {
                        contains: pattern,
                    },
                    reason: {
                        contains: reason,
                    },
                    comment: {
                        contains: comment,
                    },
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                },
                orderBy: orderProperty
                    ? orderProperty === "pkg"
                        ? {
                              package: {
                                  name: orderPropertyValue,
                              },
                          }
                        : {
                              [orderProperty]: orderPropertyValue,
                          }
                    : undefined,
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

export const findPathExclusionsByPackageId = async (
    packageId: number,
): Promise<PathExclusion[]> => {
    let retries = initialRetryCount;
    let pathExclusions: PathExclusion[] = [];

    while (retries > 0) {
        try {
            pathExclusions = await prisma.pathExclusion.findMany({
                where: {
                    packageId: packageId,
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

export const findLicenseConclusionsByPackagePurl = async (
    purl: string,
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
                        purl: purl,
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
                                    local: true,
                                    contextPurl: true,
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
            if (
                !licenseConclusion.local ||
                (licenseConclusion.local &&
                    licenseConclusion.contextPurl === purl)
            )
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

export const findLicenseConclusionsByContextPurl = async (
    contextPurl: string,
): Promise<LicenseConclusion[]> => {
    let retries = initialRetryCount;
    let licenseConclusions: LicenseConclusion[] = [];

    while (retries > 0) {
        try {
            licenseConclusions = await prisma.licenseConclusion.findMany({
                where: {
                    contextPurl: contextPurl,
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

export const findLicenseConclusionsByBulkConclusionId = async (
    bulkConclusionId: number,
): Promise<LicenseConclusion[]> => {
    let retries = initialRetryCount;
    let licenseConclusions: LicenseConclusion[] = [];

    while (retries > 0) {
        try {
            licenseConclusions = await prisma.licenseConclusion.findMany({
                where: {
                    bulkConclusionId: bulkConclusionId,
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

export const findLicenseConclusionsByFileSha256 = async (
    sha256: string,
): Promise<LicenseConclusion[]> => {
    let licenseConclusions: LicenseConclusion[] = [];
    let retries = initialRetryCount;
    let querySuccess = false;

    while (!querySuccess && retries > 0) {
        try {
            licenseConclusions = await prisma.licenseConclusion.findMany({
                where: {
                    fileSha256: sha256,
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

export const findSystemIssues = async (
    errorCode: string,
    message: string,
    resolved?: boolean,
): Promise<SystemIssue[]> => {
    let retries = initialRetryCount;
    let systemIssues: SystemIssue[] = [];

    while (retries > 0) {
        try {
            systemIssues = await prisma.systemIssue.findMany({
                where: {
                    errorCode: errorCode,
                    message: message,
                    resolved: resolved,
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to find SystemIssues: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return systemIssues;
};

export const getDistinctUserIdsForItems = async (): Promise<Set<string>> => {
    let retries = initialRetryCount;
    const userIds: Set<string> = new Set();

    while (retries > 0) {
        try {
            const items = await prisma.licenseConclusion.findMany({
                select: {
                    userId: true,
                },
                distinct: ["userId"],
            });

            for (const item of items) {
                userIds.add(item.userId);
            }
            break;
        } catch (error) {
            console.log(
                "Error with trying to find distinct userIds for items: " +
                    error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    retries = initialRetryCount;

    while (retries > 0) {
        try {
            const items = await prisma.bulkConclusion.findMany({
                select: {
                    userId: true,
                },
                distinct: ["userId"],
            });

            for (const item of items) {
                userIds.add(item.userId);
            }
            break;
        } catch (error) {
            console.log(
                "Error with trying to find distinct userIds for items: " +
                    error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    retries = initialRetryCount;

    while (retries > 0) {
        try {
            const items = await prisma.pathExclusion.findMany({
                select: {
                    userId: true,
                },
                distinct: ["userId"],
            });

            for (const item of items) {
                userIds.add(item.userId);
            }
            break;
        } catch (error) {
            console.log(
                "Error with trying to find distinct userIds for items: " +
                    error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return userIds;
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

export const deleteBulkConclusion = async (
    id: number,
): Promise<BulkConclusion | null> => {
    let retries = initialRetryCount;
    let bulkConclusion: BulkConclusion | null = null;

    while (!bulkConclusion && retries > 0) {
        try {
            bulkConclusion = await prisma.bulkConclusion.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            console.log("Error with trying to delete BulkConclusion: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return bulkConclusion;
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

export const bulkConclusionAffectedRecords = async (
    bulkConclusionId: number,
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
                                bulkConclusionId: bulkConclusionId,
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
                                    bulkConclusionId: bulkConclusionId,
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

export const countScannedPackages = async (
    name: string | undefined,
    version: string | undefined,
    type: string | undefined,
    namespace: string | undefined,
    purl: string | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<number> => {
    let retries = initialRetryCount;
    let count = 0;

    while (retries > 0) {
        try {
            count = await prisma.package.count({
                where: {
                    scanStatus: "scanned",
                    name: {
                        contains: name,
                    },
                    version: {
                        contains: version,
                    },
                    type: {
                        contains: type,
                    },
                    namespace: {
                        contains: namespace,
                    },
                    purl: {
                        contains: purl,
                    },
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to count Packages: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return count;
};

export const countPathExclusions = async (
    purl: string | undefined,
    purlStrict: boolean,
    userIds: string[] | undefined,
    pattern: string | undefined,
    reason: string | undefined,
    comment: string | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<number> => {
    let retries = initialRetryCount;
    let count = 0;

    while (retries > 0) {
        try {
            count = await prisma.pathExclusion.count({
                where: {
                    package: {
                        purl: {
                            equals: purlStrict ? purl : undefined,
                            contains: !purlStrict ? purl : undefined,
                        },
                    },
                    userId: {
                        in: userIds,
                    },
                    pattern: {
                        contains: pattern,
                    },
                    reason: {
                        contains: reason,
                    },
                    comment: {
                        contains: comment,
                    },
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to count PathExclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return count;
};

export const countBulkConclusions = async (
    purl: string | undefined,
    purlStrict: boolean,
    userIds: string[] | undefined,
    pattern: string | undefined,
    detectedLicense: string | undefined,
    concludedLicense: string | undefined,
    comment: string | undefined,
    local: boolean | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<number> => {
    let retries = initialRetryCount;
    let count = 0;

    while (retries > 0) {
        try {
            count = await prisma.bulkConclusion.count({
                where: {
                    package: {
                        purl: {
                            equals: purlStrict ? purl : undefined,
                            contains: !purlStrict ? purl : undefined,
                        },
                    },
                    userId: {
                        in: userIds,
                    },
                    pattern: {
                        contains: pattern,
                    },
                    detectedLicenseExpressionSPDX: {
                        contains: detectedLicense,
                    },
                    concludedLicenseExpressionSPDX: {
                        contains: concludedLicense,
                    },
                    comment: {
                        contains: comment,
                    },
                    local: local,
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to count PathExclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return count;
};

export const countBulkConclusionsForPackage = async (
    packageId: number,
): Promise<number> => {
    let retries = initialRetryCount;
    let count = 0;

    while (retries > 0) {
        try {
            count = await prisma.bulkConclusion.count({
                where: {
                    OR: [
                        {
                            packageId: packageId,
                        },
                        {
                            licenseConclusions: {
                                some: {
                                    file: {
                                        filetrees: {
                                            some: {
                                                packageId: packageId,
                                            },
                                        },
                                    },
                                },
                            },
                            local: false,
                        },
                    ],
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to count BulkConclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return count;
};

export const countLicenseConclusions = async (
    purl: string | undefined,
    contextPurl: string | undefined,
    contextPurlStrict: boolean,
    userIds: string[] | undefined,
    detectedLicense: string | undefined,
    concludedLicense: string | undefined,
    comment: string | undefined,
    local: boolean | undefined,
    bulkConclusionId: number | undefined,
    hasBulkConclusionId: boolean | undefined,
    createdAtGte: Date | undefined,
    createdAtLte: Date | undefined,
    updatedAtGte: Date | undefined,
    updatedAtLte: Date | undefined,
): Promise<number> => {
    let retries = initialRetryCount;
    let count = 0;

    /*
     * The initial idea of these queries was to fetch the license conclusions that are
     * not part of a bulk conclusion (and their count) by setting the bulkConclusionId to
     * null, but for some reason a parameter with null value is completely dropped from the
     * query when using Zodios react hooks with Tanstack query client on the front end, and
     * in the lack of a better solution, a workaround with the parameter hasBulkConclusion
     * is used here.
     */

    while (retries > 0) {
        try {
            count = await prisma.licenseConclusion.count({
                where: {
                    OR: purl
                        ? [
                              /*
                               * License conclusions made in the context of the specified package
                               */
                              {
                                  file: {
                                      filetrees: {
                                          some: {
                                              package: {
                                                  purl: purl,
                                              },
                                          },
                                      },
                                  },
                                  contextPurl: purl,
                              },
                              /*
                               * License conclusions made in the context of a package different from
                               * the specified one. Here the local value has to be false, as otherwise
                               * the license conclusion shouldn't be applied in the files of the
                               * specified package.
                               */
                              {
                                  file: {
                                      filetrees: {
                                          some: {
                                              package: {
                                                  purl: purl,
                                              },
                                          },
                                      },
                                  },
                                  contextPurl: {
                                      not: purl,
                                  },
                                  local: false,
                              },
                          ]
                        : undefined,
                    contextPurl: {
                        /*
                         * If the purl is specified, and the local value is set to true,
                         * the contextPurl cannot be used, as it has to be the same as the
                         * purl. This is also mentioned in the API documentation.
                         */
                        equals:
                            purl && local === true
                                ? undefined
                                : contextPurlStrict
                                  ? contextPurl
                                  : undefined,
                        contains:
                            purl && local === true
                                ? undefined
                                : !contextPurlStrict
                                  ? contextPurl
                                  : undefined,
                    },
                    userId: {
                        in: userIds,
                    },
                    detectedLicenseExpressionSPDX: {
                        contains: detectedLicense,
                    },
                    concludedLicenseExpressionSPDX: {
                        contains: concludedLicense,
                    },
                    comment: {
                        contains: comment,
                    },
                    local: local,
                    bulkConclusionId:
                        hasBulkConclusionId !== undefined
                            ? !hasBulkConclusionId
                                ? null
                                : bulkConclusionId
                            : bulkConclusionId,
                    createdAt: {
                        gte: createdAtGte,
                        lte: createdAtLte,
                    },
                    updatedAt: {
                        gte: updatedAtGte,
                        lte: updatedAtLte,
                    },
                    NOT: {
                        bulkConclusionId:
                            hasBulkConclusionId !== undefined
                                ? hasBulkConclusionId
                                    ? null
                                    : undefined
                                : undefined,
                    },
                },
            });
            break;
        } catch (error) {
            console.log("Error with trying to count PathExclusions: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
    return count;
};

// ------------------------------ Transactions --------------------------------

export const deleteBulkAndLicenseConclusions = async (
    bulkConclusionId: number,
): Promise<void> => {
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            await prisma.$transaction([
                prisma.licenseConclusion.deleteMany({
                    where: {
                        bulkConclusionId: bulkConclusionId,
                    },
                }),
                prisma.bulkConclusion.delete({
                    where: {
                        id: bulkConclusionId,
                    },
                }),
            ]);
            break;
        } catch (error) {
            console.log(
                "Error with trying to delete BulkConclusion and LicenseConclusions: " +
                    error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
};

export const updateBCAndRelatedLCsTA = async (
    bulkConclusionId: number,
    newInputs: Prisma.LicenseConclusionCreateManyInput[],
    licenseConclusionsToDelete: number[],
    updateValues: {
        pattern: string | undefined;
        concludedLicenseExpressionSPDX: string | undefined;
        detectedLicenseExpressionSPDX: string | undefined;
        comment: string | null | undefined;
        local: boolean | undefined;
    },
): Promise<void> => {
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            await prisma.$transaction([
                prisma.licenseConclusion.deleteMany({
                    where: {
                        id: {
                            in: licenseConclusionsToDelete,
                        },
                    },
                }),
                prisma.licenseConclusion.updateMany({
                    where: {
                        bulkConclusionId: bulkConclusionId,
                    },
                    data: omit(updateValues, ["pattern"]),
                }),
                prisma.bulkConclusion.update({
                    where: {
                        id: bulkConclusionId,
                    },
                    data: updateValues,
                }),
                prisma.licenseConclusion.createMany({
                    data: newInputs,
                }),
            ]);
            break;
        } catch (error) {
            console.log(
                "Error with trying to update BulkConclusion and related LicenseConclusions: " +
                    error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
};

// Transaction to update ScannerJob and its children states (if any)
export const updateScannerJobStateRecursive = async (
    scannerJobId: string,
    data: {
        state: string;
    },
): Promise<void> => {
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            await prisma.$transaction(async (tx) => {
                await tx.scannerJob.update({
                    where: {
                        id: scannerJobId,
                    },
                    data: {
                        state: data.state,
                    },
                });

                await tx.scannerJob.updateMany({
                    where: {
                        parentId: scannerJobId,
                    },
                    data: {
                        state: data.state,
                    },
                });
            });
            break;
        } catch (error) {
            console.log("Error with trying to update ScannerJob: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
};

// Transaction to update ScannerJob and its children states (if any) to failed,
// and update the related Packages' scanStatus to failed
export const updateScannerJobAndPackagesStateToFailedRecursive = async (
    scannerJobId: string,
    failureMessage: string,
): Promise<void> => {
    let retries = initialRetryCount;

    while (retries > 0) {
        try {
            await prisma.$transaction(async (tx) => {
                const job = await tx.scannerJob.findUniqueOrThrow({
                    where: {
                        id: scannerJobId,
                    },
                });

                await tx.scannerJob.update({
                    where: {
                        id: scannerJobId,
                    },
                    data: {
                        state: "failed",
                        failureState: job.state,
                        failureMessage: failureMessage,
                    },
                });

                const children = await tx.scannerJob.findMany({
                    where: {
                        parentId: scannerJobId,
                    },
                });

                if (children.length > 0) {
                    // Update ScannerJob's children states to failed
                    await tx.scannerJob.updateMany({
                        where: {
                            parentId: scannerJobId,
                        },
                        data: {
                            state: "failed",
                            failureState: job.state,
                            failureMessage: failureMessage,
                        },
                    });

                    const pkgIds = children.map((child) => child.packageId);
                    pkgIds.push(job.packageId);

                    await tx.package.updateMany({
                        where: {
                            id: {
                                in: pkgIds,
                            },
                        },
                        data: {
                            scanStatus: "failed",
                        },
                    });
                } else {
                    await tx.package.update({
                        where: {
                            id: job.packageId,
                        },
                        data: {
                            scanStatus: "failed",
                        },
                    });
                }
            });
            break;
        } catch (error) {
            console.log("Error with trying to update ScannerJob: " + error);
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }
};

// Transaction to update the user ID for all clearance items that a user has made
export const updateClearanceItemsUserId = async (
    oldUserId: string,
    newUserId: string,
): Promise<{
    pathExclusions: number;
    bulkConclusions: number;
    licenseConclusions: number;
}> => {
    let retries = initialRetryCount;
    let pathExclusionCount = 0;
    let bulkConclusionCount = 0;
    let licenseConclusionCount = 0;

    while (retries > 0) {
        try {
            const result = await prisma.$transaction([
                prisma.pathExclusion.updateMany({
                    where: {
                        userId: oldUserId,
                    },
                    data: {
                        userId: newUserId,
                    },
                }),
                prisma.bulkConclusion.updateMany({
                    where: {
                        userId: oldUserId,
                    },
                    data: {
                        userId: newUserId,
                    },
                }),
                prisma.licenseConclusion.updateMany({
                    where: {
                        userId: oldUserId,
                    },
                    data: {
                        userId: newUserId,
                    },
                }),
            ]);

            pathExclusionCount = result[0].count;
            bulkConclusionCount = result[1].count;
            licenseConclusionCount = result[2].count;

            break;
        } catch (error) {
            console.log(
                "Error with trying to update ClearanceItems' user ID: " + error,
            );
            handleError(error);
            retries--;
            if (retries > 0) await waitToRetry();
            else throw error;
        }
    }

    return {
        pathExclusions: pathExclusionCount,
        bulkConclusions: bulkConclusionCount,
        licenseConclusions: licenseConclusionCount,
    };
};
