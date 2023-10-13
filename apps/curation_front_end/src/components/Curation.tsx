// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQuery } from "@tanstack/react-query";
import * as yaml from "js-yaml";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { parseAsString, useQueryState } from "next-usequerystate";
import CurationDB from "./CurationDB";
import CurationLicense from "./CurationLicense";
import CurationSPDX from "./CurationSPDX";
import { userHooks } from "@/hooks/zodiosHooks";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type Props = {
    fileData?: DataType;
};

const fetchAndConvertYAML = async (): Promise<any> => {
    const response = await fetch(
        "https://raw.githubusercontent.com/doubleopen-project/policy-configuration/main/license-classifications.yml",
    );
    if (response.ok) {
        const yamlText = await response.text();
        const jsonData = yaml.load(yamlText) as {
            categorizations: { id: string }[];
        };
        const ids = jsonData.categorizations.map((item) => item.id);
        const sortedIds = ids.sort((a, b) => a.localeCompare(b));
        return sortedIds;
    } else {
        throw new Error(
            `Failed to fetch YAML file: ${response.status} ${response.statusText}`,
        );
    }
};

const Curation = ({ fileData }: Props) => {
    const [curationOption, setCurationOption] = useQueryState(
        "curationOption",
        parseAsString.withDefault("choose-existing"),
    );
    // Fetch the license classifications from Github
    const { data, isLoading, error } = useQuery({
        queryKey: ["license-classifications"],
        queryFn: fetchAndConvertYAML,
        staleTime: 60 * 60 * 1000, // 1 hour
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    const handleRadioChange = (e: string) => {
        setCurationOption(e);
    };

    return (
        <div className=" flex flex-col w-full">
            <Label className="font-bold mb-2">Curation:</Label>

            <div className="p-2 mb-1 rounded-md bg-slate-300 flex items-center justify-between">
                <RadioGroup
                    defaultValue="choose-existing"
                    value={curationOption}
                    orientation="horizontal"
                    onValueChange={handleRadioChange}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="choose-existing" id="r1" />
                        <Label htmlFor="r1" className="text-xs">
                            Choose an existing curation
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="choose-from-list" id="r2" />
                        <Label htmlFor="r2" className="text-xs">
                            Choose a license from a list
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="choose-write-SPDX" id="r3" />
                        <Label htmlFor="r3" className="text-xs">
                            Write an SPDX expression
                        </Label>
                    </div>
                </RadioGroup>
                <Button className="text-xs p-1 rounded-lg">Add curation</Button>
            </div>

            {curationOption === "choose-existing" && (
                <div className="mb-1">
                    <CurationDB
                        data={fileData}
                        filterString={"curation"}
                        selectText="Select curation..."
                        fractionalWidth={0.75}
                    />
                </div>
            )}

            {curationOption === "choose-from-list" && (
                <div className="mb-1">
                    <CurationLicense
                        data={data}
                        filterString={"curation"}
                        selectText="Select license..."
                        fractionalWidth={0.75}
                    />
                </div>
            )}

            {curationOption === "choose-write-SPDX" && (
                <div className="mb-1">
                    <CurationSPDX
                        filterString={"curation"}
                        selectText={"Write your SPDX expression here..."}
                    />
                </div>
            )}

            <Textarea
                placeholder="Comment on your curation..."
                id="comment"
            ></Textarea>
        </div>
    );
};

function addCuration(
    fileData: DataType,
    contextPurl: string,
    spdx: string,
    comment: string,
) {
    const { data, isLoading, error } = userHooks.useImmutableQuery(
        "/license-conclusion",
        {
            fileSha256: fileData.sha256,
            detectedLicenseExpressionSPDX:
                fileData.licenseFindings[0].licenseExpressionSPDX,
            concludedLicenseExpressionSPDX: spdx,
            comment: comment,
            contextPurl: contextPurl,
        },
    );

    if (data) {
        console.log("Curation added:", data);
    } else {
        console.log("Error adding curation:", error);
    }
}

export default Curation;
