// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { PackageURL } from "packageurl-js";

export const parsePurlAndQualifiers = (purl: string) => {
    const parsedPurl = PackageURL.fromString(purl);
    const parsedQualifiers = parsedPurl.qualifiers;
    return { ...parsedPurl, ...parsedQualifiers };
};
