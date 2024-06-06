// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { TreeNode } from "@/types";

self.onmessage = async (event) => {
    // Extract the tree and license conclusions from the event data
    const { tree, filesWithLCs } = event.data;

    // Function to find concluded paths in the tree

    const findConcludedPaths = (
        tree: TreeNode[],
        fileSha256s: Set<string>,
    ): Set<string> => {
        let concludedPaths: Set<string> = new Set();

        for (const node of tree) {
            if (node.children) {
                concludedPaths = new Set([
                    ...concludedPaths,
                    ...findConcludedPaths(node.children, fileSha256s),
                ]);

                const atLeastOneChildConcluded = node.children.some((child) =>
                    concludedPaths.has(child.path),
                );

                if (atLeastOneChildConcluded) {
                    concludedPaths.add(node.path);
                }
            } else {
                if (node.fileSha256 && fileSha256s.has(node.fileSha256)) {
                    concludedPaths.add(node.path);
                }
            }
        }
        return concludedPaths;
    };

    self.postMessage(findConcludedPaths(tree, filesWithLCs));
};
