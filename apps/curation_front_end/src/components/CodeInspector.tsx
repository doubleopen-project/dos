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
            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow-lg">
                <Label className="font-bold">File: </Label>
                {path ? (
                    <Badge className="rounded-md">{path}</Badge>
                ) : (
                    <Label className="text-sm">No file opened</Label>
                )}
            </div>

            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow-lg items-center">
                {data?.licenseFindings[0] ? (
                    <>
                        <Label className="p-1 text-sm">
                            Detected SPDX license expression for the whole file
                        </Label>
                        <p className="p-1 m-1 rounded-md bg-slate-300 shadow items-center text-xs">
                            {data.licenseFindings.map((license) => (
                                <span key={license.id}>
                                    <>
                                        {new Date(
                                            license.updatedAt,
                                        ).toISOString()}
                                        : {license.licenseExpressionSPDX}
                                        <br />
                                    </>
                                </span>
                            ))}
                        </p>
                    </>
                ) : (
                    <Label className="p-1 text-sm">
                        No license found from this file
                    </Label>
                )}
            </div>

            {data?.licenseFindings[0]?.licenseFindingMatches && (
                <div className="flex-row p-2 mb-2 rounded-md bg-white shadow-lg items-center">
                    <Label className="text-sm">
                        Individual license matches
                    </Label>
                    <div className="bg-slate-300 p-1 rounded-md w-full max-h-[20vh] overflow-y-auto shadow">
                        <ButtonGroup
                            data={data.licenseFindings[0].licenseFindingMatches}
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-1 justify-center items-center overflow-auto bg-gray-100">
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
                <div className="p-2 mt-2 rounded-md bg-white shadow-lg flex-row text-sm">
                    <CurationForm purl={purl} fileData={data} />
                </div>
            )}
        </div>
    );
};

export default CodeInspector;
