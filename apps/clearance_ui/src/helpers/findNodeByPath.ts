// SPDX-FileCopyrightText: 2023 Double Open
//
// SPDX-License-Identifier: MIT

import { TreeNode } from "@/types";

export const findNodeByPath = (
    treeData: TreeNode[],
    path: string,
): TreeNode | null => {
    let node: TreeNode | null = null;

    const recursiveSearch = (tree: TreeNode[]): void => {
        for (const child of tree) {
            if (child.path === path) {
                node = child;
                break;
            }

            if (child.children) {
                recursiveSearch(child.children);
            }
        }
    };

    recursiveSearch(treeData);

    return node;
};
