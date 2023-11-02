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

const ExclusionTools = ({ selectedNode, purl }: Props) => {
    // Check if the selected node has children directories:
    // if it does, then either this node or this and all subdirs can be excluded
    const hasChildrenDirs = (node: SelectedNode) => {
        return node.children?.some((child: SelectedNode) => !child.isLeaf);
    };

    return (
        <div className="p-1 mb-2 flex rounded-mb border items-center text-sm">
            {selectedNode?.isInternal ? (
                <>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="p-1 ml-2">
                                <TbFolderOff className="text-lg" />
                            </Button>
                        </DialogTrigger>
                        <ExclusionFormDialog
                            purl={purl}
                            pattern={selectedNode?.data.path + "/*"}
                        />
                    </Dialog>
                    {hasChildrenDirs(selectedNode) && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="p-1 ml-2">
                                    <TbFoldersOff className="text-lg" />
                                </Button>
                            </DialogTrigger>
                            <ExclusionFormDialog
                                purl={purl}
                                pattern={selectedNode?.data.path + "/**"}
                            />
                        </Dialog>
                    )}
                </>
            ) : (
                <>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className="text-xs p-1 rounded-md ml-2"
                            >
                                <TbFileOff className="text-lg" />
                            </Button>
                        </DialogTrigger>
                        <ExclusionFormDialog
                            purl={purl}
                            pattern={selectedNode?.data.path}
                        />
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className="text-xs p-1 rounded-md ml-2"
                            >
                                <TbFilesOff className="text-lg" />
                            </Button>
                        </DialogTrigger>
                        <ExclusionFormDialog
                            purl={purl}
                            pattern={
                                "*." + selectedNode?.data.path?.split(".").pop()
                            }
                        />
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default ExclusionTools;
