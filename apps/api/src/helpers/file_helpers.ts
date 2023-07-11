// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import fs from 'fs';
import path from 'path';

// Iterate through all files in a directory and return an array of file paths

export const getFilePaths = async (baseDir: string): Promise<string[]> => {
    // Get the file paths as an array
    const filePaths: string[] = [];
    const directories: string[] = [baseDir];

    while (directories.length > 0) {
        const currentDir = directories.pop() as string;

        const files = await fs.promises.readdir(currentDir);

        for (const file of files) {
            // Get the full paths
            const fromPath = path.join(currentDir, file);

            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat(fromPath);

            if (stat.isFile()) {
                const filePath = fromPath.split('/tmp/extracted/').pop();
                filePaths.push(filePath as string);
            } else if (stat.isDirectory()) {
                directories.push(fromPath);
            }
        }
    }

    return filePaths;
}