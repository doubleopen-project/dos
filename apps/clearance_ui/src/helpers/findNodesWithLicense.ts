// SPDX-FileCopyrightText: 2024 HH Partners
//
// SPDX-License-Identifier: MIT

import { TreeNode } from "@/types";

export const findNodesWithLicense = (
    root: TreeNode[],
    licenseSearchText: string,
): TreeNode[] => {
    const nodesWithLicense: TreeNode[] = [];

    const recursiveSearch = (node: TreeNode): void => {
        // Check if the node itself has the license
        const hasLicense = node.file?.licenseFindings?.some((licenseFinding) =>
            licenseFinding.licenseExpressionSPDX
                ?.toLowerCase()
                .includes(licenseSearchText.toLowerCase()),
        );

        if (hasLicense) {
            nodesWithLicense.push(node);
        }

        // Check children
        if (node.children) {
            for (const child of node.children) {
                recursiveSearch(child);
            }
        }
    };

    for (const node of root) {
        recursiveSearch(node);
    }

    return nodesWithLicense;
};
