// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ZodiosBodyByPath, ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { parseAsString, useQueryState } from "next-usequerystate";
import CurationDB from "./CurationDB";
import CurationLicense from "./CurationLicense";
import CurationSPDX from "./CurationSPDX";
import { userHooks } from "@/hooks/zodiosHooks";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;
type LicenseConclusionPostData = ZodiosBodyByPath<
    typeof userAPI,
    "post",
    "/license-conclusion"
>;

type Props = {
    purl: string;
    fileData?: DataType;
};

const Curation = ({ purl, fileData }: Props) => {
    const [curationOption, setCurationOption] = useQueryState(
        "curationOption",
        parseAsString.withDefault("choose-existing"),
    );
    const [curation, setCuration] = useState<LicenseConclusionPostData>({
        concludedLicenseExpressionSPDX: "",
        detectedLicenseExpressionSPDX:
            fileData?.licenseConclusions[0]?.detectedLicenseExpressionSPDX ??
            "",
        comment: "",
        contextPurl: purl,
        fileSha256: fileData?.sha256 ?? "",
    });

    useEffect(() => {
        console.log("Curation state has changed:", curation);
    }, [curation]);

    const setConcludedLicenseExpressionSPDX = (newSPDX: string | null) => {
        setCuration({
            ...curation,
            concludedLicenseExpressionSPDX: newSPDX || "",
        });
    };

    const { mutate: addLicenseConclusion } = userHooks.useMutation(
        "post",
        "/license-conclusion",
        {
            withCredentials: true,
        },
    );

    const submitCuration = (
        licenseConclusionData: LicenseConclusionPostData,
    ) => {
        console.log("Submitting curation:", licenseConclusionData);
        //addLicenseConclusion(licenseConclusionData);
    };

    const handleRadioChange = (e: string) => {
        setCurationOption(e);
    };

    return (
        <div className="flex flex-col w-full">
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
                <Button
                    className="text-xs p-1 rounded-lg"
                    onClick={() => submitCuration(curation)}
                >
                    Add curation
                </Button>
            </div>

            {curationOption === "choose-existing" && (
                <div className="mb-1">
                    <CurationDB
                        data={fileData}
                        concludedLicenseExpressionSPDX={
                            curation.concludedLicenseExpressionSPDX
                        }
                        setConcludedLicenseExpressionSPDX={
                            setConcludedLicenseExpressionSPDX
                        }
                        fractionalWidth={0.75}
                    />
                </div>
            )}

            {curationOption === "choose-from-list" && (
                <div className="mb-1">
                    <CurationLicense
                        concludedLicenseExpressionSPDX={
                            curation.concludedLicenseExpressionSPDX
                        }
                        setConcludedLicenseExpressionSPDX={
                            setConcludedLicenseExpressionSPDX
                        }
                        fractionalWidth={0.75}
                    />
                </div>
            )}

            {curationOption === "choose-write-SPDX" && (
                <div className="mb-1">
                    <CurationSPDX
                        concludedLicenseExpressionSPDX={
                            curation.concludedLicenseExpressionSPDX
                        }
                        setConcludedLicenseExpressionSPDX={
                            setConcludedLicenseExpressionSPDX
                        }
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

export default Curation;
