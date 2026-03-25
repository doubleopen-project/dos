// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { parseNamespaceAndName } from "common-helpers";
import { PackageURL } from "packageurl-js";

export const parsePurl = (purl: string) => {
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
        qualifiers: purl.split("#")[0].split("?")[1],
        subpath: parsedPurl.subpath,
    };
};
