// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useRef, useEffect } from "react";
import { Tree, NodeRendererProps } from "react-arborist";
import {
    BsFileText as FileText,
    BsFolder as FolderClosed,
    BsFolder2Open as FolderOpen,
} from "react-icons/bs";
import { Button } from "./ui/button";
import type { TreeNode } from "@/types/index";
import { updateHasLicenseFindings } from "@/helpers/updateHasLicenseFindings";
import { extractUniqueLicenses } from "@/helpers/extractUniqueLicenses";
import { filterTreeDataByLicense } from "@/helpers/filterTreeDataByLicense";
import { parseAsString, useQueryState } from "next-usequerystate";
import { convertJsonToTree } from "@/helpers/convertJsonToTree";
import { userHooks } from "@/hooks/zodiosHooks";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import ComboBoxPackage from "./ComboBoxPackage";

type PackageTreeProps = {
    purl: string | undefined;
};

const PackageTree = ({ purl }: PackageTreeProps) => {
    const [treeFilter, setTreeFilter] = useState("");
    const [licenseFilter, setLicenseFilter] = useQueryState(
        "licenseFilter",
        parseAsString.withDefault(""),
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const [treeHeight, setTreeHeight] = useState(0);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [originalTreeData, setOriginalTreeData] = useState<TreeNode[]>([]);
    const treeRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = userHooks.useImmutableQuery(
        "/filetree",
        { purl: purl as string },
        { withCredentials: true },
        { enabled: !!purl },
    );

    const handleTreeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTreeFilter(event.target.value);
    };

    let tree: any;
    const uniqueLicenses = extractUniqueLicenses(treeData);

    const handleExpand = () => {
        if (!isExpanded) {
            tree.openAll();
            setIsExpanded(true);
        } else {
            tree.closeAll();
            setIsExpanded(false);
        }
    };

    const handleResize = () => {
        if (treeRef.current) {
            const { offsetHeight } = treeRef.current;
            setTreeHeight(offsetHeight);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
    }, []);

    // Update tree data when the license search text is changed
    useEffect(() => {
        if (licenseFilter) {
            let updatedTreeData = JSON.parse(JSON.stringify(treeData)); // Create a deep copy
            updateHasLicenseFindings(updatedTreeData, licenseFilter); // Update hasLicenseFindings flag

            // Filter the tree based on the licenseSearchText
            updatedTreeData = filterTreeDataByLicense(
                updatedTreeData,
                licenseFilter,
            );

            setTreeData(updatedTreeData); // Set the updated and/or filtered tree data to trigger a re-render
        } else {
            // Reset to original tree data if licenseFilter is empty
            setTreeData(originalTreeData);
        }
    }, [licenseFilter, originalTreeData]);

    // Return the whole original tree data when the license search text is empty
    useEffect(() => {
        if (data) {
            const convertedData = convertJsonToTree(data.filetrees);
            setTreeData(convertedData);
            setOriginalTreeData(convertedData);
        }
    }, [data]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-row p-1 mb-2 rounded-md bg-white shadow">
                <Label className="font-bold">Package: </Label>
                <Badge className="rounded-md">{purl}</Badge>
            </div>

            <div className="p-2 mb-2 rounded-md bg-white shadow flex items-center text-sm">
                <Input
                    className="bg-gray-200 p-2 rounded-lg w-full"
                    type="text"
                    placeholder="Filter"
                    value={treeFilter}
                    onChange={handleTreeFilter}
                />
                <Button
                    className="bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2"
                    onClick={handleExpand}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </Button>
            </div>

            <div
                className="flex-1 pl-1 overflow-auto bg-gray-100"
                ref={treeRef}
            >
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
                {data && (
                    <Tree
                        data={treeData}
                        openByDefault={false}
                        searchTerm={treeFilter}
                        searchMatch={(node, term) =>
                            node.data.name
                                .toLowerCase()
                                .includes(term.toLowerCase())
                        }
                        width="100%"
                        height={treeHeight}
                        indent={12}
                        rowHeight={20}
                        paddingTop={30}
                        paddingBottom={10}
                        padding={25}
                        ref={(t) => (tree = t)}
                    >
                        {(nodeProps) => (
                            <Node
                                {...nodeProps}
                                licenseFilter={licenseFilter}
                                purl={purl}
                            />
                        )}
                    </Tree>
                )}
                {error && (
                    <div className="flex justify-center items-center h-full">
                        Unable to fetch package data
                    </div>
                )}
            </div>

            <div className="p-2 mt-2 rounded-md bg-white shadow flex items-center text-sm">
                <ComboBoxPackage
                    data={uniqueLicenses}
                    filterString={"licenseFilter"}
                />
            </div>
        </div>
    );
};

type NodeProps = NodeRendererProps<any> & {
    purl: string | undefined;
    licenseFilter: string | null;
};

function Node({ node, style, purl, licenseFilter }: NodeProps) {
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
}

export default PackageTree;
