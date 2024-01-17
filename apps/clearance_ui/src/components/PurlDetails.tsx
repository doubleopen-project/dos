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
    const mainPurl =
        "pkg:" +
        (parsedPurl.type ? parsedPurl.type + "/" : "") +
        (parsedPurl.namespace ? parsedPurl.namespace + "/" : "") +
        parsedPurl.name +
        (parsedPurl.version ? "@" + parsedPurl.version : "");

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <Badge className="break-all rounded-md px-1">
                        {mainPurl}
                    </Badge>
                </AccordionTrigger>
                <AccordionContent className="text-xs">
                    {parsedPurl.subpath && (
                        <p>
                            <b>Subpath:</b> {parsedPurl.subpath}
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
