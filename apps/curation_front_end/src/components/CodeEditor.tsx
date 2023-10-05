import { Editor, EditorProps, useMonaco } from '@monaco-editor/react';
import { ZodiosResponseByPath } from '@zodios/core';
import { dosApi } from 'validation-helpers';
import React, { useRef } from 'react';
import styles from '../styles/CodeInspector.module.css';

type LicenseFindings = ZodiosResponseByPath<typeof dosApi,'get','/file/:sha256'>;

type CodeEditorProps = {
    contents: string;
    licenseFindings: LicenseFindings["licenseFindings"];
}

const CodeEditor = ({ contents, licenseFindings }: CodeEditorProps) => {
    
    const editorRef = useRef(null);
    const monaco = useMonaco();
    console.log(contents);
    console.log(JSON.stringify(licenseFindings));

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

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
        showLicenseFindingMatches(monaco, editor, licenseFindings);
        //editor.focus();
    };

    return (
        <Editor 
            key={contents}
            onMount={(editor, monaco) => {      
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
            }}
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