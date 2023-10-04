// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef } from 'react';
import Editor, { EditorProps, useMonaco } from '@monaco-editor/react';
import { edit } from 'react-arborist/dist/state/edit-slice';

type CodeInspectorProps = {
    contents?: string;
}

const CodeInspector = (data: CodeInspectorProps) => {

    const editorRef = useRef(null);
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            //setupEditor(monaco, editorRef.current);
        }
    }, [monaco]);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
        editor.focus();
        setupEditor(monaco, editorRef.current);
    }

    return (
        <div className="flex flex-col h-full">
            
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
                {!data.contents && <p className="p-2">No file opened yet</p>}
                {data.contents && <Editor 
                    theme="vs-light"
                    onMount={handleEditorDidMount}
                    value={data.contents}
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
                />}
            </div>
            
            <div className="p-2 mt-2 rounded-md bg-white shadow flex-row text-sm">
                <p className="p-2">
                    DETECTED LICENSE FOR THIS FILE
                </p>
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