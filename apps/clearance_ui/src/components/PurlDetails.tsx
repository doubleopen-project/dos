// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

type Props = {
    purl: string;
};

const PurlDetails = ({ purl }: Props) => {
    const parsedPurl = parsePurlAndQualifiers(purl);
    return (
        <div>
            {parsedPurl.qualifiers &&
                Object.entries(parsedPurl.qualifiers).map(([key, value]) => (
                    <p key={key}>
                        <b>{key}:</b> {value}
                    </p>
                ))}
        </div>
    );
};

export default PurlDetails;
