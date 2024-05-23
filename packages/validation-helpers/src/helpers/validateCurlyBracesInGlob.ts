// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

export function validateCurlyBracesInGlob(globPattern: string): boolean {
    // In case no curly braces are used, to an early return with true
    if (!globPattern.includes("{")) {
        return true;
    }
    // Check that when using curly braces {} anywhere in the glob pattern,
    // it always has a prepending non-empty path. Examples of valid patterns:
    //   dir1/dir2/{file1,file2}
    //   dir1/dir2/{file1, dir3/{file3,file4}}
    const regex = /^[^{]*\/.*{.*}/;
    return regex.test(globPattern);
}
