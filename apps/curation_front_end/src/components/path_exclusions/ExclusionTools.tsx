// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import ExclusionFormDialog from "@/components/path_exclusions/ExclusionFormDialog";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SelectedNode } from "@/types/index";
import React, { useState } from "react";
import {
    TbFileOff,
    TbFilesOff,
    TbFolderOff,
    TbFoldersOff,
} from "react-icons/tb";
import { TfiPencil } from "react-icons/tfi";

type Props = {
    selectedNode: SelectedNode | undefined;
    purl: string | undefined;
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

    return (
        <div
            className={cn(
                "relative flex items-center p-1 mb-2 text-sm border rounded-md shadow-lg",
                className,
            )}
        >
            <span className="absolute text-gray-500 top-[-10px] left-2 text-xs">
                Path exclusion tools
            </span>
            <>
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <div className="relative group">
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
                            pattern={selectedNode?.data.path + "/*"}
                            open={openDirDialog}
                            setOpen={setOpenDirDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="relative group">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={!hasChildrenDirs(selectedNode)}
                                    className="p-2"
                                    onClick={() => setOpenSubdirsDialog(true)}
                                >
                                    <TbFoldersOff className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Exclude this and all subdirectories
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            pattern={selectedNode?.data.path + "/**"}
                            open={openSubdirsDialog}
                            setOpen={setOpenSubdirsDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="relative group">
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
                            pattern={selectedNode?.data.path}
                            open={openFileDialog}
                            setOpen={setOpenFileDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="relative group">
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={!selectedNode?.isLeaf}
                                    className="p-2"
                                    onClick={() => setOpenFileExtDialog(true)}
                                >
                                    <TbFilesOff className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Exclude all files with this extension
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            pattern={
                                "**/*." +
                                selectedNode?.data.path?.split(".").pop()
                            }
                            open={openFileExtDialog}
                            setOpen={setOpenFileExtDialog}
                        />
                    </Tooltip>
                    <Tooltip>
                        <div className="relative group">
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
                                Write a freetext exclusion pattern
                            </TooltipContent>
                        </div>
                        <ExclusionFormDialog
                            purl={purl}
                            pattern={undefined}
                            open={openFreeTextDialog}
                            setOpen={setOpenFreeTextDialog}
                        />
                    </Tooltip>
                </TooltipProvider>
            </>
        </div>
    );
};

export default ExclusionTools;
