// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import useSettingsStore from "@/store/settings.store";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeInspector from "@/components/file_inspector/CodeInspector";
import PackageTree from "@/components/package_inspector/PackageTree";
import ClearanceInspector from "./clearance_inspector/ClearanceInspector";

type MainUIProps = {
    purl: string;
    path: string | undefined;
    defaultMainWidths: number[];
    defaultClearanceHeights: number[];
};

const MainUI = ({
    purl,
    path,
    defaultMainWidths,
    defaultClearanceHeights,
}: MainUIProps) => {
    const setMainWidths = useSettingsStore((state) => state.setMainWidths);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="border"
            onLayout={(sizes: number[]) => {
                setMainWidths(sizes);
            }}
        >
            {/* 1st column: Package Inspector */}
            <ResizablePanel defaultSize={defaultMainWidths[0]}>
                <div className="mr-1 flex h-full flex-col overflow-auto p-2">
                    <PackageTree purl={purl} path={path} />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />

            {/* 2nd column: File Inspector */}
            <ResizablePanel defaultSize={defaultMainWidths[1]}>
                <div className="ml-1 h-full flex-1 overflow-auto p-2">
                    <CodeInspector purl={purl} path={path} />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />

            {/* 3rd column: Clearance Inspector */}
            <ResizablePanel defaultSize={defaultMainWidths[2]}>
                <ClearanceInspector
                    defaultClearanceHeights={defaultClearanceHeights}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default MainUI;
