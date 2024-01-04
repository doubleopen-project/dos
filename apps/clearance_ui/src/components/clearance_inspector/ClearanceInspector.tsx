// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import useSettingsStore from "@/store/settings.store";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

type ClearanceInspectorProps = {
    defaultClearanceHeights: number[];
};

const ClearanceInspector = ({
    defaultClearanceHeights,
}: ClearanceInspectorProps) => {
    const setClearanceHeights = useSettingsStore(
        (state) => state.setClearanceHeights,
    );

    return (
        <ResizablePanelGroup
            direction="vertical"
            onLayout={(sizes: number[]) => {
                setClearanceHeights(sizes);
            }}
        >
            <ResizablePanel defaultSize={defaultClearanceHeights[0]}>
                <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Detected license</span>
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
                    <span className="font-semibold">Concluded license</span>
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
    );
};

export default ClearanceInspector;
