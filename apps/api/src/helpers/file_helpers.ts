// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import admZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { downloadFile } from 's3-helpers';

// Fetching zip file from object storage
export const downloadZipFile = async (zipFileKey: string, downloadPath: string): Promise<boolean> => {
    if (!process.env.SPACES_BUCKET) {
        throw new Error("SPACES_BUCKET environment variable is missing");
    }
    return await downloadFile(process.env.SPACES_BUCKET, zipFileKey, downloadPath);
}

// Unzipping the file
export const unzipFile = async (downloadPath: string, extractPath: string): Promise<boolean> => {
    // Check that file exists
    const fileExists = fs.existsSync(downloadPath);

    if (fileExists) {
        const zip = new admZip(downloadPath);
        zip.extractAllTo(extractPath, true);
        return true;
    } else {
        return false;
    }
}

// Deleting local files
export const deleteLocalFiles = async (downloadPath: string, extractPath: string): Promise<void> => {
    fs.rmSync(extractPath, { recursive: true });
    fs.rmSync(downloadPath);
}

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