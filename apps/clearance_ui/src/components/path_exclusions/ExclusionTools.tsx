// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { LuFileStack } from "react-icons/lu";
import {
    TbFileOff,
    TbFilesOff,
    TbFolderOff,
    TbFoldersOff,
} from "react-icons/tb";
import { TfiPencil } from "react-icons/tfi";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import BulkConclusionFormDialog from "@/components/license_conclusions/BulkConclusionFormDialog";
import ExclusionFormDialog from "@/components/path_exclusions/ExclusionFormDialog";
import { cn } from "@/lib/utils";
import type { SelectedNode } from "@/types/index";

type Props = {
    selectedNode: SelectedNode | undefined;
    purl: string;
    className?: string;
};

// Check if the selected node has children directories:
// if it does, then either this node or this and all subdirs can be excluded
const hasChildrenDirs = (node: SelectedNode | undefined) => {
    return node?.children?.some((child: SelectedNode) => !child.isLeaf);
};

const ExclusionTools = ({ selectedNode, purl, className }: Props) => {
    const [openDirDialog, setOpenDirDialog] = useState<boolean>(false);
    const [openSubdirsDialog, setOpenSubdirsDialog] = useState<boolean>(false);
    const [openFileDialog, setOpenFileDialog] = useState<boolean>(false);
    const [openFileExtDialog, setOpenFileExtDialog] = useState<boolean>(false);
    const [openFreeTextDialog, setOpenFreeTextDialog] =
        useState<boolean>(false);
    const [openBulkConclusionDialog, setOpenBulkConclusionDialog] =
        useState<boolean>(false);

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
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={!selectedNode?.isInternal}
                                    className="p-2"
                                    onClick={() => setOpenDirDialog(true)}
                                >
                                    <TbFolderOff className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Exclude this directory
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            mode="Add"
                            pattern={selectedNode?.data.path + "/*"}
                            open={openDirDialog}
                            setOpen={setOpenDirDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={!hasChildrenDirs(selectedNode)}
                                    className="p-2"
                                    onClick={() => setOpenSubdirsDialog(true)}
                                >
                                    <TbFoldersOff
                                        className="text-lg"
                                        data-testid="path-exclusion-subdirs"
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Exclude this and all subdirectories
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            mode="Add"
                            pattern={selectedNode?.data.path + "/**"}
                            open={openSubdirsDialog}
                            setOpen={setOpenSubdirsDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={!selectedNode?.isLeaf}
                                    className="p-2"
                                    onClick={() => setOpenFileDialog(true)}
                                >
                                    <TbFileOff className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Exclude this file</TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            mode="Add"
                            pattern={selectedNode?.data.path}
                            open={openFileDialog}
                            setOpen={setOpenFileDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={!selectedNode?.isLeaf}
                                    className="p-2"
                                    onClick={() => setOpenFileExtDialog(true)}
                                >
                                    <TbFilesOff
                                        className="text-lg"
                                        data-testid="path-exclusion-similar"
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Exclude all files with this extension
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            mode="Add"
                            pattern={
                                "**/*." +
                                selectedNode?.data.path?.split(".").pop()
                            }
                            open={openFileExtDialog}
                            setOpen={setOpenFileExtDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="p-2"
                                    onClick={() => setOpenFreeTextDialog(true)}
                                >
                                    <TfiPencil className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Write a freetext path exclusion pattern
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            mode="Add"
                            pattern={undefined}
                            open={openFreeTextDialog}
                            setOpen={setOpenFreeTextDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="group relative">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="p-2"
                                    onClick={() =>
                                        setOpenBulkConclusionDialog(true)
                                    }
                                >
                                    <LuFileStack
                                        className="text-lg"
                                        data-testid="bulk-conclusion"
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Write a license conclusion for multiple files
                            </TooltipContent>
                        </div>
                        <BulkConclusionFormDialog
                            purl={purl}
                            open={openBulkConclusionDialog}
                            setOpen={setOpenBulkConclusionDialog}
                        />
                    </Tooltip>
                </TooltipProvider>
            </>
        </div>
    );
};

export default ExclusionTools;
