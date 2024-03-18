// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Test the curly braces in the glob pattern
import { validateCurlyBracesInGlob } from "@/helpers/validateCurlyBracesInGlob";

describe("Curly braces in glob pattern", () => {
    it("Matches properly curly braces with a prepending path", () => {
        expect(validateCurlyBracesInGlob("dir1/dir2/{file1,file2}")).toBe(true);
    });

    it("Doesn't match when there is no prepending path", () => {
        expect(validateCurlyBracesInGlob("{file1,file2}")).toBe(false);
    });

    it("Matches properly nested curly braces", () => {
        expect(
            validateCurlyBracesInGlob("dir1/dir2/{file1, dir3/{file3,file4}}"),
        ).toBe(true);
    });

    it("Doesn't match nested curly braces without a prepending path", () => {
        expect(validateCurlyBracesInGlob("{file1, dir3/{file3,file4}}")).toBe(
            false,
        );
    });
});
