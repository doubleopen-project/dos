// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef } from "react";
import useSettingsStore from "@/store/settings.store";
import CodeInspector from "@/components/file_inspector/CodeInspector";
import PackageTree from "@/components/package_inspector/PackageTree";

type MainUIProps = {
    purl: string;
    path: string | undefined;
};

const MainUI = ({ purl, path }: MainUIProps) => {
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
        <div className="flex flex-col overflow-auto md:h-screen md:flex-row">
            {/* 1st column: Show and filter package */}
            <div
                ref={treeRef}
                style={{ width: treeWidth }}
                className="m-2 mr-1 flex resize-x flex-col overflow-auto rounded-md border p-2 shadow-lg"
            >
                <PackageTree purl={purl} path={path} />
            </div>

            {/* 2nd column: Open a file for license inspection and clearance */}
            <div className="m-2 ml-1 flex-1 overflow-auto rounded-md border p-2 shadow-lg">
                <CodeInspector purl={purl} path={path} />
            </div>
        </div>
    );
};

export default MainUI;
