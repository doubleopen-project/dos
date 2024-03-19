// SPDX-FileCopyrightText: 2024 HH Partners
//
// SPDX-License-Identifier: MIT

// Search for a license in a compound license expression
// Return a true if the license is found, false otherwise

export function searchForLicense(searchString: string, compoundString: string) {
    // Remove all occurrences of "(" and ")" from compound string
    const sanitizedCompoundString = compoundString.replace(/[()]/g, "");

    // Perform the search
    const regex = new RegExp(`\\b${searchString}\\b`);
    const matchFound = regex.test(sanitizedCompoundString);

    return matchFound;
}
