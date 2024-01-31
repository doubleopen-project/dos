// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PackageURL } from "packageurl-js";

export const parsePurl = (purl: string) => {
    const parsedPurl = PackageURL.fromString(purl);

    let qualifiers = undefined;

    if (parsedPurl.qualifiers) {
        for (const [key, value] of Object.entries(parsedPurl.qualifiers)) {
            if (qualifiers) {
                qualifiers += "&" + key + "=" + encodeURIComponent(value);
            } else {
                qualifiers = key + "=" + encodeURIComponent(value);
            }
        }
    }
    return {
        type: parsedPurl.type,
        namespace: parsedPurl.namespace,
        name: parsedPurl.name,
        version: parsedPurl.version,
        qualifiers: qualifiers,
        subpath: parsedPurl.subpath,
    };
};
