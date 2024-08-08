// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Parse a result string, and any nested JSON strings to JSON objects
export const parseResult = (result: string) => {
    return JSON.parse(result, (_key: string, value: string | undefined) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value) as string | undefined;
            } catch (error) {
                return value;
            }
        }
        return value;
    });
};
