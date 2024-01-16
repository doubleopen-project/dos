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

export const parseQualifiers = (qualifiers: string) => {
    const parsedQualifiers: { [key: string]: string } = {};
    const qualifiersArray = qualifiers.split("&");

    for (const qualifier of qualifiersArray) {
        const [key, value] = qualifier.split("=");
        parsedQualifiers[key] = decodeURIComponent(value);
    }
    return parsedQualifiers;
};
