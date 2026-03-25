// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { parseNamespaceAndName } from "common-helpers";
import { PackageURL } from "packageurl-js";

export const parsePurlAndQualifiers = (purl: string) => {
    const parsedPurl = PackageURL.fromString(purl);

    const npmPackagePath =
        parsedPurl.type === "npm" ? parseNamespaceAndName(purl) : undefined;

    return {
        type: parsedPurl.type,
        namespace:
            npmPackagePath?.namespace ??
            (parsedPurl.namespace
                ? decodeURIComponent(parsedPurl.namespace)
                : undefined),
        name: npmPackagePath?.name ?? parsedPurl.name,
        version: parsedPurl.version,
        qualifiers: parsedPurl.qualifiers,
        subpath: parsedPurl.subpath,
    };
};
