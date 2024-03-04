// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { FiFileMinus, FiFilePlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import BulkConclusionFormDialog from "@/components/main_ui/inspector/package_inspector/BulkConclusionFormDialog";
import ExclusionFormDialog from "@/components/main_ui/inspector/package_inspector/ExclusionFormDialog";
import { cn } from "@/lib/utils";

type Props = {
    purl: string;
    className?: string;
    onSelectionModeChange: (newValue: boolean) => void;
    onClearSelection: () => void;
    glob: string;
};

const ClearanceTools = ({
    purl,
    className,
    onSelectionModeChange,
    onClearSelection,
    glob,
}: Props) => {
    const [openPEDialog, setOpenPEDialog] = useState<boolean>(false);
    const [openBCDialog, setOpenBCDialog] = useState<boolean>(false);
    const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

    return (
        <div
            className={cn(
                "relative mb-2 flex items-center rounded-md border p-1 text-sm",
                className,
            )}
        >
            <span className="absolute left-2 top-[-10px] text-xs font-bold text-gray-500">
                Clearance tools
            </span>
            <>
                <TooltipProvider delayDuration={300}>
                    {/* Selection mode toggle */}
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Toggle
                                    className={
                                        isSelectionMode
                                            ? "border border-red-500 p-2"
                                            : "p-2"
                                    }
                                    pressed={isSelectionMode}
                                    onPressedChange={() => {
                                        setIsSelectionMode(!isSelectionMode);
                                        onSelectionModeChange(!isSelectionMode);
                                    }}
                                    data-testid="selection-mode-toggle"
                                >
                                    {isSelectionMode ? (
                                        <FiFilePlus className="text-lg text-red-500" />
                                    ) : (
                                        <FiFilePlus className="text-lg" />
                                    )}
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isSelectionMode
                                    ? "Toggle off selection mode"
                                    : "Toggle selection mode to select multiple nodes from the tree"}
                            </TooltipContent>
                        </div>
                    </Tooltip>

                    {/* Clear selection */}
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="p-2"
                                    onClick={() => onClearSelection()}
                                    data-testid="clear-selection"
                                >
                                    <FiFileMinus className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Clear all selections from the tree
                            </TooltipContent>
                        </div>
                    </Tooltip>

                    {/* Create bulk conclusion from selection */}
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="p-2 text-xs"
                                    onClick={() => setOpenBCDialog(true)}
                                    data-testid="create-bulk-conclusion"
                                >
                                    BulkC
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Create a bulk conclusion from your selections
                            </TooltipContent>
                        </div>
                        <BulkConclusionFormDialog
                            purl={purl}
                            pattern={glob}
                            open={openBCDialog}
                            setOpen={setOpenBCDialog}
                        />
                    </Tooltip>

                    {/* Create path exclusion from selection */}
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="p-2 text-xs"
                                    onClick={() => setOpenPEDialog(true)}
                                    data-testid="create-path-exclusion"
                                >
                                    PathE
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Create a path exclusion from your selections
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            mode="Add"
                            pattern={glob}
                            open={openPEDialog}
                            setOpen={setOpenPEDialog}
                        />
                    </Tooltip>
                </TooltipProvider>
            </>
        </div>
    );
};

export default ClearanceTools;
