// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const toPathPurl = (purl: string) => {
    return purl.replace(/\//g, "%2F").replace(/#/g, "%23");
};