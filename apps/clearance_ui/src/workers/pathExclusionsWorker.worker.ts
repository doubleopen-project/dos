// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { minimatch } from "minimatch";
import { TreeNode } from "@/types";

self.onmessage = async (event) => {
    // Extract the tree and path exclusion patterns from the event data
    const { tree, pathExclusionPatterns } = event.data;

    // Function to find excluded paths in the tree
    const findExcludedPaths = (
        tree: TreeNode[],
        pathExclusionPatterns: string[],
    ): Set<string> => {
        let excludedPaths: Set<string> = new Set();

        for (const node of tree) {
            if (node.children) {
                excludedPaths = new Set([
                    ...excludedPaths,
                    ...findExcludedPaths(node.children, pathExclusionPatterns),
                ]);

                const allChildrenExcluded = node.children.every((child) =>
                    excludedPaths.has(child.path),
                );

                if (allChildrenExcluded) {
                    excludedPaths.add(node.path);
                }
            } else {
                for (const pattern of pathExclusionPatterns) {
                    if (minimatch(node.path, pattern, { dot: true })) {
                        excludedPaths.add(node.path);
                        break;
                    }
                }
            }
        }
        return excludedPaths;
    };

    self.postMessage(findExcludedPaths(tree, pathExclusionPatterns));
};
