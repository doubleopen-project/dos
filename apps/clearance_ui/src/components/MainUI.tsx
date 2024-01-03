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
    const setClearanceHeights = useSettingsStore(
        (state) => state.setClearanceHeights,
    );

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

            {/* 3rd column: Clearance */}
            <ResizablePanel defaultSize={defaultMainWidths[2]}>
                <ResizablePanelGroup
                    direction="vertical"
                    onLayout={(sizes: number[]) => {
                        setClearanceHeights(sizes);
                    }}
                >
                    <ResizablePanel defaultSize={defaultClearanceHeights[0]}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">
                                Detected license
                            </span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={defaultClearanceHeights[1]}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">
                                Individual license matches
                            </span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={defaultClearanceHeights[2]}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">
                                Concluded license
                            </span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={defaultClearanceHeights[3]}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">
                                Create a license conclusion
                            </span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default MainUI;
