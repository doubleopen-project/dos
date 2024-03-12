// SPDX-FileCopyrightText: 2024 HH Partners
//
// SPDX-License-Identifier: MIT

import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

// Decide the provenance type based on purl details

export const getProvenanceType = (purl: string) => {
    const parsedPurl = parsePurlAndQualifiers(purl);
    return parsedPurl.qualifiers?.vcs_type
        ? "Repository"
        : parsedPurl.qualifiers?.download_url
          ? "Artifact"
          : "Unknown";
};
