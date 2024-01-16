// SPDX-FileCopyrightText: 2023 Double Open Oy
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
    let packageName = parsedPurl.name + "@" + parsedPurl.version;
    if (parsedPurl.subpath) {
        packageName += "/" + parsedPurl.subpath;
    }
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <Badge className="rounded-md">{packageName}</Badge>
                </AccordionTrigger>
                <AccordionContent className="text-xs">
                    {parsedPurl.type && (
                        <p className="font-xs">
                            <b>Type:</b> {parsedPurl.type}
                        </p>
                    )}
                    {parsedPurl.namespace && (
                        <p className="font-xs">
                            <b>Namespace:</b> {parsedPurl.namespace}
                        </p>
                    )}
                    {parsedPurl.qualifiers &&
                        Object.entries(parsedPurl.qualifiers).map(
                            ([key, value]) => (
                                <p className="font-xs" key={key}>
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
