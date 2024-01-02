// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef } from "react";
import useSettingsStore from "@/store/settings.store";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
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
        <ResizablePanelGroup direction="horizontal" className="border">
            <ResizablePanel defaultSize={30}>
                {/* 1st column: Package Inspector */}
                <div className="mr-1 flex h-full flex-col overflow-auto p-2">
                    <PackageTree purl={purl} path={path} />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
                {/* 2nd column: File Inspector */}
                <div className="ml-1 h-full flex-1 overflow-auto p-2">
                    <CodeInspector purl={purl} path={path} />
                </div>
            </ResizablePanel>
            {/* 3rd column: Clearance */}
        </ResizablePanelGroup>
    );
};

export default MainUI;
