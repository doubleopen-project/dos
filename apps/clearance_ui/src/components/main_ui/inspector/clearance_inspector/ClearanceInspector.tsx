// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import useSettingsStore from "@/store/settings.store";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import ConclusionFormWrapper from "@/components/main_ui/inspector/clearance_inspector/ConclusionFormWrapper";
import DetectedLicense from "@/components/main_ui/inspector/clearance_inspector/DetectedLicense";
import LicenseConclusions from "@/components/main_ui/inspector/clearance_inspector/LicenseConclusions";
import LicenseMatches from "@/components/main_ui/inspector/clearance_inspector/LicenseMatches";
import { toPathPath, toPathPurl } from "@/helpers/pathParamHelpers";

type ClearanceInspectorProps = {
    purl: string;
    path: string;
    defaultClearanceHeights: number[];
};

const ClearanceInspector = ({
    purl,
    path,
    defaultClearanceHeights,
}: ClearanceInspectorProps) => {
    const setClearanceHeights = useSettingsStore(
        (state) => state.setClearanceHeights,
    );

    const { data, isLoading, error } = userHooks.useGetFile(
        {
            withCredentials: true,
            params: {
                purl: toPathPurl(purl),
                path: toPathPath(path),
            },
        },
        { enabled: !!path && !!purl },
    );

    return (
        <>
            {isLoading && (
                <div className="flex h-full items-center justify-center p-6">
                    <Loader2 className="h-16 w-16 animate-spin" />
                </div>
            )}
            {data && (
                <ResizablePanelGroup
                    direction="vertical"
                    onLayout={(sizes: number[]) => {
                        setClearanceHeights(sizes);
                    }}
                >
                    <ResizablePanel
                        defaultSize={defaultClearanceHeights[0]}
                        minSize={6}
                    >
                        <DetectedLicense fileSha256={data.sha256} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        defaultSize={defaultClearanceHeights[1]}
                        minSize={7}
                    >
                        <LicenseMatches fileSha256={data.sha256} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        defaultSize={defaultClearanceHeights[2]}
                        minSize={6}
                    >
                        <LicenseConclusions
                            purl={purl}
                            fileSha256={data.sha256}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        defaultSize={defaultClearanceHeights[3]}
                        minSize={30}
                    >
                        <ConclusionFormWrapper
                            purl={purl}
                            fileSha256={data.sha256}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            )}
            {error && (
                <div className="flex h-full items-center justify-center">
                    <span className="font-semibold">{error.message}</span>
                </div>
            )}
        </>
    );
};

export default ClearanceInspector;
