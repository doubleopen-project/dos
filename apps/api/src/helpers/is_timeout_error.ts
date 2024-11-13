// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const isTimeoutError = (scanError: string): boolean => {
    const timeoutErrorRegex =
        "(ERROR: for scanner: (?<scanner>\\w+):\n)?" +
        "ERROR: Processing interrupted: timeout after (?<timeout>\\d+) seconds.";
    const timeoutErrorMatch = scanError.match(timeoutErrorRegex);

    return timeoutErrorMatch !== null;
};
