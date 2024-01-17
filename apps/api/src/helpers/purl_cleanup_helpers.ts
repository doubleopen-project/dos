// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { FileTree, Package } from "database";
import { PackageURL } from "packageurl-js";
import * as dbQueries from "./db_queries";

export const getPackageMap = async () => {
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

export const getFilteredPackageMap = async (pkgMap: Map<string, Package[]>) => {
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
