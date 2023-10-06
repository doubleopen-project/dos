// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { Button } from "./ui/button";
import { zodiosHooks } from '@/hooks/zodiosHooks';
import { ZodiosResponseByPath } from '@zodios/core';
import { dosApi } from 'validation-helpers';
import CodeEditor from './CodeEditor';
import { parseAsInteger, useQueryState } from 'next-usequerystate';

type LicenseFinding = ZodiosResponseByPath<typeof dosApi, 'get', '/file/:sha256'>["licenseFindings"][0];
type LicenseMatches = LicenseFinding["licenseFindingMatches"];

type CodeInspectorProps = {
    sha256: string | undefined;
}

const CodeInspector = ({ sha256 }: CodeInspectorProps) => {

    const [fileContents, setFileContents] = useState<string | undefined>(undefined);
    const [editorLine, setEditorLine] = useQueryState('editorLine', parseAsInteger.withDefault(1));
    const { data, isLoading, error } = zodiosHooks.useGetFileData({params:{ sha256: sha256 as string }}, { enabled: !!sha256 });
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

    return (
        <div className="flex flex-col h-full">

            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow items-center">
                <p className="p-1 font-bold text-sm">Detected SPDX license expression for the whole file</p>
                <p className="p-1 m-1 rounded-md bg-slate-300 shadow items-center text-xs">
                    {data && data.licenseFindings.map((license) => (
                        <span key={license.id}>
                            <>
                                {new Date(license.updatedAt).toISOString()} : {license.licenseExpressionSPDX}
                                <br />
                            </>
                        </span>
                    ))}
                </p>
            </div>

            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow items-center">
                <p className="p-1 text-sm">Individual license matches</p>
                <div className="flex items-center">
                    <p className='bg-slate-300 p-1 m-1 rounded-md w-full shadow text-xs'>
                        {getLicenseMatch(data?.licenseFindings[0]?.licenseFindingMatches || [], 0)?.licenseExpression}
                    </p>
                    <Button 
                        className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'
                        onClick={() => setEditorLine(i => i - 1)}
                    >
                        <GrPrevious size={20} />
                    </Button>
                    <Button 
                        className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'
                        onClick={() => setEditorLine(i => i + 1)}
                    >
                        <GrNext size={20} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 justify-center items-center overflow-auto bg-gray-100">
                {
                    !sha256 && (
                        <div className='flex justify-center items-center h-full'>
                            No file opened
                        </div>
                    )
                }
                {
                    sha256 && isLoading && (
                        <div className='flex justify-center items-center h-full'>
                            <Loader2 className='mr-2 h-16 w-16 animate-spin' />
                        </div>
                    )
                }
                {
                    data && fileContents && (
                        <CodeEditor contents={fileContents} licenseFindings={data.licenseFindings} line={editorLine} />
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
                    <input className='bg-gray-200 p-2 rounded-lg w-full' type='text' placeholder='CONCLUDED LICENSE' />
                    <Button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2' >
                        Add curation
                    </Button>
                </div>
            </div>

        </div>
    )
}

function getLicenseMatch(matches: LicenseFinding["licenseFindingMatches"], index: number): any | null {
    if (index < 0 || index >= matches.length) {
        return null;
    }
    return matches[index];
}

export default CodeInspector;