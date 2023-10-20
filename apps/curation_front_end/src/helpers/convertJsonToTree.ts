// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import type { FileTreeType } from "validation-helpers";
import type { TreeNode } from "../types";
import { sortTree } from "./sortTree";

export const convertJsonToTree = (filetrees: FileTreeType[]): TreeNode[] => {
    let id = 1; // Initialize a unique ID counter
    const root: TreeNode[] = []; // Initialize an empty root
    const map: { [key: string]: TreeNode } = {}; // Maintain a mapping from directory name to TreeNode object

    for (const fileTree of filetrees) {
        const pathParts = fileTree.path.split("/");
        let currentNode: TreeNode[] = root;
        let fullPath = "";

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            const isLastPart = i === pathParts.length - 1;

            fullPath += (i > 0 ? "/" : "") + part;

            if (!map[fullPath]) {
                const newNode: TreeNode = {
                    id: id.toString(),
                    name: part,
                    path: isLastPart ? fileTree.path : undefined,
                    fileSha256: isLastPart ? fileTree.fileSha256 : undefined,
                    hasLicenseFindings: false,
                    hasLicenseConclusions: false,
                    file: {
                        licenseFindings: isLastPart
                            ? fileTree.file.licenseFindings
                            : [],
                        licenseConclusions: isLastPart
                            ? fileTree.file.licenseConclusions
                            : [],
                    },
                };

                // If this is a leaf node and there are any license findings, mark the node
                if (isLastPart && fileTree.file.licenseFindings.length > 0) {
                    newNode.hasLicenseFindings = true;
                }

                // If this is a leaf node and there are any license conclusions, mark the node
                if (isLastPart && fileTree.file.licenseConclusions.length > 0) {
                    newNode.hasLicenseConclusions = true;
                }

                id++;
                if (!isLastPart) {
                    newNode.children = [];
                }

                map[fullPath] = newNode;
                currentNode.push(newNode);
            } else if (isLastPart) {
                // Merge licenseFindings for existing nodes
                map[fullPath].file?.licenseFindings?.push(
                    ...fileTree.file.licenseFindings,
                );
                map[fullPath].file?.licenseConclusions?.push(
                    ...fileTree.file.licenseConclusions,
                );

                if (fileTree.file.licenseFindings.length > 0) {
                    map[fullPath].hasLicenseFindings = true;
                }
                if (fileTree.file.licenseConclusions.length > 0) {
                    map[fullPath].hasLicenseConclusions = true;
                }
            }

            // Propagate the hasLicenseFindings and hasLicenseConclusions flags to ancestor directories
            if (
                fileTree.file.licenseFindings.length > 0 ||
                fileTree.file.licenseConclusions.length > 0
            ) {
                let ancestorPath = "";
                for (let j = 0; j <= i; j++) {
                    ancestorPath += (j > 0 ? "/" : "") + pathParts[j];
                    if (map[ancestorPath]) {
                        if (fileTree.file.licenseFindings.length > 0) {
                            map[ancestorPath].hasLicenseFindings = true;
                        }
                        if (fileTree.file.licenseConclusions.length > 0) {
                            map[ancestorPath].hasLicenseConclusions = true; // Propagate flag to ancestors
                        }
                    }
                }
            }

            if (!isLastPart) {
                currentNode = map[fullPath].children!;
            }
        }
    }

    return sortTree(root);
};
