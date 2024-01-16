// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

type Props = {
    purl: string;
};

const PurlDetails = ({ purl }: Props) => {
    const parsedPurl = parsePurlAndQualifiers(purl);
    const packageName =
        (parsedPurl.namespace ? parsedPurl.namespace + "/" : "") +
        parsedPurl.name +
        "@" +
        parsedPurl.version +
        (parsedPurl.subpath ? "/" + parsedPurl.subpath : "");

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <Badge className="rounded-md">{packageName}</Badge>
                </AccordionTrigger>
                <AccordionContent className="text-xs">
                    {parsedPurl.type && (
                        <p>
                            <b>Type:</b> {parsedPurl.type}
                        </p>
                    )}
                    {parsedPurl.qualifiers &&
                        Object.entries(parsedPurl.qualifiers).map(
                            ([key, value]) => (
                                <p key={key}>
                                    <b>{key}:</b> {value}
                                </p>
                            ),
                        )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default PurlDetails;
