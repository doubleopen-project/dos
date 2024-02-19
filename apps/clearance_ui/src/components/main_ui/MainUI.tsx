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
import ClearanceInspector from "@/components/clearance_inspector/ClearanceInspector";
import CodeInspector from "@/components/file_inspector/CodeInspector";
import ClearanceToolbar from "@/components/main_ui/ClearanceToolbar";
import PackageTree from "@/components/package_inspector/PackageTree";

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
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
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
                    {path ? (
                        <div className="ml-1 h-full flex-1 overflow-auto p-2">
                            <CodeInspector purl={purl} path={path} />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            No file opened
                        </div>
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />

                {/* 3rd column: Clearance Inspector */}
                <ResizablePanel defaultSize={defaultMainWidths[2]}>
                    {path ? (
                        <ClearanceInspector
                            purl={purl}
                            path={path}
                            defaultClearanceHeights={defaultClearanceHeights}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div>No file data to show</div>
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default MainUI;
