// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef } from "react";
import useSettingsStore from "@/store/settings.store";
import CodeInspector from "@/components/file_inspector/CodeInspector";
import PackageTree from "@/components/package_inspector/PackageTree";

type CurationUIProps = {
    purl: string | undefined;
    path: string | undefined;
};

const CurationUI = ({ purl, path }: CurationUIProps) => {
    const treeWidth = useSettingsStore((state) => state.treeWidth);
    const setTreeWidth = useSettingsStore((state) => state.setTreeWidth);
    const treeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Event listener for mouseup event on window
        const handleMouseUp = () => {
            if (treeRef.current) {
                setTreeWidth(treeRef.current.offsetWidth);
            }
        };
        // Add the event listener when the component mounts
        window.addEventListener("mouseup", handleMouseUp);
        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [setTreeWidth]);

    return (
        <div className="flex flex-col overflow-auto md:flex-row md:h-screen">
            {/* 1st column: Show and filter package */}
            <div
                ref={treeRef}
                style={{ width: treeWidth }}
                className="flex flex-col p-2 m-2 mr-1 overflow-auto border rounded-md shadow-lg resize-x"
            >
                <PackageTree purl={purl} />
            </div>

            {/* 2nd column: Open a file for license inspection and curation */}
            <div className="flex-1 p-2 m-2 ml-1 overflow-auto border rounded-md shadow-lg">
                <CodeInspector purl={purl} path={path} />
            </div>
        </div>
    );
};

export default CurationUI;
