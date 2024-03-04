// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Unit tests for some helper functions of tree selection utils

import {
    generateGlobPattern,
    isPathSubset,
    removeInnerSubstitutions,
} from "@/helpers/treeSelectionUtils";

describe("Tree selection helper function tests", () => {
    it("Finds that path1 is a subset of path2", () => {
        const paths = ["dir1/dir2/**", "dir1/dir2/dir3/**"];
        expect(isPathSubset(paths[0], paths[1])).toBe(true);
    });
    it("Finds that path1 is not a subset of path2", () => {
        const paths = ["dir1/dir2/**", "dir1/dir4/**"];
        expect(isPathSubset(paths[0], paths[1])).toBe(false);
    });
    it("Removes inner substitutions from a path", () => {
        const paths = [
            "dir1/dir2/**",
            "dir1/dir2/dir3/**",
            "dir1/dir2/dir4/**",
            "dir1/dir2/dir3/dir4/**",
        ];
        expect(removeInnerSubstitutions(paths)).toEqual(["dir1/dir2/**"]);
    });
    it("Doesn't remove any substitutions when no inner paths exist", () => {
        const paths = ["dir1/dir2/**", "dir1/dir3/**"];
        expect(removeInnerSubstitutions(paths)).toEqual(paths);
    });
    it("Generates a glob pattern from a set of filepaths", () => {
        const paths = [
            "dir1/**",
            "dir1/dir2/file1.ts",
            "dir1/dir2/file2.ts",
            "dir1/dir2/file3.ts",
        ];
        expect(generateGlobPattern(paths)).toEqual(
            "{dir1/**,dir1/dir2/{file1.ts,file2.ts,file3.ts}}",
        );
    });
});
