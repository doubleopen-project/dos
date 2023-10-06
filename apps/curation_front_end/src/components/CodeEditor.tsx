import Editor, { EditorProps } from '@monaco-editor/react';
import { ZodiosResponseByPath } from '@zodios/core';
import { dosApi } from 'validation-helpers';
import React, { useRef } from 'react';
import styles from '../styles/CodeInspector.module.css';

type LicenseFindings = ZodiosResponseByPath<typeof dosApi, 'get', '/file/:sha256'>;

type CodeEditorProps = {
    contents: string;
    licenseFindings: LicenseFindings["licenseFindings"];
    line: number;
}

const CodeEditor = ({ contents, licenseFindings, line }: CodeEditorProps) => {

    //const editorRef = useRef(null);

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