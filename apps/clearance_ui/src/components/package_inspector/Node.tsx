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
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types/index";
import LicenseHitCircle from "./LicenseHitCircle";

type NodeProps = NodeRendererProps<TreeNode> & {
    purl: string | undefined;
    licenseFilter: string | null;
    filtering: boolean;
    openedNodeId: string | undefined;
    uniqueLicenses: Map<string, string>;
};

const Node = ({
    node,
    style,
    purl,
    licenseFilter,
    filtering,
    openedNodeId,
    uniqueLicenses,
}: NodeProps) => {
    const { isLeaf, isClosed, data } = node;
    const {
        hasLicenseFindings,
        hasLicenseConclusions,
        isExcluded,
        name,
        path,
        file,
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
        <div
            className="flex cursor-pointer items-center"
            style={style}
            onClick={() => {
                if (!isLeaf) {
                    node.toggle();
                }
            }}
        >
            <span className="flex items-center">{icon}</span>

            <span className="ml-1 flex-grow truncate font-mono text-xs">
                {isLeaf ? (
                    <Link
                        href={{
                            pathname: `/packages/${encodeURIComponent(
                                purl || "",
                            )}/${encodeURIComponent(path || "")}`,
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
                                    ? "bg-violet-400"
                                    : "hover:bg-primary/20",
                                "inline-block w-full rounded-sm",
                            )}
                        >
                            {name}
                        </span>
                    </Link>
                ) : (
                    <span className="hover:bg-primary/20 inline-block w-full rounded-sm">
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
