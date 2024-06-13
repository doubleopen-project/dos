// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { TreeNode } from "@/types";

self.onmessage = async (event) => {
    // Extract the tree and license findings from the event data
    const { tree, filesWithLFs } = event.data;

    // Function to find paths with license findings in the tree
    const findPathsWithLFs = (
        tree: TreeNode[],
        fileSha256s: Set<string>,
    ): Set<string> => {
        let pathsWithLFs: Set<string> = new Set();

        for (const node of tree) {
            if (node.children) {
                pathsWithLFs = new Set([
                    ...pathsWithLFs,
                    ...findPathsWithLFs(node.children, fileSha256s),
                ]);

                const atLeastOneChildHasFinding = node.children.some((child) =>
                    pathsWithLFs.has(child.path),
                );

                if (atLeastOneChildHasFinding) {
                    pathsWithLFs.add(node.path);
                }
            } else {
                if (node.fileSha256 && fileSha256s.has(node.fileSha256)) {
                    pathsWithLFs.add(node.path);
                }
            }
        }
        return pathsWithLFs;
    };

    self.postMessage(findPathsWithLFs(tree, filesWithLFs));
};
