// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { TreeNode } from "../types";

// Update the exclusion status of an internal node
// based on the exclusion status of its children:
// - If all children are excluded, the node is excluded
// - If any child is not excluded, the node is not excluded
export const updateExclusionStatus = (node: TreeNode): boolean => {
    if (!node.children || node.children.length === 0) {
        return node.isExcluded || false;
    }

    let allChildrenExcluded = true;
    for (const child of node.children) {
        const childExcluded = updateExclusionStatus(child);
        allChildrenExcluded = allChildrenExcluded && childExcluded;
    }

    node.isExcluded = allChildrenExcluded;
    return node.isExcluded;
};
