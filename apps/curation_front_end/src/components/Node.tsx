// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import Link from "next/link";
import React, { useState } from "react";
import { NodeRendererProps } from "react-arborist";
import {
    BsFileText as FileText,
    BsFolder as FolderClosed,
    BsFolder2Open as FolderOpen,
} from "react-icons/bs";
import { MdArrowRight, MdArrowDropDown } from "react-icons/md";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import ExclusionForm from "./ExclusionForm";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import ExclusionFormDialog from "./ExclusionFormDialog";

type NodeProps = NodeRendererProps<any> & {
    purl: string | undefined;
    licenseFilter: string | null;
};

const Node = ({ node, style, purl, licenseFilter }: NodeProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isLeaf, isClosed, isSelected, data } = node;
    const {
        hasLicenseFindings,
        hasLicenseConclusions,
        isExcluded,
        name,
        path,
    } = data;
    const boldStyle = { strokeWidth: 0.5 };
    let color;
    let icon;
    let isBold = false;
    let selectedClassName;
    let pattern;

    if (isSelected) {
        selectedClassName = "bg-gray-400 rounded-sm";
    }

    if (isExcluded) {
        color = "gray";
    } else {
        if (hasLicenseConclusions) {
            color = "green";
            isBold = true;
        } else if (hasLicenseFindings) {
            color = "red";
            isBold = true;
        }
    }

    if (isLeaf) {
        icon = (
            <>
                <span className="ml-4"></span>
                <FileText color={color} style={isBold && boldStyle} />
            </>
        );
    } else if (isClosed) {
        icon = (
            <>
                <MdArrowRight />
                <FolderClosed color={color} style={isBold && boldStyle} />
            </>
        );
    } else {
        icon = (
            <>
                <MdArrowDropDown />
                <FolderOpen color={color} style={isBold && boldStyle} />
            </>
        );
    }

    const handleExcludeThisDir = (p: string) => {
        pattern = p;
        setIsDialogOpen(true);
    };

    return (
        <Dialog>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        className="flex items-center cursor-pointer"
                        style={style}
                        onClick={() => {
                            if (!isLeaf) {
                                node.toggle();
                            }
                        }}
                    >
                        <span className="flex items-center">{icon}</span>
                        <span className="ml-1 font-mono text-xs flex-grow truncate">
                            {isLeaf ? (
                                <Link
                                    href={{
                                        pathname: `/packages/${encodeURIComponent(
                                            purl || "",
                                        )}/${encodeURIComponent(path || "")}`,
                                        query: licenseFilter
                                            ? {
                                                  licenseFilter: `${licenseFilter}`,
                                              }
                                            : {},
                                    }}
                                >
                                    <span className={selectedClassName}>
                                        {name}
                                    </span>
                                </Link>
                            ) : (
                                <span className={selectedClassName}>
                                    {name}
                                </span>
                            )}
                        </span>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    {!isLeaf && (
                        <>
                            <DialogTrigger asChild>
                                <ContextMenuItem>
                                    Exclude this directory
                                </ContextMenuItem>
                            </DialogTrigger>
                            <ContextMenuItem>
                                Exclude this & all subdirectories
                            </ContextMenuItem>
                        </>
                    )}
                    {isLeaf && (
                        <>
                            <ContextMenuItem>Exclude this file</ContextMenuItem>
                            <ContextMenuItem>
                                Exclude all files with the same extension
                            </ContextMenuItem>
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>
            {false && <ExclusionFormDialog purl={purl} />}
            <DialogContent>
                <ExclusionForm purl={purl} pattern={pattern} />
                <DialogFooter className="flex justify-end">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="text-xs p-1 rounded-md"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Node;
