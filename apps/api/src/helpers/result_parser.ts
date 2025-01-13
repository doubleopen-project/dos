// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Parse a result string, and any nested JSON strings to JSON objects
export const parseResult = (result: string) => {
    return JSON.parse(result, (_key: string, value: string | undefined) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value) as string | undefined;
                // Disable eslint rule for unused variable as the error needs to be caught, but not used.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                return value;
            }
        }
        return value;
    });
};
