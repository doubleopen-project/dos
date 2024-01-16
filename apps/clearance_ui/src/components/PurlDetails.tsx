// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import {
    parsePurl,
    parseQualifiers,
} from "../../../../apps/api/src/helpers/purl_helpers";

const PurlDetails = (purl: string) => {
    return (
        <div>
            <p>Type: {parsePurl(purl).type}</p>
            <p>Namespace: {parsePurl(purl).namespace}</p>
            <p>Name: {parsePurl(purl).name}</p>
            <p>Qualifiers: {parsePurl(purl).qualifiers}</p>
        </div>
    );
};

export default PurlDetails;
