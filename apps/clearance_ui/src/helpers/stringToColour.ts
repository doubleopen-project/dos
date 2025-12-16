// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { replaceSpecialCharacters } from "@/helpers/replaceSpecialCharacters";

export const stringToColour = (str: string) => {
    let hash = 0;
    str = replaceSpecialCharacters(str); // Normalize license ids
    str.split("").forEach((char) => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += value.toString(16).padStart(2, "0");
    }
    return colour;
};

export const stringToColourRGBA = (str: string, alpha: number) => {
    const colour = stringToColour(str);
    return `${colour}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
};

export const clearanceGroupColor = (groupName: string) => {
    return stringToColourRGBA(groupName + " doubleopen", 0.5);
};
