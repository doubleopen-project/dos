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
};

const MainUI = ({ purl, path }: MainUIProps) => {
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
