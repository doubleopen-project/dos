// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { TreeNode } from "@/types";

export const getNodesWithChildren = (treeData: TreeNode[]): TreeNode[] => {
    const nodes: TreeNode[] = [];

    const getNodesAndChildren = (tree: TreeNode[]): void => {
        for (const child of tree) {
            nodes.push(child);

            if (child.children) {
                getNodesAndChildren(child.children);
            }
        }
    };

    getNodesAndChildren(treeData);

    return nodes;
};
