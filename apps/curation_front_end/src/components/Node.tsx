// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import Link from "next/link";
import React from "react";
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
    ContextMenuRadioItem,
    ContextMenuRadioGroup,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Label } from "@/components/ui/label";
import { minimatch } from "minimatch";
import { userAPI } from "validation-helpers";
import { ZodiosResponseByPath } from "@zodios/core";

type PathExclusionProps = ZodiosResponseByPath<
    typeof userAPI,
    "post",
    "/path-exclusions"
>;

type NodeProps = NodeRendererProps<any> & {
    purl: string | undefined;
    licenseFilter: string | null;
    pathExclusions: PathExclusionProps | undefined;
};

const Node = ({
    node,
    style,
    purl,
    licenseFilter,
    pathExclusions,
}: NodeProps) => {
    const { isLeaf, isInternal, isClosed, isSelected, data } = node;
    const { hasLicenseFindings, hasLicenseConclusions, name, path, children } =
        data;
    const boldStyle = { strokeWidth: 0.5 };
    let color;
    let icon;
    let isBold = false;
    let selectedClassName;

    const patterns = pathExclusions?.pathExclusions.map(
        (exclusion) => exclusion.pattern,
    );
    const isExcluded = patterns?.some((pattern) => minimatch(path, pattern));

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

    return (
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
                                        ? { licenseFilter: `${licenseFilter}` }
                                        : {},
                                }}
                            >
                                <span className={selectedClassName}>
                                    {name}
                                </span>
                            </Link>
                        ) : (
                            <span className={selectedClassName}>{name}</span>
                        )}
                    </span>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                {!isLeaf && (
                    <ContextMenuRadioGroup value="exclude_dir">
                        <ContextMenuRadioItem value="exclude_dir">
                            Exclude this directory
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem value="exclude_all_subdirs">
                            Exclude this & all subdirectories
                        </ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                )}
                {isLeaf && (
                    <ContextMenuRadioGroup value="exclude_file">
                        <ContextMenuRadioItem value="exclude_file">
                            Exclude this file
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem value="exclude_similar_files">
                            Exclude all files with the same extension
                        </ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default Node;
