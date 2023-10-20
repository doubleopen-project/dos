// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

export type TreeNode = {
    id: string;
    name: string;
    path?: string;
    fileSha256?: string;
    hasLicenseFindings: boolean;
    hasLicenseConclusions: boolean;
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
