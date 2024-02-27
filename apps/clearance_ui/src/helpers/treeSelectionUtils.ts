// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { NodeApi } from "react-arborist";
import type { TreeNode } from "@/types/index";

export const updateSelectedNodes = (
    node: NodeApi<TreeNode>,
    isSelected: boolean,
    selectedNodes: NodeApi<TreeNode>[],
    setSelectedNodes: (nodes: NodeApi<TreeNode>[]) => void,
) => {
    // Helper function to recursively select or deselect nodes
    const toggleSelectionRecursive = (
        currentNode: NodeApi<TreeNode>,
        select: boolean,
    ) => {
        // Add or remove the current node from the updatedNodes list
        if (select && !updatedNodes.includes(currentNode)) {
            updatedNodes.push(currentNode);
        } else if (!select) {
            updatedNodes = updatedNodes.filter(
                (selectedNode) => selectedNode.data !== currentNode.data,
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
        if (parentNode !== null) {
            const children = parentNode.children || [];
            const hasSelectedOrIntermediateChild = children.some(
                (child) =>
                    updatedNodes.includes(child) ||
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

    let updatedNodes: NodeApi<TreeNode>[];

    updatedNodes = isSelected
        ? [...selectedNodes, node]
        : selectedNodes.filter(
              (selectedNode) => selectedNode.data !== node.data,
          );

    // Recursively toggle selection of the node and its immediate descendants
    toggleSelectionRecursive(node, isSelected);

    // Check if all children of the parent node are selected or deselected,
    // and update the parent's selection status accordingly
    const parentNode = node.parent;
    if (parentNode) {
        const children = parentNode.children || [];
        const totalChildren = children.length;
        const selectedChildren = children.filter((child) => {
            const updatedNodeIds = updatedNodes.map((node) => node.data.id);
            return updatedNodeIds.includes(child.data.id);
        });
        const selectedChildrenCount = selectedChildren.length;
        if (selectedChildrenCount === 0) {
            // Remove the parent node from the updatedNodes list if it has no children selected
            parentNode.data.selectionStatus = 0;
            updatedNodes = updatedNodes.filter(
                (selectedNode) => selectedNode.data !== parentNode.data,
            );
        } else if (selectedChildrenCount === totalChildren) {
            // Push the parent node to the updatedNodes list if all children are selected
            parentNode.data.selectionStatus = 1;
            updatedNodes.push(parentNode);
        } else {
            parentNode.data.selectionStatus = 0.5;
        }
        updateParentNodes(parentNode);
    }

    // Update the selectedNodes state
    setSelectedNodes(updatedNodes);
};

// Helper function to clear the selection status of all selected nodes
export const clearSelectedNodes = (selectedNodes: NodeApi<TreeNode>[]) => {
    // Clear the selected nodes
    selectedNodes.forEach((node) => {
        node.data.selectionStatus = 0;
    });

    // Clear also all ancestor nodes

    selectedNodes.forEach((node) => {
        let currentNode = node;
        while (currentNode.parent) {
            currentNode = currentNode.parent;
            currentNode.data.selectionStatus = 0;
        }
    });
};
