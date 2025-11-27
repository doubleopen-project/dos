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
    BsThreeDots as ThreeDots,
} from "react-icons/bs";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import LicenseHitCircle from "@/components/main_ui/inspector/package_inspector/LicenseHitCircle";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types/index";

type NodeProps = NodeRendererProps<TreeNode> & {
    purl: string | undefined;
    licenseFilter: string | null;
    filtering: boolean;
    openedNodeId: string | undefined;
    fileSha256ToDecomposedLicensesMap: Map<string, Set<string>> | null;
    uniqueLicenses: Map<string, string> | null;
    isSelectionMode: boolean;
    setIsSelected: (isSelected: boolean) => void;
    excludedPaths: Set<string>;
    concludedPaths: Set<string>;
    pathsWithLFs: Set<string>;
};

const Node = ({
    node,
    style,
    purl,
    licenseFilter,
    filtering,
    openedNodeId,
    fileSha256ToDecomposedLicensesMap,
    uniqueLicenses,
    isSelectionMode,
    setIsSelected,
    excludedPaths,
    concludedPaths,
    pathsWithLFs,
}: NodeProps) => {
    const { id, data, isLeaf, isClosed } = node;
    const { name, path, selectionStatus, fileSha256 } = data;
    const boldStyle = { strokeWidth: 0.5 };
    let color;
    let icon;
    let isBold = false;
    const licenseFindingIndicators: JSX.Element[] = [];

    const isExcluded = excludedPaths.has(path);
    const hasLicenseConclusions = concludedPaths.has(path);
    const hasLicenseFindings = pathsWithLFs.has(path);

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
        fileSha256 &&
        fileSha256ToDecomposedLicensesMap &&
        uniqueLicenses
    ) {
        const decomposedLicenses =
            fileSha256ToDecomposedLicensesMap.get(fileSha256);

        if (decomposedLicenses) {
            decomposedLicenses.forEach((license) => {
                licenseFindingIndicators.push(
                    <LicenseHitCircle
                        key={license}
                        license={license}
                        bgcolor={uniqueLicenses.get(license) || "gray"}
                        filtered={Boolean(
                            licenseFilter &&
                            licenseFilter.toLowerCase() ===
                                license.toLowerCase(),
                        )}
                    />,
                );
            });
        }
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

            <span className="ml-1 grow truncate font-mono text-xs">
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
                    {licenseFindingIndicators.length <= 10 ? (
                        // Render all indicators when there are 10 or fewer
                        licenseFindingIndicators
                    ) : (
                        // Render the first 10 indicators and an ellipsis when there are more than 10
                        <>
                            {licenseFindingIndicators.slice(0, 10)}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="ml-1">
                                        <ThreeDots className="text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="end">
                                        <div className="w-full p-1">
                                            {licenseFindingIndicators.length -
                                                10}
                                            {" more license matches"}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}
                </span>
            )}
        </div>
    );
};

export default Node;
