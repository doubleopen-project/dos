// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

const CodeInspector = () => {

    const editorRef = useRef(null);
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            console.log("Here is a monaco instance: ", monaco);
        }
    }, [monaco]);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
        editor.focus();
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
            
            <div className="flex-1 overflow-auto bg-gray-100">
                <Editor 
                    theme="vs-light"
                    onMount={handleEditorDidMount}
                />
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

export default CodeInspector;