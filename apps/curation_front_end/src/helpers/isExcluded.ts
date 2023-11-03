// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT
import { minimatch } from "minimatch";

export function isPathExcluded(path: string, pathExclusionPattern: string) {
    return minimatch(path, pathExclusionPattern, { dot: true });
}
