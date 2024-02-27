// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { JSX } from "react";
import Link from "next/link";
import { NodeRendererProps } from "react-arborist";
import {
    BsFileText as FileText,
    BsFolder as FolderClosed,
    BsFolder2Open as FolderOpen,
} from "react-icons/bs";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import LicenseHitCircle from "@/components/main_ui/inspector/package_inspector/LicenseHitCircle";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types/index";

type NodeProps = NodeRendererProps<TreeNode> & {
    purl: string | undefined;
    licenseFilter: string | null;
    filtering: boolean;
    openedNodeId: string | undefined;
    uniqueLicenses: Map<string, string>;
    isSelectionMode: boolean;
    setIsSelected: (isSelected: boolean) => void;
};

const Node = ({
    node,
    style,
    purl,
    licenseFilter,
    filtering,
    openedNodeId,
    uniqueLicenses,
    isSelectionMode,
    setIsSelected,
}: NodeProps) => {
    const { id, data, isLeaf, isClosed } = node;
    const {
        hasLicenseFindings,
        hasLicenseConclusions,
        isExcluded,
        name,
        path,
        file,
        selectionStatus,
    } = data;
    const boldStyle = { strokeWidth: 0.5 };
    let color;
    let icon;
    let isBold = false;
    const licenseFindingIndicators: JSX.Element[] = [];

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

    if (
        isLeaf &&
        hasLicenseFindings &&
        file?.licenseFindings &&
        file.licenseFindings.length > 0
    ) {
        uniqueLicenses.forEach((value, key) => {
            for (const lf of file?.licenseFindings) {
                if (lf.licenseExpressionSPDX.includes(key)) {
                    licenseFindingIndicators.push(
                        <LicenseHitCircle
                            key={key}
                            license={key}
                            bgcolor={value}
                            filtered={Boolean(
                                licenseFilter &&
                                    licenseFilter.toLowerCase() ===
                                        key.toLowerCase(),
                            )}
                        />,
                    );
                }
            }
        });
    }

    if (isLeaf) {
        icon = (
            <>
                <span className="ml-4"></span>
                <FileText color={color} style={isBold ? boldStyle : {}} />
            </>
        );
    } else if (isClosed) {
        icon = (
            <>
                <MdArrowRight />
                <FolderClosed color={color} style={isBold ? boldStyle : {}} />
            </>
        );
    } else {
        icon = (
            <>
                <MdArrowDropDown />
                <FolderOpen color={color} style={isBold ? boldStyle : {}} />
            </>
        );
    }

    return (
        <div className="flex cursor-pointer items-center" style={style}>
            <span
                className="flex items-center"
                onClick={() => {
                    if (!isLeaf) {
                        node.toggle();
                    }
                }}
            >
                {icon}
            </span>
            {isSelectionMode && (
                <Checkbox
                    className={
                        selectionStatus === 0.5
                            ? "ml-1 h-3.5 w-3.5 border-gray-400 bg-gray-400 p-0"
                            : "ml-1 h-3.5 w-3.5 border-gray-400 bg-white p-0"
                    }
                    checked={selectionStatus === 1}
                    onClick={() => {
                        {
                            setIsSelected(selectionStatus === 1 ? false : true);
                        }
                    }}
                    id={id}
                />
            )}

            <span className="ml-1 flex-grow truncate font-mono text-xs">
                {isLeaf ? (
                    <Link
                        href={{
                            pathname: `/packages/${encodeURIComponent(
                                purl || "",
                            )}/tree/${encodeURIComponent(path || "")}`,
                            query: licenseFilter
                                ? {
                                      licenseFilter: `${licenseFilter}`,
                                      filtering: `${filtering}`,
                                  }
                                : {},
                        }}
                    >
                        <span
                            className={cn(
                                node.id === openedNodeId
                                    ? "bg-[#777DA7]"
                                    : "hover:bg-primary/20",
                                "inline-block w-full rounded-sm",
                            )}
                        >
                            {name}
                        </span>
                    </Link>
                ) : (
                    <span
                        onClick={() => {
                            if (!isLeaf) {
                                node.toggle();
                            }
                        }}
                        className="hover:bg-primary/20 inline-block w-full rounded-sm"
                    >
                        {name}
                    </span>
                )}
            </span>
            {isLeaf && licenseFindingIndicators.length > 0 && (
                <span className="flex flex-row items-center">
                    {licenseFindingIndicators}
                </span>
            )}
        </div>
    );
};

export default Node;
