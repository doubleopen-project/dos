// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const replaceANDExceptionWithWITHException = (expression: string) => {
    // Regular expression to match ") AND <exception>" but not if exception starts with "LicenseRef"
    const regex1 = /\)\s+AND\s+(?!LicenseRef)([\w-]*exception[\w-]*)/gi;
    // Regular expression to match "AND <exception>" but not if exception starts with "LicenseRef"
    const regex2 = /AND\s+(?!LicenseRef)([\w-]*exception[\w-]*)/gi;

    const replaced = expression.replace(
        regex1,
        (match, p1) => `) AND LicenseRef-doubleopen-${p1}`,
    );

    return replaced.replace(regex2, (match, p1) => `WITH ${p1}`);
};
