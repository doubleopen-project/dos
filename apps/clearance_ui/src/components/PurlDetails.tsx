// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { PackageURL } from "packageurl-js";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import CopyToClipboard from "@/components/CopyToClipboard";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

type Props = {
    purl: string;
};

const PurlDetails = ({ purl }: Props) => {
    const parsedPurl = parsePurlAndQualifiers(purl);
    const mainPurl = new PackageURL(
        parsedPurl.type,
        parsedPurl.namespace,
        parsedPurl.name,
        parsedPurl.version,
        null,
        null,
    ).toString();

    return (
        <div className="flex justify-between">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <Label className="break-all px-1 text-xs">
                            {mainPurl}
                        </Label>
                    </AccordionTrigger>

                    <AccordionContent className="text-xs">
                        {parsedPurl.qualifiers &&
                            Object.entries(parsedPurl.qualifiers).map(
                                ([key, value]) => (
                                    <p key={key}>
                                        <b>{key}:</b> {value}
                                    </p>
                                ),
                            )}
                        {parsedPurl.subpath && (
                            <p>
                                <b>Subpath:</b> {parsedPurl.subpath}
                            </p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <CopyToClipboard copyText={mainPurl} />
        </div>
    );
};

export default PurlDetails;
