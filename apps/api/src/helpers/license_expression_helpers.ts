// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const replaceANDExceptionWithANDPrefixException = (
    expression: string,
) => {
    // Regular expression to match "AND <exception>" but not if exception starts with "LicenseRef"
    const regex = /AND\s+(?!LicenseRef)([\w-]*exception[\w-]*)/gi;

    return expression.replace(
        regex,
        (match, p1) => `AND LicenseRef-doubleopen-${p1}`,
    );
};
