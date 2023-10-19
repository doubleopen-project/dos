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
    const { isLeaf, isClosed, data } = node;
    const { hasLicenseFindings, name, path } = data;
    const boldStyle = { strokeWidth: 0.5 };
    let icon;

    if (isLeaf) {
        icon = hasLicenseFindings ? (
            <FileText color="red" style={boldStyle} />
        ) : (
            <FileText />
        );
    } else if (isClosed) {
        icon = hasLicenseFindings ? (
            <FolderClosed color="red" style={boldStyle} />
        ) : (
            <FolderClosed />
        );
    } else {
        icon = hasLicenseFindings ? (
            <FolderOpen color="red" style={boldStyle} />
        ) : (
            <FolderOpen />
        );
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
                        {name}
                    </Link>
                ) : (
                    name
                )}
            </span>
        </div>
    );
};

export default Node;
