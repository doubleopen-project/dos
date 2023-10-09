// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "./ui/button";
import { zodiosHooks } from '@/hooks/zodiosHooks';
import { ZodiosResponseByPath } from '@zodios/core';
import { guestAPI } from 'validation-helpers';
import CodeEditor from './CodeEditor';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import ButtonGroup from './ButtonGroup';

type DataType = ZodiosResponseByPath<typeof guestAPI, 'post', '/file'>;
type LicenseMatch = DataType["licenseFindings"][0]["licenseFindingMatches"][0];

type CodeInspectorProps = {
    purl: string | undefined;
    path: string | undefined;
}

const CodeInspector = ({ path, purl }: CodeInspectorProps) => {

    const [fileContents, setFileContents] = useState<string | undefined>(undefined);
    const [licenseMatch, setLicenseMatch] = useQueryState('licenseMatch', parseAsInteger.withDefault(0));
    const { data, isLoading, error } = zodiosHooks.useGetFileData({ purl: purl as string, path: path as string }, undefined, { enabled: !!path && !!purl });
    const fileUrl = data?.downloadUrl;

    // Fetch ASCII data from the URL
    useEffect(() => {
        if (fileUrl) {
            fetch(fileUrl)
                .then(response => response.text())  // Assuming the data is text/ASCII
                .then(contents => {
                    setFileContents(contents);
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    }, [fileUrl]);

    let license: LicenseMatch | null = null;
    if (data !== undefined) {
        license = getLicenseMatch(data, licenseMatch);
    }

    return (
        <div className="flex flex-col h-full">
            
            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow">
                <Label className="font-bold">File: </Label>
                <Badge className="rounded-md">{path}</Badge>
            </div>
            
            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow items-center">
                <Label className="p-1 text-sm">Detected SPDX license expression for the whole file</Label>
                <p className="p-1 m-1 rounded-md bg-slate-300 shadow items-center text-xs">
                    {
                        data && data.licenseFindings.map((license) => (
                            <span key={license.id}>
                                <>
                                    {new Date(license.updatedAt).toISOString()}:   {license.licenseExpressionSPDX}
                                    <br />
                                </>
                            </span>
                        ))
                    }
                </p>
            </div>

            <div className="flex-row p-2 mb-2 rounded-md bg-white shadow items-center">
                <Label className="p-1 text-sm">
                    {
                        license ? "Individual license matches" : "No license matches"
                    }
                </Label>
                <ButtonGroup data={data?.licenseFindings[0].licenseFindingMatches} />
            </div>

            <div className="flex flex-1 justify-center items-center overflow-auto bg-gray-100">
                {
                    !path && (
                        <div className='flex justify-center items-center h-full'>
                            No file opened
                        </div>
                    )
                }
                {
                    path && isLoading && (
                        <div className='flex justify-center items-center h-full'>
                            <Loader2 className='mr-2 h-16 w-16 animate-spin' />
                        </div>
                    )
                }
                {
                    data && fileContents && (
                        <CodeEditor contents={fileContents} licenseFindings={data.licenseFindings} />
                    )
                }
                {
                    error && (
                        <div className='flex justify-center items-center h-full'>
                            Unable to fetch file data
                        </div>
                    )
                }
            </div>
            
            <div className="p-2 mt-2 rounded-md bg-white shadow flex-row text-sm">
                <div className="p-2 m-1 rounded-md bg-white shadow flex items-center text-sm">
                    <Input className='bg-gray-200 p-2 rounded-lg w-full' type='text' placeholder='CONCLUDED LICENSE' />
                    <Button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2' >
                        Add curation
                    </Button>
                </div>
            </div>

        </div>
    )
}

const getLicenseMatch = (data: DataType, index: number): LicenseMatch | null => {
    let matches = data?.licenseFindings[0]?.licenseFindingMatches || [];
    if ( matches.length === 0 || index < 0 || index >= matches.length) {
        return null;
    }
    return matches[index];
}

export default CodeInspector;