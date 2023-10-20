// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import CodeEditor from "./CodeEditor";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ButtonGroup from "./ButtonGroup";
import CurationForm from "./CurationForm";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;
type LicenseMatch = DataType["licenseFindings"][0]["licenseFindingMatches"][0];

type CodeInspectorProps = {
    purl: string | undefined;
    path: string | undefined;
};

const CodeInspector = ({ path, purl }: CodeInspectorProps) => {
    const [fileContents, setFileContents] = useState<string | undefined>(
        undefined,
    );
    const { data, isLoading, error } = userHooks.useGetFileData(
        { purl: purl as string, path: path as string },
        { withCredentials: true },
        { enabled: !!path && !!purl },
    );
    const fileUrl = data?.downloadUrl;

    // Fetch ASCII data from the URL
    useEffect(() => {
        if (fileUrl) {
            fetch(fileUrl)
                .then((response) => response.text()) // Assuming the data is text/ASCII
                .then((contents) => {
                    setFileContents(contents);
                })
                .catch((error) => console.error("Error fetching data:", error));
        }
    }, [fileUrl]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-row p-1 mb-2 rounded-md shadow-lg border items-center">
                <Label className="font-bold">File: </Label>
                {path ? (
                    <Badge className="rounded-md">{path}</Badge>
                ) : (
                    <Label className="text-sm">No file opened</Label>
                )}
            </div>

            {data?.licenseFindings[0] && (
                <div className="flex-row p-1 mb-2 rounded-md shadow-lg border items-center">
                    <Label className="font-semibold">Detected SPDX</Label>
                    <p className="p-1 rounded-md border text-xs">
                        {data.licenseFindings.map((license) => (
                            <span key={license.id}>
                                <>
                                    {
                                        new Date(license.updatedAt)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    : {license.licenseExpressionSPDX}
                                    <br />
                                </>
                            </span>
                        ))}
                    </p>
                </div>
            )}

            {data?.licenseFindings[0]?.licenseFindingMatches && (
                <div className="flex-row p-1 mb-2 rounded-md shadow-lg border items-center">
                    <Label className="font-semibold">
                        Individual license matches
                    </Label>
                    <div className="p-1 rounded-md border w-full max-h-[8vh] overflow-y-auto">
                        <ButtonGroup
                            data={data.licenseFindings[0].licenseFindingMatches}
                        />
                    </div>
                </div>
            )}

            {data?.licenseConclusions[0] && (
                <div className="flex-row p-1 mb-2 rounded-md shadow-lg border items-center">
                    <Label className="font-semibold">Curations</Label>
                    <p className="p-1 rounded-md border text-xs">
                        {data.licenseConclusions.map((license) => (
                            <span key={license.id}>
                                <>
                                    {
                                        new Date(license.updatedAt)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    : {license.concludedLicenseExpressionSPDX}
                                    <br />
                                </>
                            </span>
                        ))}
                    </p>
                </div>
            )}

            <div className="flex flex-1 justify-center items-center overflow-auto">
                {!path && (
                    <div className="flex justify-center items-center h-full">
                        No file opened
                    </div>
                )}
                {path && isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
                {data && fileContents && (
                    <CodeEditor
                        contents={fileContents}
                        licenseFindings={data.licenseFindings}
                    />
                )}
                {error && (
                    <div className="flex justify-center items-center h-full">
                        Unable to fetch file data
                    </div>
                )}
            </div>
            {data && purl && (
                <div className="p-1 mt-2 rounded-md shadow-lg border flex-row text-sm">
                    <CurationForm purl={purl} fileData={data} />
                </div>
            )}
        </div>
    );
};

export default CodeInspector;
