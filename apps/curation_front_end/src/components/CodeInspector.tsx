// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';
import { zodiosHooks } from '@/hooks/zodiosHooks';
import styles from '../styles/CodeInspector.module.css';

type CodeInspectorProps = {
    sha256: string | undefined;
}

const CodeInspector = ({ sha256 }: CodeInspectorProps) => {

    const [fileContents, setFileContents] = useState<string>("");
    const { data, isLoading, error } = zodiosHooks.useGetFileData({params:{ sha256: sha256 as string }}, { enabled: !!sha256 });
    const editorRef = useRef(null);
    const monaco = useMonaco();
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

    useEffect(() => {
        if (editorRef.current && monaco && data?.licenseFindings) {
            showLicenseFindingMatches(monaco, editorRef.current, data?.licenseFindings);
        }
    }, [monaco, editorRef.current, data?.licenseFindings]);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
        editor.focus();
        //setupEditor(monaco, editorRef.current);
        //showLicenseFindingMatches(monaco, editorRef.current, data?.licenseFindings);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow items-center text-sm">
                <p className="p-1 font-bold">
                    Detected SPDX license expression for this file:
                </p>
                <p className="p-1 m-1 rounded-md bg-slate-300 shadow items-center text-sm">
                    {data && data.licenseFindings.map((license: any) => (
                        <span key={license.licenseExpressionSPDX}>{license.licenseExpressionSPDX}</span>
                    ))}
                </p>
            </div>

            <div className="p-2 mb-2 rounded-md bg-white shadow flex items-center text-sm">
                <input className='bg-gray-200 p-2 rounded-lg w-full' 
                    type='text' 
                    placeholder='Filter' 
                />
                <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                    {"<-"}
                </button>
                <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                    {"->"}
                </button>
            </div>
            
            <div className="flex flex-1 justify-center items-center overflow-auto bg-gray-100">
                {!sha256 && (<div className='flex justify-center items-center h-full'>No file opened</div>)}
                {(sha256 && isLoading) && (<div className='flex justify-center items-center h-full'><Loader2 className='mr-2 h-16 w-16 animate-spin' /></div>)}
                {data && (<Editor 
                    theme="vs-light"
                    onMount={handleEditorDidMount}
                    value={fileContents}
                    options={{
                        fontFamily: 'Source Code Pro',
                        fontSize: 12,
                        minimap: {
                            enabled: true,
                        },
                        wordWrap: 'on',
                        wrappingIndent: 'indent',
                        scrollBeyondLastLine: false,
                        scrollbar: {
                            vertical: 'auto',
                            horizontal: 'auto',
                        },
                        glyphMargin: true,
                        lineNumbers: "on",
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 3,
                        readOnly: true,
                    }}  
                />)}
                {error && (<div className='flex justify-center items-center h-full'>Unable to fetch file data</div>)}
            </div>
            
            <div className="p-2 mt-2 rounded-md bg-white shadow flex-row text-sm">
                <div className="p-2 m-1 rounded-md bg-white shadow flex items-center text-sm">
                    <input className='bg-gray-200 p-2 rounded-lg w-full' type='text' placeholder='CONCLUDED LICENSE' />
                    <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2' >
                        Add curation
                    </button>
                </div>
            </div>

        </div>
    )
}

function showLicenseFindingMatches(monaco: any, editor: any, licenseFindings: any) {
    const decorations: any[] = [];
    licenseFindings.forEach((licenseFinding: { licenseFindingMatches: any[] }) => {
        licenseFinding.licenseFindingMatches.forEach((licenseFindingMatch: any) => {
            const startLine = licenseFindingMatch.startLine;
            const endLine = licenseFindingMatch.endLine;
            const range = new monaco.Range(startLine, 1, endLine, 1);
            const decoration = {
                range: range,
                options: {
                    isWholeLine: true,
                    linesDecorationsClassName: styles['myLineDecoration'],
                    //glyphMargin: true,
                    //inlineClassName: styles['license-finding-inline'],
                    //glyphMarginClassName: styles['license-finding-glyph-margin'],
                },
            };
            decorations.push(decoration);
        });
    });
    editor.deltaDecorations([], decorations);
}

function setupEditor(monaco: any, editor: any) {
    
    editor.decorations = editor.createDecorationsCollection({
        range: new monaco.Range(1, 1, 1, 1),
        options: {
			isWholeLine: true,
			//linesDecorationsClassName: "myLineDecoration",
		},
    });
    
    editor.updateOptions(
        // Set up line numbers
        {
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
        },
    );
}

export default CodeInspector;