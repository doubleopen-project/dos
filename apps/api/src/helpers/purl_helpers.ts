// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PackageURL } from "packageurl-js";

const isUrl = (str: string) => {
    try {
        new URL(str);
        return true;
    } catch (err) {
        return false;
    }
};

export const parsePurl = (purl: string) => {
    const parsedPurl = PackageURL.fromString(purl);

    let qualifiers = undefined;

    if (parsedPurl.qualifiers) {
        for (const [key, value] of Object.entries(parsedPurl.qualifiers)) {
            let valueToSet = value;

            if (isUrl(value)) {
                valueToSet = encodeURIComponent(value);
            }

            if (qualifiers) {
                qualifiers += "&" + key + "=" + valueToSet;
            } else {
                qualifiers = key + "=" + valueToSet;
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

// Replace %2F with / in, and /@ with /%40 in purl (in the purl spec, @ is used to separate the package name and the version)
export const formatPurl = (purl: string) => {
    return purl.replace(/%2F/g, "/").replace(/\/@/g, "/%40");
};
