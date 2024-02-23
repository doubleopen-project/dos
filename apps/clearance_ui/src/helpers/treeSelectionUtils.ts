// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { NodeApi } from "react-arborist";
import type { TreeNode } from "@/types/index";

export const updateSelectedNodes = (
    node: NodeApi<TreeNode>,
    isSelected: boolean,
    selectedNodes: TreeNode[],
    setSelectedNodes: (nodes: TreeNode[]) => void,
) => {
    // Helper function to recursively select or deselect nodes
    const toggleSelectionRecursive = (
        currentNode: NodeApi<TreeNode>,
        select: boolean,
    ) => {
        // Add or remove the current node from the updatedNodes list
        if (select && !updatedNodes.includes(currentNode.data)) {
            updatedNodes.push(currentNode.data);
        } else if (!select) {
            updatedNodes = updatedNodes.filter(
                (selectedNode) => selectedNode !== currentNode.data,
            );
        }

        // Recursively select or deselect immediate children nodes if the current node is a directory
        if (!currentNode.isLeaf && currentNode.children) {
            currentNode.children.forEach((childNode) => {
                toggleSelectionRecursive(childNode, select);
            });
        }
        // Update the selection status based on the select parameter
        currentNode.data.selectionStatus = select ? 1 : 0;
    };

    // Helper function to recursively update the parent nodes with intermediate selection status
    const updateParentNodes = (currentNode: NodeApi<TreeNode>) => {
        const parentNode = currentNode.parent;
        if (parentNode) {
            console.log("Current node: ", currentNode.data.path);
            console.log("Parent node: ", parentNode.data.path);
            const children = parentNode.children || [];
            const hasSelectedOrIntermediateChild = children.some(
                (child) =>
                    updatedNodes.includes(child.data) ||
                    child.data.selectionStatus === 0.5,
            );

            if (hasSelectedOrIntermediateChild) {
                parentNode.data.selectionStatus = 0.5;
            } else {
                parentNode.data.selectionStatus = 0;
            }
            updateParentNodes(parentNode); // Recursively call updateParentNodes for the parent node
        }
    };

    let updatedNodes: TreeNode[];

    updatedNodes = isSelected
        ? [...selectedNodes, node.data]
        : selectedNodes.filter((selectedNode) => selectedNode !== node.data);

    // Recursively toggle selection of the node and its immediate descendants
    toggleSelectionRecursive(node, isSelected);

    // Check if all children of the parent node are selected or deselected,
    // and update the parent's selection status accordingly
    const parentNode = node.parent;
    if (parentNode) {
        const children = parentNode.children || [];
        const totalChildren = children.length;
        const selectedChildrenCount = children.filter((child) =>
            updatedNodes.includes(child.data),
        ).length;

        if (selectedChildrenCount === 0) {
            parentNode.data.selectionStatus = 0;
        } else if (selectedChildrenCount === totalChildren) {
            parentNode.data.selectionStatus = 1;
        } else {
            parentNode.data.selectionStatus = 0.5;
        }
        updateParentNodes(parentNode);
    }

    // Update the selectedNodes state
    setSelectedNodes(updatedNodes);
};
