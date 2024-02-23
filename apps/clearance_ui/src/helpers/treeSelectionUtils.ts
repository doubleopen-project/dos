// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import type { TreeNode } from "@/types/index";

export const updateSelectedNodes = (
    nodeData: TreeNode,
    isSelected: boolean,
    selectedNodes: TreeNode[],
    setSelectedNodes: (nodes: TreeNode[]) => void,
) => {
    let updatedNodes: TreeNode[];

    if (isSelected) {
        updatedNodes = [...selectedNodes, nodeData];
    } else {
        updatedNodes = selectedNodes.filter((node) => node !== nodeData);
    }

    // If the node is being deselected and has children, add/remove them accordingly
    if (!isSelected && nodeData.children && nodeData.children.length > 0) {
        nodeData.children.forEach((childNode) => {
            if (!selectedNodes.includes(childNode)) {
                updatedNodes.push(childNode);
            }
        });
    }

    setSelectedNodes(updatedNodes);
};
