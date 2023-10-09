// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Editor from '@monaco-editor/react';
import { ZodiosResponseByPath } from '@zodios/core';
import { guestAPI } from 'validation-helpers';
import React from 'react';
import styles from '../styles/CodeInspector.module.css';
import { parseAsInteger, useQueryState } from 'next-usequerystate';

type LicenseFindings = ZodiosResponseByPath<typeof guestAPI, 'post', '/file'>;

type CodeEditorProps = {
    contents: string;
    licenseFindings: LicenseFindings["licenseFindings"];
}

const CodeEditor = ({ contents, licenseFindings }: CodeEditorProps) => {

    const [line, setLine] = useQueryState('line', parseAsInteger.withDefault(1));

    function showLicenseFindingMatches(monaco: any, editor: any, licenseFindings: CodeEditorProps["licenseFindings"]) {
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
                        className: styles['myWholeLineDecoration'],
                        linesDecorationsClassName: styles['myLineDecoration'],
                    },
                };
                decorations.push(decoration);
            });
        });
        editor.deltaDecorations([], decorations);
        
    }

    const handleEditorDidMount = (editor: any, monaco: any) => {
        // Show the decorations for all individual license matches
        showLicenseFindingMatches(monaco, editor, licenseFindings);

        // Move the editor to the specified line
        editor.revealLineInCenter(line);
    };

    return (
        <Editor
            language=''
            key={contents+line} 
            onMount={handleEditorDidMount}
            theme="vs-light"
            value={contents}
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
        />
    )
}

export default CodeEditor;