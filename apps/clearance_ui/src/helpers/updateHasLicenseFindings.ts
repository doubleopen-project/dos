// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import type { TreeNode } from "@/types";

export const updateHasLicenseFindings = (
    tree: TreeNode[],
    licenseSearchText: string,
) => {
    const resetHasLicenseFindings = (node: TreeNode) => {
        node.hasLicenseFindings = false;
        node.children?.forEach(resetHasLicenseFindings);
    };

    const updateNode = (node: TreeNode) => {
        // Initially set hasLicenseFindings to false for each node
        resetHasLicenseFindings(node);

        if (node.file?.licenseFindings) {
            for (const licenseFinding of node.file.licenseFindings) {
                if (
                    licenseFinding?.licenseExpressionSPDX
                        ?.toLowerCase()
                        .includes(licenseSearchText.toLowerCase())
                ) {
                    node.hasLicenseFindings = true;
                    break;
                }
            }
        }

        // Update children and propagate the flag to parent
        if (node.children) {
            for (const child of node.children) {
                updateNode(child);
                if (child.hasLicenseFindings) {
                    node.hasLicenseFindings = true;
                }
            }
        }
    };

    // Start the update process
    tree.forEach(updateNode);
};
