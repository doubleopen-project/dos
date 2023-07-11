// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import fs from 'fs';
import path from 'path';

// Iterate through all files in a directory and return an array of file paths

export const getFilePaths = async (dir: string): Promise<string[]> => {
    // Get the files as an array
    const filePaths: string[] = [];
    const directories: string[] = [dir];

    while (directories.length > 0) {
        const currentDir = directories.pop() as string;
        const files = await fs.promises.readdir(currentDir);
        // Loop them all with the new for...of
        for (const file of files) {
            // Get the full paths
            const fromPath = path.join(currentDir, file);

            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat(fromPath);

            if (stat.isFile()) {
                console.log("'%s' is a file.", fromPath);
                filePaths.push(fromPath);
            } else if (stat.isDirectory()) {
                console.log("'%s' is a directory.", fromPath);
                directories.push(fromPath);
            }
        }
    }

    return filePaths;
}