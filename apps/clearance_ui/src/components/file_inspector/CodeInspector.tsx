// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import CopyToClipboard from "@/components/CopyToClipboard";
import CodeEditor from "@/components/file_inspector/CodeEditor";
import { toPathPath, toPathPurl } from "@/helpers/pathParamHelpers";

type CodeInspectorProps = {
    purl: string;
    path: string;
};

const CodeInspector = ({ path, purl }: CodeInspectorProps) => {
    const [fileContents, setFileContents] = useState<string | undefined>(
        undefined,
    );
    const { data, isLoading, error } = userHooks.useGetFile(
        {
            withCredentials: true,
            params: {
                purl: toPathPurl(purl),
                path: toPathPath(path),
            },
        },
        { enabled: !!path && !!purl },
    );

    const {
        data: licenseFindingData,
        isLoading: lfIsLoading,
        error: lfError,
    } = userHooks.useGetLicenseFindingsForFile(
        {
            withCredentials: true,
            params: {
                sha256: data?.sha256 as string,
            },
        },
        { enabled: Boolean(data) && data && !!data.sha256 },
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
            <div className="mb-1 flex-row items-center p-1">
                <Label className="clearance-label">File: </Label>
                <Badge className="rounded-md">{path}</Badge>
                <CopyToClipboard copyText={path} />
            </div>

            <Separator className="mb-2" />

            <div className="flex flex-1 items-center justify-center overflow-auto">
                {(isLoading || lfIsLoading) && (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
                {licenseFindingData && fileContents && (
                    <CodeEditor
                        contents={fileContents}
                        licenseFindings={licenseFindingData.licenseFindings}
                    />
                )}
                {(error || lfError) && (
                    <div className="flex h-full items-center justify-center">
                        Unable to fetch file data
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeInspector;
