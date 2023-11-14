// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Editor, { OnMount } from "@monaco-editor/react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import React from "react";
import styles from "@/styles/CodeInspector.module.css";
import { parseAsInteger, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

type LicenseFindings = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type LicenseFindingMatch = {
    id: number;
    score: number;
    updatedAt: Date;
    licenseExpression: string | null;
    startLine: number;
    endLine: number;
};

type CodeEditorProps = {
    contents: string;
    licenseFindings: LicenseFindings["licenseFindings"];
};

const CodeEditor = ({ contents, licenseFindings }: CodeEditorProps) => {
    const [licenseMatchId] = useQueryState(
        "licenseMatchId",
        parseAsInteger.withDefault(0),
    );
    const router = useRouter();
    const { path } = router.query;
    const { theme } = useTheme();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // Syntax highlighting
        if (typeof path === "string") {
            const fileType = path.split(".").pop();
            const fileTypes: { [key: string]: string } = {
                bat: "bat",
                c: "c",
                cpp: "cpp",
                css: "css",
                Dockerfile: "dockerfile",
                go: "go",
                html: "html",
                java: "java",
                js: "javascript",
                jsx: "javascript",
                json: "json",
                kt: "kotlin",
                md: "markdown",
                php: "php",
                py: "python",
                r: "r",
                rb: "ruby",
                rs: "rust",
                sh: "shell",
                sql: "sql",
                ts: "typescript",
                tsx: "typescript",
                txt: "plaintext",
                xml: "xml",
                yaml: "yaml",
                yml: "yaml",
            };
            const model = editor.getModel();
            if (fileType && fileTypes[fileType] && model) {
                monaco.editor.setModelLanguage(model, fileTypes[fileType]);
            }
        }

        // Show the side decorations for all individual license matches
        const allMatchesDecorations = licenseFindings.flatMap(
            (licenseFinding) => {
                return licenseFinding.licenseFindingMatches.map(
                    (licenseFindingMatch: LicenseFindingMatch) => {
                        const startLine = licenseFindingMatch.startLine;
                        const endLine = licenseFindingMatch.endLine;
                        const range = new monaco.Range(
                            startLine,
                            1,
                            endLine,
                            1,
                        );
                        const decoration = {
                            range: range,
                            options: {
                                isWholeLine: true,
                                linesDecorationsClassName:
                                    styles["myLineDecoration"],
                            },
                        };
                        return decoration;
                    },
                );
            },
        );
        editor.createDecorationsCollection(allMatchesDecorations);

        // Find the starting line of the license match whose id is licenseMatchId
        // If licenseMatchId is null, use the first license match
        const licenseFindingMatches = licenseFindings.flatMap(
            (licenseFinding) => {
                return licenseFinding.licenseFindingMatches;
            },
        );
        const licenseMatch =
            licenseMatchId === null
                ? licenseFindingMatches[0]
                : licenseFindingMatches.find(
                      (licenseFindingMatch) =>
                          licenseFindingMatch.id === licenseMatchId,
                  );
        if (!licenseMatch) {
            return;
        }

        const matchDecoration = {
            range: new monaco.Range(
                licenseMatch.startLine,
                1,
                licenseMatch.endLine,
                1,
            ),
            options: {
                isWholeLine: true,
                className: styles["myWholeLineDecoration"],
            },
        };
        editor.deltaDecorations([], [matchDecoration]);

        const line = licenseMatch ? licenseMatch.startLine : 1;
        editor.revealLine(line);
    };

    return (
        <Editor
            key={contents + licenseMatchId}
            language="plaintext"
            onMount={handleEditorDidMount}
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            value={contents}
            options={{
                fontFamily: "Source Code Pro",
                fontSize: 12,
                minimap: {
                    enabled: true,
                },
                wordWrap: "on",
                wrappingIndent: "indent",
                scrollBeyondLastLine: false,
                scrollbar: {
                    vertical: "auto",
                    horizontal: "auto",
                },
                glyphMargin: true,
                lineNumbers: "on",
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                readOnly: true,
            }}
        />
    );
};

export default CodeEditor;