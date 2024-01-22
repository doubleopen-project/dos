// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { FileTree, Package } from "database";
import { PackageURL } from "packageurl-js";
import * as dbQueries from "./db_queries";

export const runPurlCleanup = async (options: {
    dryRun?: boolean;
    allPhases?: boolean;
    transferPathExclusions?: boolean;
    transferBulkConclusions?: boolean;
    changeContextPurls?: boolean;
    deleteOldPurlBookmarks?: boolean;
}) => {
    try {
        const dryRun = options.dryRun !== undefined ? options.dryRun : true;
        console.log(
            "\nStarting purl cleanup process with the following options:",
        );
        console.log("dryRun: ", dryRun);
        console.log("allPhases: ", options.allPhases);
        if (!options.allPhases) {
            console.log(
                "transferPathExclusions: ",
                options.transferPathExclusions,
            );
            console.log(
                "transferContextPurls: ",
                options.transferBulkConclusions,
            );
            console.log("transferContextPurls: ", options.changeContextPurls);
            console.log(
                "deleteOldPurlBookmarks: ",
                options.deleteOldPurlBookmarks,
            );
        }
        const pkgMap = await getPackageMap();
        const filteredPkgMap = await getFilteredPackageMap(pkgMap);
        if (filteredPkgMap.size === 0) {
            console.log(
                "\nNo clean purls with multiple identical packages found",
            );
        } else {
            console.log(
                "\nFound " +
                    filteredPkgMap.size +
                    " clean purls with multiple identical packages:",
            );
            for (const [key, value] of filteredPkgMap.entries()) {
                console.log("Clean purl: " + key);
                console.log("Purls:");
                for (const pkg of value) {
                    console.log(pkg.purl);
                }
            }
            if (options.allPhases || options.transferPathExclusions)
                await transferPathExclusions(filteredPkgMap, dryRun);
            if (options.allPhases || options.transferBulkConclusions)
                await transferBulkConclusions(filteredPkgMap, dryRun);
            if (options.allPhases || options.changeContextPurls)
                await changeContextPurls(filteredPkgMap, dryRun);
            if (options.allPhases || options.deleteOldPurlBookmarks)
                await deleteOldPurlBookmarks(filteredPkgMap, dryRun);
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};

const getPackageMap = async () => {
    const packages = await dbQueries.findAllScannedPackages();

    const pkgMap = new Map<string, Package[]>();

    for (const pkg of packages) {
        try {
            const parsedPurl = PackageURL.fromString(pkg.purl);
            const cleanPurl = new PackageURL(
                parsedPurl.type,
                parsedPurl.namespace,
                parsedPurl.name,
                parsedPurl.version,
                null,
                null,
            ).toString();

            if (pkgMap.has(cleanPurl)) {
                pkgMap.get(cleanPurl)?.push(pkg);
            } else {
                pkgMap.set(cleanPurl, [pkg]);
            }
        } catch (error) {
            console.log("Error parsing purl: " + pkg.purl);
            console.log(error);
        }
    }

    return pkgMap;
};

const findNewestPackage = (pkgs: Package[]) => {
    let newestPkg = pkgs[0];
    for (const pkg of pkgs) {
        if (pkg.createdAt > newestPkg.createdAt) {
            newestPkg = pkg;
        }
    }
    return newestPkg;
};

const compareFiletrees = (filetrees1: FileTree[], filetrees2: FileTree[]) => {
    if (filetrees1.length !== filetrees2.length) {
        return false;
    }
    for (const filetree1 of filetrees1) {
        let found = false;
        for (const filetree2 of filetrees2) {
            if (
                filetree1.path === filetree2.path &&
                filetree1.fileSha256 === filetree2.fileSha256
            ) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
};

const getFilteredPackageMap = async (pkgMap: Map<string, Package[]>) => {
    const filteredMap = new Map<string, Package[]>();
    for (const [purl, pkgs] of pkgMap.entries()) {
        if (pkgs.length > 1) {
            // Find out if the contents of the packages are the same
            const newestPkg = findNewestPackage(pkgs);
            const newPkgFiletrees = await dbQueries.findFileTreesByPackageId(
                newestPkg.id,
            );
            const filteredPkgs = [newestPkg];
            for (const pkg of pkgs) {
                if (pkg.id !== newestPkg.id) {
                    const pkgFiletrees =
                        await dbQueries.findFileTreesByPackageId(pkg.id);
                    if (compareFiletrees(pkgFiletrees, newPkgFiletrees)) {
                        filteredPkgs.push(pkg);
                    }
                }
            }
            if (filteredPkgs.length > 1) filteredMap.set(purl, filteredPkgs);
        }
    }

    return filteredMap;
};

const dryRunMessage =
    "---Skipping database update operation as this is a dry run---";

const transferPathExclusions = async (
    pkgMap: Map<string, Package[]>,
    dryRun?: boolean,
) => {
    for (const [purl, pkgs] of pkgMap.entries()) {
        console.log(
            "\nStarting process to transfer path exclusions for clean purl: ",
            purl,
        );
        const newestPkg = findNewestPackage(pkgs);
        console.log("Newest package: ", newestPkg.purl);

        for (const pkg of pkgs) {
            console.log("Processing package: ", pkg.purl);
            if (pkg.id !== newestPkg.id) {
                const pathExclusions =
                    await dbQueries.findPathExclusionsByPackageId(pkg.id);
                console.log("Found path exclusions: ", pathExclusions.length);
                if (pathExclusions.length > 0) {
                    for (const pe of pathExclusions) {
                        console.log(
                            "Transferring path exclusion with id " +
                                pe.id +
                                " from package id " +
                                pe.packageId +
                                " to package id " +
                                newestPkg.id,
                        );
                        if (dryRun) console.log(dryRunMessage);
                        else {
                            const updatedPathExclusion =
                                await dbQueries.updatePathExclusionPackageId(
                                    pe.id,
                                    newestPkg.id,
                                );
                            console.log(
                                "New package id: ",
                                updatedPathExclusion?.packageId,
                            );
                        }
                    }
                }

                const pathExclusionsAfter =
                    await dbQueries.findPathExclusionsByPackageId(pkg.id);

                if (dryRun) {
                    if (pathExclusionsAfter.length !== pathExclusions.length) {
                        throw new Error(
                            `Path exclusions changed for package ${pkg.id} during dry run`,
                        );
                    }
                } else {
                    if (pathExclusionsAfter.length > 0) {
                        throw new Error(
                            `Path exclusions not moved for package ${pkg.id}`,
                        );
                    }
                }
            } else {
                console.log(
                    "Skipping package " + pkg.purl + " as it is newest one",
                );
            }
        }
    }
};

const transferBulkConclusions = async (
    pkgMap: Map<string, Package[]>,
    dryRun?: boolean,
) => {
    for (const [purl, pkgs] of pkgMap.entries()) {
        console.log(
            "\nStarting process to transfer bulk conclusions for clean purl: ",
            purl,
        );
        const newestPkg = findNewestPackage(pkgs);
        console.log("Newest package: ", newestPkg.purl);

        for (const pkg of pkgs) {
            console.log("Processing package: ", pkg.purl);
            if (pkg.id !== newestPkg.id) {
                const bulkConclusions =
                    await dbQueries.findBulkConclusionsByPackageId(pkg.id);
                console.log("Found bulk conclusions: ", bulkConclusions.length);
                if (bulkConclusions.length > 0) {
                    for (const bc of bulkConclusions) {
                        console.log(
                            "Transferring bulk conclusion with id " +
                                bc.id +
                                " from package id " +
                                bc.packageId +
                                " to package id " +
                                newestPkg.id,
                        );
                        if (dryRun) console.log(dryRunMessage);
                        else {
                            const updatedBulkConclusion =
                                await dbQueries.updateBulkConclusionPackageId(
                                    bc.id,
                                    newestPkg.id,
                                );
                            console.log(
                                "New package id: ",
                                updatedBulkConclusion?.packageId,
                            );
                            if (
                                updatedBulkConclusion?.packageId !==
                                newestPkg.id
                            ) {
                                throw new Error(
                                    `Bulk conclusion with id ${bc.id} not moved for package ${pkg.id}`,
                                );
                            }
                        }
                        console.log(
                            "Updating contextPurl for license conclusions that are part of the bulk conclusion",
                        );
                        const licenseConclusions =
                            await dbQueries.findLicenseConclusionsByBulkConclusionId(
                                bc.id,
                            );
                        console.log(
                            "This update will affect " +
                                licenseConclusions.length +
                                " license conclusions",
                        );
                        if (dryRun) console.log(dryRunMessage);
                        else {
                            const batchPayload =
                                await dbQueries.updateManyLicenseConclusions(
                                    bc.id,
                                    {
                                        contextPurl: newestPkg.purl,
                                    },
                                );
                            if (
                                batchPayload.count !== licenseConclusions.length
                            ) {
                                throw new Error(
                                    `All license conclusions were not updated for bulk conclusion ${bc.id}`,
                                );
                            }
                            console.log(
                                "Updated " +
                                    batchPayload.count +
                                    " license conclusions",
                            );
                        }
                        const licenseConclusionsAfter =
                            await dbQueries.findLicenseConclusionsByBulkConclusionId(
                                bc.id,
                            );
                        if (dryRun) {
                            for (const lc of licenseConclusionsAfter) {
                                if (lc.contextPurl === newestPkg.purl) {
                                    throw new Error(
                                        `Context purl changed for license conclusion ${lc.id} during dry run`,
                                    );
                                }
                            }
                        } else {
                            for (const lc of licenseConclusionsAfter) {
                                if (lc.contextPurl !== newestPkg.purl) {
                                    throw new Error(
                                        `Context purl not changed for license conclusion ${lc.id}`,
                                    );
                                }
                            }
                        }
                    }
                }
                const bulkConclusionsAfter =
                    await dbQueries.findBulkConclusionsByPackageId(pkg.id);

                if (dryRun) {
                    if (
                        bulkConclusionsAfter.length !== bulkConclusions.length
                    ) {
                        throw new Error(
                            `Bulk conclusions changed for package ${pkg.id} during dry run`,
                        );
                    }
                } else {
                    if (bulkConclusionsAfter.length > 0) {
                        throw new Error(
                            `Bulk conclusions not moved for package ${pkg.id}`,
                        );
                    }
                }
            } else {
                console.log(
                    "Skipping package " + pkg.purl + " as it is newest one",
                );
            }
        }
    }
};

const changeContextPurls = async (
    pkgMap: Map<string, Package[]>,
    dryRun?: boolean,
) => {
    for (const [purl, pkgs] of pkgMap.entries()) {
        console.log(
            "\nStarting process to change context purls for license conclusions with clean purl: ",
            purl,
        );
        const newestPkg = findNewestPackage(pkgs);
        console.log("Newest package: ", newestPkg.purl);

        for (const pkg of pkgs) {
            console.log("Processing package: ", pkg.purl);
            if (pkg.id !== newestPkg.id) {
                const licenseConclusions =
                    await dbQueries.findLicenseConclusionsByContextPurl(
                        pkg.purl,
                    );
                console.log(
                    "Found license conclusions: ",
                    licenseConclusions.length,
                );
                if (licenseConclusions.length > 0) {
                    for (const lc of licenseConclusions) {
                        console.log(
                            "Changing context purl of license conclusion with id " +
                                lc.id +
                                " from purl " +
                                lc.contextPurl +
                                " to purl " +
                                newestPkg.purl,
                        );
                        if (dryRun) console.log(dryRunMessage);
                        else {
                            const updatedLicenseConclusion =
                                await dbQueries.updateLicenseConclusion(lc.id, {
                                    concludedLicenseExpressionSPDX: undefined,
                                    detectedLicenseExpressionSPDX: undefined,
                                    comment: undefined,
                                    local: undefined,
                                    contextPurl: newestPkg.purl,
                                    bulkConclusionId: undefined,
                                });
                            console.log(
                                "New contextPurl: ",
                                updatedLicenseConclusion?.contextPurl,
                            );
                        }
                    }
                }

                const licenseConclusionsAfter =
                    await dbQueries.findLicenseConclusionsByContextPurl(
                        pkg.purl,
                    );

                if (dryRun) {
                    if (
                        licenseConclusionsAfter.length !==
                        licenseConclusions.length
                    ) {
                        throw new Error(
                            `License conclusions changed for package ${pkg.id}`,
                        );
                    }
                } else {
                    if (licenseConclusionsAfter.length > 0) {
                        throw new Error(
                            `License conclusions not moved for package ${pkg.id}`,
                        );
                    }
                }
            } else {
                console.log(
                    "Skipping package " + pkg.purl + " as it is newest one",
                );
            }
        }
    }
};

const deleteOldPurlBookmarks = async (
    pkgMap: Map<string, Package[]>,
    dryRun?: boolean,
) => {
    for (const [purl, pkgs] of pkgMap.entries()) {
        console.log(
            "\nStarting process to delete old purl bookmarks for clean purl: ",
            purl,
        );
        const newestPkg = findNewestPackage(pkgs);
        console.log("Newest package: ", newestPkg.purl);

        for (const pkg of pkgs) {
            console.log("Processing package: ", pkg.purl);
            if (pkg.id !== newestPkg.id) {
                const pathExclusions =
                    await dbQueries.findPathExclusionsByPackageId(pkg.id);
                const bulkConclusions =
                    await dbQueries.findBulkConclusionsByPackageId(pkg.id);
                const licenseConclusions =
                    await dbQueries.findLicenseConclusionsByContextPurl(
                        pkg.purl,
                    );
                if (
                    pathExclusions.length > 0 ||
                    bulkConclusions.length > 0 ||
                    licenseConclusions.length > 0
                ) {
                    if (dryRun)
                        console.log(
                            "---Dry run log: Error would be thrown here, as some references have not been cleared yet---",
                        );
                    else
                        throw new Error(
                            "Old purl bookmarks not deleted for package " +
                                pkg.purl +
                                ". Some references have not been cleared yet. The package contains " +
                                pathExclusions.length +
                                " path exclusions, " +
                                bulkConclusions.length +
                                " bulk conclusions, and is the contextPurl of " +
                                licenseConclusions.length +
                                " license conclusions",
                        );
                }
                const scannerJobs = await dbQueries.findScannerJobsByPackageId(
                    pkg.id,
                );
                for (const scannerJob of scannerJobs) {
                    // Find out if scanner job has child scanner jobs
                    const childScannerJobs =
                        await dbQueries.findScannerJobsByParentId(
                            scannerJob.id,
                        );

                    if (childScannerJobs.length > 0) {
                        // Detach child scanner jobs from parent
                        console.log(
                            "Detaching " +
                                childScannerJobs.length +
                                " child scanner jobs from parent scanner job with id " +
                                scannerJob.id,
                        );
                        if (dryRun) console.log(dryRunMessage);
                        else
                            await dbQueries.updateManyScannerJobChildren(
                                scannerJob.id,
                                null,
                            );
                    }
                }
                console.log(
                    "Deleting " +
                        scannerJobs.length +
                        " scanner jobs with package id " +
                        pkg.id +
                        "...",
                );
                if (dryRun) console.log(dryRunMessage);
                else {
                    const deletedScannerJobs =
                        await dbQueries.deleteScannerJobsByPackageId(pkg.id);
                    console.log(
                        "Deleted " + deletedScannerJobs.count + " scanner jobs",
                    );
                }
                const scannerJobsAfter =
                    await dbQueries.findScannerJobsByPackageId(pkg.id);

                if (!dryRun) {
                    if (scannerJobsAfter.length > 0) {
                        throw new Error(
                            "Scanner jobs not deleted for package " +
                                pkg.id +
                                ". The package is linked to " +
                                scannerJobsAfter.length +
                                " scanner jobs",
                        );
                    }
                }
                const fileTrees = await dbQueries.findFileTreesByPackageId(
                    pkg.id,
                );
                console.log(
                    "Deleting " +
                        fileTrees.length +
                        " FileTrees with package id " +
                        pkg.id +
                        "...",
                );
                if (dryRun) console.log(dryRunMessage);
                else {
                    const deletedFileTrees =
                        await dbQueries.deleteFileTreesByPackageId(pkg.id);
                    console.log(
                        "Deleted " + deletedFileTrees.count + " FileTrees",
                    );
                }
                const fileTreesAfter = await dbQueries.findFileTreesByPackageId(
                    pkg.id,
                );
                if (dryRun && fileTreesAfter.length === 0)
                    throw new Error(
                        "FileTrees deleted for package " +
                            pkg.id +
                            " during dry run",
                    );
                else if (!dryRun && fileTreesAfter.length > 0)
                    throw new Error(
                        "FileTrees not deleted for package " + pkg.id,
                    );

                console.log(
                    "Deleting package with id " +
                        pkg.id +
                        " and purl " +
                        pkg.purl,
                );
                if (dryRun) console.log(dryRunMessage);
                else {
                    const deletedPackage = await dbQueries.deletePackage(
                        pkg.id,
                    );
                    console.log(
                        "Deleted package with id " +
                            deletedPackage?.id +
                            " and purl " +
                            deletedPackage?.purl,
                    );
                }
            } else {
                console.log(
                    "Skipping package " + pkg.purl + " as it is newest one",
                );
            }
        }
    }
};
