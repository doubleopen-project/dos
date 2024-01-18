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
