// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import type { TreeNode } from "@/types";

export const filterTreeDataByLicense = (
    root: TreeNode[],
    licenseSearchText: string,
): TreeNode[] => {
    const newRoot: TreeNode[] = [];

    const recursiveFilter = (node: TreeNode): TreeNode | null => {
        let newNode: TreeNode | null = null;

        // Check if the node itself has the license
        const hasLicense = node.file?.licenseFindings?.some(
            (licenseFinding) =>
                licenseFinding.licenseExpressionSPDX
                    ?.toLowerCase()
                    .includes(licenseSearchText.toLowerCase()),
        );

        if (hasLicense) {
            newNode = { ...node };
        }

        // Check children
        if (node.children) {
            const newChildren: TreeNode[] = [];

            for (const child of node.children) {
                const newChild = recursiveFilter(child);
                if (newChild) {
                    newChildren.push(newChild);
                }
            }

            if (newChildren.length > 0) {
                newNode = newNode ? newNode : { ...node };
                newNode.children = newChildren;
            }
        }

        return newNode;
    };

    for (const node of root) {
        const newNode = recursiveFilter(node);
        if (newNode) {
            newRoot.push(newNode);
        }
    }

    return newRoot;
};
