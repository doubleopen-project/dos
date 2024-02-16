// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { TreeNode } from "@/types";

export const extractUniqueLicenses = (treeNodes: TreeNode[]): Set<string> => {
    const uniqueLicenses = new Set<string>();

    const traverse = (nodes: TreeNode[]) => {
        for (const node of nodes) {
            if (node.file && node.file.licenseFindings) {
                for (const finding of node.file.licenseFindings) {
                    if (typeof finding.licenseExpressionSPDX === "string") {
                        // Check if licenseExpressionSPDX is a string
                        uniqueLicenses.add(finding.licenseExpressionSPDX);
                    }
                }
            }
            if (node.children) {
                traverse(node.children);
            }
        }
    };

    traverse(treeNodes);

    return uniqueLicenses;
};
