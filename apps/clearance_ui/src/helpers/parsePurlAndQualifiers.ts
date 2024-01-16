// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { PackageURL } from "packageurl-js";

export const parsePurlAndQualifiers = (purl: string) => {
    return PackageURL.fromString(purl);
};
