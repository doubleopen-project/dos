// SPDX-FileCopyrightText: 2024 HH Partners
//
// SPDX-License-Identifier: MIT

// Replace all -, ., and whitespace characters with underscores

export const replaceSpecialCharacters = (licenseId: string) => {
    return licenseId.replace(/[-.\s]/g, "_");
};
