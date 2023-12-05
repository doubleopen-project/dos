// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Minimatch unit tests
import { isPathExcluded } from "@/helpers/isExcluded";

describe("Path exclusion tests", () => {
    it("Matches properly a single file", () => {
        const paths = ["package.json", "README.md", "dir1/dir2/file.txt"];
        for (const path of paths) {
            expect(isPathExcluded(path, path)).toBe(true);
        }
    });

    it("Doesn't match when the filename is different", () => {
        const paths = ["package.json", "README.md", "dir1/dir2/file.txt"];
        for (const path of paths) {
            expect(isPathExcluded(path, "file.txt")).toBe(false);
        }
    });

    it("Matches properly a file extension pattern", () => {
        const paths = [
            "package.json",
            "package-lock.json",
            "dir1/dir2/package.json",
        ];
        for (const path of paths) {
            expect(isPathExcluded(path, "**/*.json")).toBe(true);
        }
    });

    it("Doesn't match when the file extension is different", () => {
        const paths = [
            "package.json",
            "package-lock.json",
            "dir1/dir2/package.json",
        ];
        for (const path of paths) {
            expect(isPathExcluded(path, "**/*.txt")).toBe(false);
        }
    });

    it("Matches properly files in a directory", () => {
        const paths = [
            "dir1/dir2/package.json",
            "dir1/dir2/file1.ts",
            "dir1/dir2/file2.css",
        ];
        for (const path of paths) {
            expect(isPathExcluded(path, "dir1/dir2/*")).toBe(true);
        }
    });

    it("Doesn't match when the directory is different", () => {
        const paths = [
            "dir1/dir2/package.json",
            "dir1/dir2/file1.ts",
            "dir1/dir2/file2.css",
        ];
        for (const path of paths) {
            expect(isPathExcluded(path, "dir1/dir3/*")).toBe(false);
        }
    });

    it("Matches properly files in a directory recursively", () => {
        const paths = [
            "dir1/dir2/package.json",
            "dir1/dir2/file1.ts",
            "dir1/dir2/file2.css",
            "dir1/dir2/dir3/file3.ts",
            "dir1/dir2/dir3/file4.css",
        ];
        for (const path of paths) {
            expect(isPathExcluded(path, "dir1/dir2/**")).toBe(true);
        }
    });

    it("Doesn't match when the directory is different", () => {
        const paths = [
            "dir1/dir2/package.json",
            "dir1/dir2/file1.ts",
            "dir1/dir2/file2.css",
            "dir1/dir2/dir3/file3.ts",
            "dir1/dir2/dir3/file4.css",
        ];
        for (const path of paths) {
            expect(isPathExcluded(path, "dir1/dir3/**")).toBe(false);
        }
    });
});
