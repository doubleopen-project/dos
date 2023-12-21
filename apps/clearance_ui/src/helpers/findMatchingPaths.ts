// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { minimatch } from "minimatch";

export function findMatchingPaths(
    paths: string[],
    globPattern: string,
): string[] {
    // Initialize an empty array to store matching strings
    const matchingPaths: string[] = [];

    // Iterate through the input strings
    for (const path of paths) {
        // Use minimatch to check if the inputString matches the globPattern
        if (minimatch(path, globPattern, { dot: true })) {
            // If it matches, add it to the matchingStrings array
            matchingPaths.push(path);
        }
    }

    // Return the array of matching strings
    return matchingPaths;
}
