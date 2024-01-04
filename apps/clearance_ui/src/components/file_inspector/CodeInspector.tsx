// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ButtonGroup from "@/components/file_inspector/ButtonGroup";
import CodeEditor from "@/components/file_inspector/CodeEditor";
import ConclusionForm from "@/components/license_conclusions/ConclusionForm";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type CodeInspectorProps = {
    purl: string;
    path: string | undefined;
};

const CodeInspector = ({ path, purl }: CodeInspectorProps) => {
    const [fileContents, setFileContents] = useState<string | undefined>(
        undefined,
    );
    const { data, isLoading, error } = userHooks.useGetFileData(
        { purl: purl, path: path as string },
        { withCredentials: true },
        { enabled: !!path && !!purl },
    );
    const fileSha256 = data?.sha256;
    const pathPurl = toPathPurl(purl);
    const { data: licenseConclusions } =
        userHooks.useGetLicenseConclusionsForFileInPackage(
            {
                params: {
                    purl: pathPurl,
                    sha256: fileSha256 as string,
                },
                withCredentials: true,
            },
            { enabled: !!fileSha256 && !!pathPurl },
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
        <div className="flex h-full flex-col">
            <div className="mb-2 flex-row items-center rounded-md border p-1 shadow-lg">
                <Label className="font-bold">File: </Label>
                {path ? (
                    <Badge className="rounded-md">{path}</Badge>
                ) : (
                    <Label className="text-sm">No file opened</Label>
                )}
            </div>

            {data?.licenseFindings[0]?.licenseFindingMatches && (
                <div className="mb-2 flex-row items-center rounded-md border p-1 shadow-lg">
                    <Label className="font-semibold">
                        Individual license matches
                    </Label>
                    <ButtonGroup
                        data={data.licenseFindings[0].licenseFindingMatches}
                        className="max-h-[8vh] w-full overflow-y-auto rounded-md border p-1"
                    />
                </div>
            )}

            {fileSha256 && licenseConclusions?.licenseConclusions[0] && (
                <div className="mb-2 flex-row items-center rounded-md border p-1 shadow-lg">
                    <Label className="font-semibold">Curations</Label>
                    <p className="rounded-md border p-1 text-xs">
                        {licenseConclusions.licenseConclusions.map(
                            (license) => (
                                <span key={license.id}>
                                    <>
                                        {
                                            new Date(license.updatedAt)
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        :{" "}
                                        {license.concludedLicenseExpressionSPDX}
                                        <br />
                                    </>
                                </span>
                            ),
                        )}
                    </p>
                </div>
            )}

            <div className="flex flex-1 items-center justify-center overflow-auto">
                {!path && (
                    <div className="flex h-full items-center justify-center">
                        No file opened
                    </div>
                )}
                {path && isLoading && (
                    <div className="flex h-full items-center justify-center">
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
                    <div className="flex h-full items-center justify-center">
                        Unable to fetch file data
                    </div>
                )}
            </div>
            {data && purl && licenseConclusions && (
                <ConclusionForm
                    purl={purl}
                    lcData={licenseConclusions}
                    fileData={data}
                    className="mt-2 rounded-md border p-1 text-sm shadow-lg"
                />
            )}
        </div>
    );
};

export default CodeInspector;
