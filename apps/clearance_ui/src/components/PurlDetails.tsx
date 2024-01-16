// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { parsePurlAndQualifiers } from "../../../../apps/api/src/helpers/purl_helpers";

const PurlDetails = (purl: string) => {
    const parsedPurl = parsePurlAndQualifiers(purl);
    return (
        <div>
            <p>Type: {parsedPurl.type}</p>
            <p>Namespace: {parsedPurl.namespace}</p>
            <p>Name: {parsedPurl.name}</p>
            <p>Qualifiers:</p>
            {parsedPurl.qualifiers &&
                Object.entries(parsedPurl.qualifiers).map(([key, value]) => (
                    <p key={key}>
                        {key}: {value}
                    </p>
                ))}
        </div>
    );
};

export default PurlDetails;
