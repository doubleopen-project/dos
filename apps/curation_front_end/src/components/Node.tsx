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

type NodeProps = NodeRendererProps<any> & {
    purl: string | undefined;
    licenseFilter: string | null;
};

const Node = ({ node, style, purl, licenseFilter }: NodeProps) => {
    const { isLeaf, isClosed, isSelected, data } = node;
    const { hasLicenseFindings, hasLicenseConclusions, name, path } = data;
    const boldStyle = { strokeWidth: 0.5 };
    let color;
    let icon;
    let isBold = false;
    let selectedClassName;

    if (isSelected) {
        selectedClassName = "bg-gray-300 rounded-sm";
    }

    if (hasLicenseConclusions) {
        color = "green";
        isBold = true;
    } else if (hasLicenseFindings) {
        color = "red";
        isBold = true;
    }

    if (isLeaf) {
        icon = <FileText color={color} style={isBold && boldStyle} />;
    } else if (isClosed) {
        icon = <FolderClosed color={color} style={isBold && boldStyle} />;
    } else {
        icon = <FolderOpen color={color} style={isBold && boldStyle} />;
    }

    return (
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
            <span className="ml-1 font-mono text-xs">
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
                        <div className={selectedClassName}>{name}</div>
                    </Link>
                ) : (
                    <div className={selectedClassName}>{name}</div>
                )}
            </span>
        </div>
    );
};

export default Node;
