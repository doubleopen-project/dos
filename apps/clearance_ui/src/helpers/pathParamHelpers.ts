// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const toPathPurl = (purl: string) => {
    return encodeURIComponent(purl);
};

export const toPathPath = (path: string) => {
    return path.replace(/\//g, "%2F");
};
