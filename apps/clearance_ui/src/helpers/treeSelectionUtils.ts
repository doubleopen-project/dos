// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { sortBy } from "lodash";
import { minimatch } from "minimatch";
import { NodeApi } from "react-arborist";
import type { TreeNode } from "@/types/index";

// Function to update the selection status of the selected nodes
export const updateSelectedNodes = (
    node: NodeApi<TreeNode>,
    isSelected: boolean,
    selectedNodes: NodeApi<TreeNode>[],
    setSelectedNodes: (nodes: NodeApi<TreeNode>[]) => void,
    setGlob: (glob: string) => void,
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

    // Helper function to recursively update the parent nodes's status up the tree
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
            // (bugfix) If all children are selected, update the parent node's selection status to 1
            if (
                children.every(
                    (child) =>
                        updatedNodes.includes(child) ||
                        child.data.selectionStatus === 1,
                )
            ) {
                parentNode.data.selectionStatus = 1;
            }
            updateParentNodes(parentNode); // Recursively call updateParentNodes for the parent node
        }
    };

    let updatedNodes: NodeApi<TreeNode>[];

    updatedNodes = isSelected
        ? [...selectedNodes, node]
        : selectedNodes.filter(
              (selectedNode) => selectedNode.data.path !== node.data.path,
          );

    // Recursively toggle selection of the node and its immediate descendants
    toggleSelectionRecursive(node, isSelected);

    // Check how many children of the parent node are selected or deselected,
    // and update the parent's selection status accordingly
    const parentNode = node.parent;
    if (parentNode) {
        const selectedChildren = getSelectedChildrenStatus(parentNode);
        if (selectedChildren === "none") {
            // Remove the parent node from the updatedNodes list if it has no children selected
            parentNode.data.selectionStatus = 0;
            updatedNodes = updatedNodes.filter(
                (selectedNode) =>
                    selectedNode.data.path !== parentNode.data.path,
            );
        } else if (selectedChildren === "all") {
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
    setGlob(createGlob(updatedNodes));
};

// Function to clear the selection status of all selected nodes
export const clearSelectedNodes = (
    selectedNodes: NodeApi<TreeNode>[],
    setGlob: (glob: string) => void,
) => {
    // Clear the selected nodes
    selectedNodes.forEach((node) => {
        node.data.selectionStatus = 0;
    });

    // Clear also all ancestor nodes
    selectedNodes.forEach((node) => {
        let currentNode = node;
        while (currentNode.parent) {
            currentNode.data.selectionStatus = 0;
            currentNode = currentNode.parent;
        }
    });
    // Clear the glob
    setGlob("");
};

// Function to create a simplified glob pattern from the selected nodes
export const createGlob = (selectedNodes: NodeApi<TreeNode>[]) => {
    let remainingNodes = selectedNodes;
    let pattern: string[] = [];

    // 1. Replace the fully selected directories with "directory/**" pattern.
    // Use greedy replacement to ensure that the most top-level directories
    // are matched first.

    for (const dir of sortBy(
        remainingNodes.filter(
            (node) => node.isInternal && node.data.selectionStatus === 1,
        ),
        "level",
    )) {
        remainingNodes = removeNodeAndDescendants(dir, remainingNodes);
        // Push to glob only if the pattern is not already included
        if (!pattern.includes(dir.data.path + "/**")) {
            pattern.push(dir.data.path + "/**");
        }
    }
    // Remove redundant a/b/** type of substitutions if a/** is already included
    pattern = removeInnerSubstitutions(pattern);
    remainingNodes = filterNodesByGlob(
        remainingNodes,
        generateGlobPattern(pattern),
    ).filter((node) => node.data.selectionStatus === 1);

    // 2. If a directory contains both subdirectories and files, and all files are selected, replace
    // the selected files with a single pattern that matches all files in the directory (path/*).

    // Group the remaining nodes by their parent directory
    const groupedNodes = groupNodesByDirectory(remainingNodes);
    for (const dir in groupedNodes) {
        // Find the first node of group
        const firstNode = groupedNodes[dir][0];
        const parent = firstNode.parent;
        if (hasFilesAndDirs(firstNode)) {
            const siblings = getFileSiblings(firstNode);
            if (groupedNodes[dir].length === siblings.length) {
                // Push to glob only if the pattern is not already included
                if (parent && !pattern.includes(parent.data.path + "/*")) {
                    pattern.push(parent.data.path + "/*");
                }
                remainingNodes = filterNodesByGlob(
                    remainingNodes,
                    generateGlobPattern(pattern),
                ).filter((node) => node.data.selectionStatus === 1);
            }
        }
    }

    // 3. Finally, add "orphan paths" to the pattern, and create the final glob pattern

    remainingNodes.map((node) => pattern.push(node.data.path ?? ""));
    const globPattern = generateGlobPattern(pattern);
    return globPattern;
};

/**
 * Helper functions
 */

// Helper function that returns the number of selected children of a node
// Returned value is a string: "all", "some" or "none"
export const getSelectedChildrenStatus = (node: NodeApi<TreeNode>) => {
    const selectedChildren = node.children?.filter(
        (child) => child.data.selectionStatus === 1,
    );
    if (selectedChildren?.length === 0) {
        return "none";
    } else if (selectedChildren?.length === node.children?.length) {
        return "all";
    } else {
        return "some";
    }
};

// Helper function that takes in an array of nodes and a glob pattern,
// and returns an array of nodes that don't match the glob pattern.
function filterNodesByGlob(
    nodes: NodeApi<TreeNode>[],
    globPattern: string,
): NodeApi<TreeNode>[] {
    return nodes.filter((node) => {
        return !minimatch(node.data.path ?? "", globPattern, { dot: true });
    });
}

// Helper function that takes in a node and returns all its
// siblings, ie. nodes that share the same parent and are leafs (isLeaf)
function getFileSiblings(node: NodeApi<TreeNode>): NodeApi<TreeNode>[] {
    const parent = node.parent;
    if (parent) {
        return parent.children?.filter((child) => child.isLeaf) || [];
    }
    return [];
}

// Helper function which takes in an array of nodes
// and groups the nodes by their parent directory
function groupNodesByDirectory(nodes: NodeApi<TreeNode>[]): {
    [dir: string]: NodeApi<TreeNode>[];
} {
    const groupedNodes: { [dir: string]: NodeApi<TreeNode>[] } = {};
    nodes.forEach((node) => {
        const directory =
            node.data.path?.lastIndexOf("/") === -1
                ? ""
                : node.data.path?.substring(
                      0,
                      node.data.path.lastIndexOf("/") + 1,
                  );
        if (directory && !groupedNodes[directory]) {
            groupedNodes[directory] = [];
        }
        if (directory) groupedNodes[directory].push(node);
    });
    return groupedNodes;
}

// Helper function which returns true, if the directory the node is in
// contains both files (isLeaf) and subdirectories (isInternal).
function hasFilesAndDirs(node: NodeApi<TreeNode>): boolean {
    const parent = node.parent;
    const children = parent?.children;
    const nFiles = children?.filter((node) => node.isLeaf).length;
    const nDirs = children?.filter((node) => node.isInternal).length;
    if (nFiles && nFiles > 0 && nDirs && nDirs > 0) {
        return true;
    } else {
        return false;
    }
}

// Helper function to check if path1 is a subset of path2
function isPathSubset(path1: string, path2: string): boolean {
    // Remove "/**" from the paths before splitting them into parts
    const parts1 = path1.replace("/**", "").split("/");
    const parts2 = path2.replace("/**", "").split("/");
    return parts1.every((part, index) => part === parts2[index]);
}

// Helper function to remove lower-level paths from a string[] of paths
// Example: if the input is ["a/b/**", "a/**"], the output will be ["a/**"]
function removeInnerSubstitutions(paths: string[]): string[] {
    return paths.filter(
        (path, _, self) =>
            !self.some(
                (otherPath) =>
                    otherPath !== path && isPathSubset(otherPath, path),
            ),
    );
}

// Helper function that takes an array of file paths and groups them
// into a single glob pattern
function generateGlobPattern(paths: string[]): string {
    const patterns: string[] = [];

    // Group paths by directory
    const groupedPaths: { [key: string]: string[] } = {};
    paths.forEach((path) => {
        const directory =
            path.lastIndexOf("/") === -1
                ? ""
                : path.substring(0, path.lastIndexOf("/") + 1);
        const filename = path.substring(directory.length);
        if (!groupedPaths[directory]) {
            groupedPaths[directory] = [];
        }
        groupedPaths[directory].push(filename);
    });

    // Construct glob pattern for each directory
    for (const directory in groupedPaths) {
        const files = groupedPaths[directory];
        let pattern;
        // Handle root directory separately
        if (directory === "") {
            pattern = files.length === 1 ? files[0] : `{${files.join(",")}}`;
        } else {
            // Construct pattern based on the number of selected files
            pattern =
                files.length === 1
                    ? `${directory}${files[0]}`
                    : `${directory}{${files.join(",")}}`;
        }
        patterns.push(pattern);
    }

    // Join the patterns with ',' to create a single glob pattern
    let globPattern = patterns.join(",");

    // Surround the pattern with curly braces if it contains multiple patterns
    if (patterns.length > 1) {
        globPattern = `{${globPattern}}`;
    }

    return globPattern;
}

// Helper function that takes an internal node (directory) and returns
// all its descendants that have a selectionStatus of 1 (selected)
function getDescendants(node: NodeApi<TreeNode>): NodeApi<TreeNode>[] {
    const descendants: NodeApi<TreeNode>[] = [];
    if (node.children) {
        node.children.forEach((child) => {
            if (child.data.selectionStatus === 1) {
                descendants.push(child);
            } else {
                descendants.push(...getDescendants(child));
            }
        });
    }
    return descendants;
}

// Helper function that takes an internal node (directory) and if its selectionStatus
// is 1 (selected), removes it and all its descendants from the selectedNodes list
function removeNodeAndDescendants(
    node: NodeApi<TreeNode>,
    nodes: NodeApi<TreeNode>[],
) {
    if (node.data.selectionStatus === 1) {
        nodes = nodes.filter((n) => {
            return n !== node && !getDescendants(node).includes(n);
        });
    }
    return nodes;
}
