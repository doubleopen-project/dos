// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const replaceANDExceptionWithWITHException = (expression: string) => {
    const regex = /AND\s+([\w-]*exception[\w-]*)/gi;

    return expression.replace(regex, (match, p1) => `WITH ${p1}`);
};
