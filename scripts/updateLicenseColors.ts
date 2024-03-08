// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import fs from "fs";
import * as yaml from "js-yaml";
import { stringToColour } from "../apps/clearance_ui/src/helpers/stringToColour";

// Fetch all original unescaped license keys from the YAML file
const fetchAndConvertYAML = async () => {
    const response = await fetch(
        "https://raw.githubusercontent.com/doubleopen-project/policy-configuration/main/license-classifications.yml",
    );
    if (response.ok) {
        const yamlText = await response.text();
        const jsonData = yaml.load(yamlText) as {
            categorizations: { id: string }[];
        };
        const ids = jsonData.categorizations.map((item) => item.id);
        const sortedIds = ids.sort((a, b) => a.localeCompare(b));
        return sortedIds;
    } else {
        throw new Error(
            `Failed to fetch YAML file: ${response.status} ${response.statusText}`,
        );
    }
};

// Replace all -, ., and whitespace characters with underscores
export const replaceSpecialCharacters = (licenseId: string) => {
    return licenseId.replace(/[-.\s]/g, "_");
};

// Using stringToColour function, convert the license keys to colors
const convertToColors = (licenseIds: string[]) => {
    const licenseColors: { [key: string]: string } = {};
    for (const id of licenseIds) {
        licenseColors[id] = stringToColour(id);
    }
    return licenseColors;
};

// Write the results of the stringToColour function to a file in a format
// export const licenseColors = {
//    MIT: "#ff0000",
//    GPL_2_0_only: "#00ff00",
//    ...
// };

// Use an async function to wait for the Promise to resolve
const printLicenseIds = async () => {
    try {
        const spdxExpressions = await fetchAndConvertYAML();
        const escapedLicenseIds = spdxExpressions.map(replaceSpecialCharacters);
        const licenseColors = convertToColors(escapedLicenseIds);
        const formattedLicenseColors = JSON.stringify(licenseColors, null, 4);
        const fileContent = `export const licenseColors = ${formattedLicenseColors};`;
        // Write the file content to a file
        // Replace FILEPATH with the actual file path where you want to write the file
        // For example: /home/etsija/dos/scripts/licenseColors.ts
        // Make sure the directory exists and you have write permissions
        // You can use the fs module or any other file writing mechanism of your choice
        // Example using fs module:
        fs.writeFileSync("./licenseColors.ts", fileContent);
        console.log(fileContent);
    } catch (error) {
        console.error(error);
    }
};

// Call the async function
printLicenseIds();
