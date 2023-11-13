// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import type { SelectedNode } from "@/types/index";
import { Button } from "@/components/ui/button";
import {
    TbFolderOff,
    TbFoldersOff,
    TbFileOff,
    TbFilesOff,
} from "react-icons/tb";
import { TfiPencil } from "react-icons/tfi";
import ExclusionFormDialog from "./ExclusionFormDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    selectedNode: SelectedNode | undefined;
    purl: string | undefined;
};

// Check if the selected node has children directories:
// if it does, then either this node or this and all subdirs can be excluded
const hasChildrenDirs = (node: SelectedNode | undefined) => {
    return node?.children?.some((child: SelectedNode) => !child.isLeaf);
};

const ExclusionTools = ({ selectedNode, purl }: Props) => {
    const [openDirDialog, setOpenDirDialog] = useState<boolean>(false);
    const [openSubdirsDialog, setOpenSubdirsDialog] = useState<boolean>(false);
    const [openFileDialog, setOpenFileDialog] = useState<boolean>(false);
    const [openFileExtDialog, setOpenFileExtDialog] = useState<boolean>(false);
    const [openFreeTextDialog, setOpenFreeTextDialog] =
        useState<boolean>(false);

    return (
        <div className="relative p-1 mb-2 flex rounded-md border shadow-lg items-center text-sm">
            <span className="absolute text-gray-500 top-[-10px] left-2 text-xs">
                Path exclusion tools
            </span>
            <>
                <TooltipProvider>
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
