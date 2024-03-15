// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import path from "path";
import globParent from "glob-parent";
import isValid from "is-valid-path";

// This function is used to extract a string from a glob, to be used in database
// queries, to reduce the amount of filetree paths that will be compared with the glob.
export const extractStringFromGlob = (glob: string) => {
    // The return values below won't be applicable to a glob that contains
    // list of files/globs inside curly braces
    if (glob.startsWith("{")) return undefined;
    const nonMagicParentPath = globParent(glob);
    // Case where the parent path is not magic
    if (nonMagicParentPath !== ".") return nonMagicParentPath;
    else {
        const globParts = glob.split("/").filter((part) => isValid(part));
        // Case where the parent path is magic, but there are non-magic parts in the glob
        if (globParts.length > 0) return globParts[0];
        else {
            // Case where the parent path is magic and all the parts of the glob are magic
            // but an extension is present
            if (path.extname(glob) !== "") return path.extname(glob);
            // Case where the parent path is magic and all the parts of the glob are magic
            else return undefined;
        }
    }
};
