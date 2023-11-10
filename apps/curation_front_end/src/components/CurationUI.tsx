// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef } from "react";
import PackageTree from "@/components/PackageTree";
import CodeInspector from "@/components/CodeInspector";
import useSettingsStore from "@/store/settings.store";

type CurationUIProps = {
    purl: string | undefined;
    path: string | undefined;
};

const CurationUI = ({ purl, path }: CurationUIProps) => {
    const treeWidth = useSettingsStore((state) => state.treeWidth);
    const setTreeWidth = useSettingsStore((state) => state.setTreeWidth);
    const treeRef = useRef<HTMLDivElement>(null);

    // Ensure the initial width is set based on the persisted value from Zustand
    useEffect(() => {
        if (treeWidth !== null && treeWidth !== undefined) {
            // Use the persisted treeWidth if available
            treeRef.current?.style.setProperty(
                "width",
                `${treeWidth}px`,
                "important",
            );
        } else {
            // Set the default width if Zustand value is not available
            treeRef.current?.style.removeProperty("width");
        }
    }, [treeWidth]);

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
    }, []);

    return (
        <div className="flex flex-col md:flex-row md:h-screen overflow-auto">
            {/* 1st column: Show and filter package */}
            <div
                ref={treeRef}
                className="flex flex-col m-2 mr-1 p-2 rounded-md border shadow-lg overflow-auto resize-x"
            >
                <PackageTree purl={purl} />
            </div>

            {/* 2nd column: Open a file for license inspection and curation */}
            <div className="flex-1 m-2 ml-1 p-2 rounded-md border shadow-lg overflow-auto">
                <CodeInspector purl={purl} path={path} />
            </div>
        </div>
    );
};

export default CurationUI;
