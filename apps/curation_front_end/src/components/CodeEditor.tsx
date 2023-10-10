// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Editor, { OnMount } from "@monaco-editor/react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import React from "react";
import styles from "../styles/CodeInspector.module.css";
import { parseAsInteger, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";

type LicenseFindings = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type CodeEditorProps = {
  contents: string;
  licenseFindings: LicenseFindings["licenseFindings"];
};

const CodeEditor = ({ contents, licenseFindings }: CodeEditorProps) => {
  const [line, setLine] = useQueryState("line", parseAsInteger.withDefault(1));
  const router = useRouter();
  const { path } = router.query;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Show the decorations for all individual license matches
    const decorations = licenseFindings.flatMap((licenseFinding) => {
      return licenseFinding.licenseFindingMatches.map(
        (licenseFindingMatch: any) => {
          const startLine = licenseFindingMatch.startLine;
          const endLine = licenseFindingMatch.endLine;
          const range = new monaco.Range(startLine, 1, endLine, 1);
          const decoration = {
            range: range,
            options: {
              isWholeLine: true,
              className: styles["myWholeLineDecoration"],
              linesDecorationsClassName: styles["myLineDecoration"],
            },
          };
          return decoration;
        },
      );
    });
    editor.deltaDecorations([], decorations);

    // Move the editor to the specified line
    editor.revealLineInCenter(line);

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
        //console.log("Editor language:", fileTypes[fileType]);
        monaco.editor.setModelLanguage(model, fileTypes[fileType]);
      }
    }
  };

  return (
    <Editor
      key={contents + line}
      language="plaintext"
      onMount={handleEditorDidMount}
      theme="vs-light"
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
