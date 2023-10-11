// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import admZip from "adm-zip";
import fs from "fs";
import path from "path";

import { downloadFile } from "s3-helpers";
import crypto from "crypto";

// Fetching zip file from object storage
export const downloadZipFile = async (
    zipFileKey: string,
    downloadPath: string,
): Promise<boolean> => {
    if (!process.env.SPACES_BUCKET) {
        throw new Error("SPACES_BUCKET environment variable is missing");
    }
    return await downloadFile(
        process.env.SPACES_BUCKET,
        zipFileKey,
        downloadPath,
    );
};

// Unzipping the file
export const unzipFile = async (
    downloadPath: string,
    extractPath: string,
): Promise<boolean> => {
    // Check that file exists
    const fileExists = fs.existsSync(downloadPath);

    if (fileExists) {
        const zip = new admZip(downloadPath);
        zip.extractAllTo(extractPath, true);
        return true;
    } else {
        return false;
    }
};

// Deleting local files
export const deleteLocalFiles = async (
    downloadPath: string,
    extractPath: string,
): Promise<void> => {
    fs.rmSync(extractPath, { recursive: true });
    fs.rmSync(downloadPath);

    if (fs.existsSync(downloadPath)) {
        throw new Error("Error: downloadPath still exists");
    }

    if (fs.existsSync(extractPath)) {
        throw new Error("Error: extractPath still exists");
    }
};

// Iterate through all files in a directory and return an array of file hashes and paths
export const getFileHashesMappedToPaths = async (
    baseDir: string,
): Promise<{
    filesCount: number;
    fileHashesAndPaths: Map<string, string[]>;
}> => {
    // Get the file paths as an array
    const fileHashesAndPaths = new Map<string, string[]>();
    const directories: string[] = [baseDir];

    let filesCount = 0;

    while (directories.length > 0) {
        const currentDir = directories.pop() as string;

        const curDirNoBase = currentDir.split(baseDir).pop();

        if (curDirNoBase === ".git") {
            // Skipping .git directory
            continue;
        }

        const files = await fs.promises.readdir(currentDir);

        for (const file of files) {
            if (file === ".gitignore") {
                // Skipping .gitignore file
                continue;
            }

            // Get the full paths
            const fromPath = path.join(currentDir, file);

            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat(fromPath);

            if (stat.isFile()) {
                filesCount++;
                // Get sha256 hash of the file
                const fileBuffer = fs.readFileSync(fromPath);
                const hashSum = crypto.createHash("sha256");

                hashSum.update(fileBuffer);

                const filePath = fromPath.split(baseDir).pop();

                const hex = hashSum.digest("hex");

                // If Map contains the hash, add the path to the array
                if (fileHashesAndPaths.has(hex)) {
                    const paths = fileHashesAndPaths.get(hex) as string[];
                    paths.push(filePath as string);
                    fileHashesAndPaths.set(hex, paths);
                    continue;
                }
                // Otherwise, create a new entry
                fileHashesAndPaths.set(hex, [filePath as string]);
            } else if (stat.isDirectory()) {
                directories.push(fromPath);
            }
        }
    }

    return {
        filesCount: filesCount,
        fileHashesAndPaths: fileHashesAndPaths,
    };
};
