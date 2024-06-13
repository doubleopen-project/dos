// SPDX-FileCopyrightText: 2024 HH Partners
//
// SPDX-License-Identifier: MIT

import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { TreeNode } from "@/types";

type LFDataType = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseFindingsForPackage"
>;

export const findNodesWithLicense = (
    root: TreeNode[],
    licenseSearchText: string,
    lfData: LFDataType,
): TreeNode[] => {
    const filesWithSearchedLC = lfData.licenseFindings
        .filter((lf) =>
            lf.licenseExpressionSPDX
                ?.toLowerCase()
                .includes(licenseSearchText.toLowerCase()),
        )
        .map((lf) => lf.fileSha256);

    const nodesWithLicense: TreeNode[] = [];

    const recursiveSearch = (node: TreeNode): void => {
        // If node has children, check if any of them have the license
        if (node.children) {
            for (const child of node.children) {
                recursiveSearch(child);
            }

            const atLeastOneChildHasFinding = node.children.some((child) =>
                nodesWithLicense.some((n) => n.id === child.id),
            );

            if (atLeastOneChildHasFinding) {
                nodesWithLicense.push(node);
            }
        } else {
            // If node is a leaf, check if it has the license
            const hasLicense = node.fileSha256
                ? filesWithSearchedLC.includes(node.fileSha256)
                : false;

            if (hasLicense) {
                nodesWithLicense.push(node);
            }
        }
    };

    for (const node of root) {
        recursiveSearch(node);
    }

    return nodesWithLicense;
};
