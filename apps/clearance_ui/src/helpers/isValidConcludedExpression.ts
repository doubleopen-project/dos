// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { parseSPDX } from "common-helpers";

export const isValidConcludedExpression = (concludedLicense: string) => {
    try {
        if (concludedLicense === "NONE" || concludedLicense === "NOASSERTION") {
            return {
                isValid: true,
                errWord: null,
            };
        }
        parseSPDX(concludedLicense);
        return {
            isValid: true,
            errWord: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            const errArr = error.message.split(" ");
            const errIndex = parseInt(errArr[errArr.length - 1]);

            // find word starting from errIndex in concluded expression:
            const concludedArr = concludedLicense.split(" ");
            let count = 0;
            let errWord = null;

            for (const word of concludedArr) {
                count += word.length;
                if (count >= errIndex) {
                    errWord = word;
                    break;
                }
                count += 1; // accounts for the space between words
            }
            return {
                isValid: false,
                errWord: errWord,
            };
        }
        return {
            isValid: false,
            errWord: null,
        };
    }
};
