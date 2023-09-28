// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

export type TreeNode = {
    id: string;
    name: string;
    fileSha256?: string;
    hasLicenseFindings: boolean;
    file?: {
        licenseFindings: LicenseFindings[];
    };
    children?: TreeNode[];
};

export type LicenseFindings = {
    licenseExpressionSPDX?: string;
};