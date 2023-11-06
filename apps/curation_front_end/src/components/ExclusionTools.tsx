// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import type { SelectedNode } from "@/types/index";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    TbFolderOff,
    TbFoldersOff,
    TbFileOff,
    TbFilesOff,
} from "react-icons/tb";
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
    return (
        <div className="relative p-1 mb-2 flex rounded-md border shadow-lg items-center text-sm">
            <span className="absolute text-gray-500 top-[-10px] left-2 text-xs">
                Path exclusion tools
            </span>
            <>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="group relative">
                            <Button
                                variant="ghost"
                                disabled={!selectedNode?.isInternal}
                                className="p-2"
                            >
                                <TbFolderOff className="text-lg" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible text-xs bg-gray-200 text-gray-800 py-1 px-2 rounded">
                                Exclude this directory
                            </div>
                        </div>
                    </DialogTrigger>
                    <ExclusionFormDialog
                        purl={purl}
                        pattern={selectedNode?.data.path + "/*"}
                    />
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="group relative">
                            <Button
                                variant="ghost"
                                disabled={!hasChildrenDirs(selectedNode)}
                                className="p-2"
                            >
                                <TbFoldersOff className="text-lg" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible text-xs bg-gray-200 text-gray-800 py-1 px-2 rounded">
                                Exclude this and all subdirectories
                            </div>
                        </div>
                    </DialogTrigger>
                    <ExclusionFormDialog
                        purl={purl}
                        pattern={selectedNode?.data.path + "/**"}
                    />
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="group relative">
                            <Button
                                variant="ghost"
                                disabled={!selectedNode?.isLeaf}
                                className="p-2"
                            >
                                <TbFileOff className="text-lg" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible text-xs bg-gray-200 text-gray-800 py-1 px-2 rounded">
                                Exclude this file
                            </div>
                        </div>
                    </DialogTrigger>
                    <ExclusionFormDialog
                        purl={purl}
                        pattern={selectedNode?.data.path}
                    />
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="group relative">
                            <Button
                                variant="ghost"
                                disabled={!selectedNode?.isLeaf}
                                className="p-2"
                            >
                                <TbFilesOff className="text-lg" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible text-xs bg-gray-200 text-gray-800 py-1 px-2 rounded">
                                Exclude all files with this extension
                            </div>
                        </div>
                    </DialogTrigger>
                    <ExclusionFormDialog
                        purl={purl}
                        pattern={
                            "**/*." + selectedNode?.data.path?.split(".").pop()
                        }
                    />
                </Dialog>
            </>
        </div>
    );
};

export default ExclusionTools;
