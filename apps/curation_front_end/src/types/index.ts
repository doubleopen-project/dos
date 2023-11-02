// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { NodeApi } from "react-arborist";

export type TreeNode = {
    id: string;
    name: string;
    path?: string;
    fileSha256?: string;
    hasLicenseFindings: boolean;
    hasLicenseConclusions: boolean;
    isExcluded?: boolean;
    file?: {
        licenseFindings: LicenseFindings[];
        licenseConclusions: LicenseConclusions[];
    };
    children?: TreeNode[];
};

export type LicenseFindings = {
    licenseExpressionSPDX?: string;
};

export type LicenseConclusions = {
    concludedLicenseExpressionSPDX?: string;
};

// A type for the selected node that is passed to the exclusion form
export type SelectedNode = Omit<
    NodeApi<TreeNode>,
    "name, hasLicenseFIndings, hasLicenseConclusions"
>;
