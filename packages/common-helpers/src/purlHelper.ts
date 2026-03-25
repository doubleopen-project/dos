// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

/**
 * Parses the namespace and name from a purl string, preserving the casing.
 *
 * It is assumed that the input purl has already been validated to be a valid Package-URL,
 * so the namespace and name can be extracted by splitting the string. The casing of the
 * name and namespace is preserved as it is in the input purl.
 */
export const parseNamespaceAndName = (
    purl: string,
): { namespace: string | undefined; name: string } => {
    const namespaceAndNameParts = purl
        .split("#")[0] // Strip the subpath part if it exists
        .split("?")[0] // Strip the qualifiers part if it exists
        .split("@")[0] // Strip the version part if it exists
        .split(":")[1] // Strip the scheme part
        .split("/")
        .slice(1); // Strip the type part

    return {
        namespace:
            namespaceAndNameParts.length > 1
                ? decodeURIComponent(namespaceAndNameParts[0])
                : undefined,
        name: namespaceAndNameParts[namespaceAndNameParts.length - 1],
    };
};

export const getCleanPurl = (
    type: string,
    namespace: string | undefined,
    name: string,
    version: string | undefined,
) => {
    return `pkg:${type}/${namespace ? `${encodeURIComponent(namespace)}/` : ""}${name}${version ? `@${encodeURIComponent(version)}` : ""}`;
};
