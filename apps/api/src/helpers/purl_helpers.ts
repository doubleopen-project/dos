// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PackageURL } from "packageurl-js";

export const parsePurl = (purl: string) => {
    const parsedPurl = PackageURL.fromString(purl);

    return {
        type: parsedPurl.type,
        namespace: parsedPurl.namespace,
        name: parsedPurl.name,
        version: parsedPurl.version,
        qualifiers: purl.split("#")[0].split("?")[1],
        subpath: parsedPurl.subpath,
    };
};
