// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { NodeApi, Tree, TreeApi } from "react-arborist";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ClearanceTools from "@/components/main_ui/inspector/package_inspector/ClearanceTools";
import LicenseSelector from "@/components/main_ui/inspector/package_inspector/LicenseSelector";
import Node from "@/components/main_ui/inspector/package_inspector/Node";
import { convertJsonToTree } from "@/helpers/convertJsonToTree";
import { decomposeLicenses } from "@/helpers/decomposeLicenses";
import { extractUniqueLicenses } from "@/helpers/extractUniqueLicenses";
import { findNodeByPath } from "@/helpers/findNodeByPath";
import { findNodesWithLicense } from "@/helpers/findNodesWithLicense";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { stringToColour } from "@/helpers/stringToColour";
import {
    clearSelectedNodes,
    updateSelectedNodes,
} from "@/helpers/treeSelectionUtils";
import type { SelectedNode, TreeNode } from "@/types/index";

type Props = {
    purl: string;
    path: string | undefined;
};

const PackageInspector = ({ purl, path }: Props) => {
    const [treeFilter, setTreeFilter] = useState("");
    const [licenseFilter] = useQueryState(
        "licenseFilter",
        parseAsString.withDefault(""),
    );
    const [filtering, setFiltering] = useQueryState(
        "filtering",
        parseAsBoolean.withDefault(false),
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const [treeHeight, setTreeHeight] = useState(0);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [, setSelectedNode] = useState<SelectedNode>();
    const [openedNodeId, setOpenedNodeId] = useState<string>();
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState<NodeApi<TreeNode>[]>([]);
    const [glob, setGlob] = useState<string>("");
    const treeDivRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathPurl = toPathPurl(purl);

    // Fetch the package file tree data
    const { data, isLoading, error } = userHooks.useGetFileTree(
        {
            withCredentials: true,
            params: {
                purl: pathPurl,
            },
        },
        { enabled: !!pathPurl },
    );

    // Fetch the path exclusions for the package
    const { data: pathExclusions } = userHooks.useGetPathExclusionsByPurl(
        {
            withCredentials: true,
            params: {
                purl: pathPurl,
            },
        },
        { enabled: !!pathPurl },
    );

    const treeRef = useRef<TreeApi<TreeNode>>();
    const uniqueLicenses = decomposeLicenses(extractUniqueLicenses(treeData));
    const uniqueLicensesToColorMap = new Map<string, string>();

    uniqueLicenses.forEach((license) => {
        uniqueLicensesToColorMap.set(license, stringToColour(license));
    });

    const handleTreeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTreeFilter(event.target.value);
    };

    // When not in license filtering mode, search the tree by name of node.
    // When in license filtering mode, search the tree by filtered license.
    const handleSearch = (node: NodeApi<TreeNode>, term: string): boolean => {
        if (licenseFilter && filtering) {
            return (
                node.data.file?.licenseFindings.some((license) =>
                    license.licenseExpressionSPDX
                        .toLowerCase()
                        .includes(licenseFilter.toLowerCase()),
                ) || false
            );
        } else {
            return (
                node.data.name.toLowerCase().includes(term.toLowerCase()) ||
                false
            );
        }
    };

    const handleResize = () => {
        if (treeDivRef.current) {
            const { offsetHeight } = treeDivRef.current;
            setTreeHeight(offsetHeight);
        }
    };

    // Update the selected nodes when a node is selected or deselected
    const handleNodeSelection = (
        node: NodeApi<TreeNode>,
        isSelected: boolean,
    ): void => {
        updateSelectedNodes(
            node,
            isSelected,
            selectedNodes,
            setSelectedNodes,
            setGlob,
        );
    };

    // Open the nodes that have the filtered license
    const handleOpenFilteredNodes = () => {
        const nodes = findNodesWithLicense(treeData, licenseFilter);
        // This is a temporary fix for DO-601: don't close all nodes
        // before opening the nodes with a filtered license, because
        // the latter doesn't work in all cases
        //treeRef.current?.closeAll();
        for (const node of nodes) {
            treeRef.current?.openParents(node.id);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
    }, []);

    // Construct the tree data
    useEffect(() => {
        if (data && pathExclusions) {
            const convertedData = convertJsonToTree(
                data.filetrees,
                pathExclusions.pathExclusions.map(
                    (exclusion) => exclusion.pattern,
                ),
                "",
            );
            setTreeData(convertedData);
        }
    }, [data, pathExclusions]);

    // Handle expanding and collapsing the whole tree
    useEffect(() => {
        if (isExpanded && (!licenseFilter || filtering)) {
            treeRef.current?.openAll();
        } else if (!isExpanded && !filtering && !licenseFilter) {
            treeRef.current?.closeAll();
        }
    }, [isExpanded, filtering, licenseFilter, treeRef]);

    useEffect(() => {
        if (path) {
            const node = findNodeByPath(treeData, path);
            if (node) {
                setOpenedNodeId(node.id);
                treeRef.current?.select(node);
            }
        }
    }, [path, treeData, treeRef]);

    // When in license filtering mode, trick the tree search by license
    // to activate by setting an arbitrary text to the search input.
    // Use this text to inform the user that text search is not in use in
    // filtering mode
    useEffect(() => {
        if (filtering) {
            setTreeFilter("- Not in use in filtering mode -");
        } else {
            setTreeFilter("");
            if (licenseFilter) {
                handleOpenFilteredNodes();
            }
        }
    }, [filtering, treeData, licenseFilter]);

    return (
        <div className="flex h-full flex-col">
            <div className="mb-3 flex items-center text-sm">
                <Input
                    className="w-full rounded-md text-xs"
                    type="text"
                    placeholder="Filter"
                    value={treeFilter}
                    disabled={filtering}
                    onChange={handleTreeFilter}
                />
                <Button
                    className="ml-2 rounded-md p-1 text-xs"
                    onClick={() => {
                        if (isExpanded) {
                            treeRef.current?.closeAll();
                        } else {
                            treeRef.current?.openAll();
                        }
                        setIsExpanded(!isExpanded);
                    }}
                    variant={"outline"}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <ClearanceTools
                    purl={purl}
                    className="mr-2 flex-1"
                    onSelectionModeChange={(mode) => {
                        setIsSelectionMode(mode);
                    }}
                    onClearSelection={() => {
                        clearSelectedNodes(selectedNodes, setGlob);
                        setSelectedNodes([]);
                    }}
                    glob={glob}
                />
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                className="text-xs"
                                variant="outline"
                                disabled={licenseFilter === ""}
                                pressed={filtering}
                                onPressedChange={() => {
                                    setFiltering(!filtering);
                                }}
                            >
                                {filtering ? (
                                    <span className="font-bold text-red-500">
                                        Filtering
                                    </span>
                                ) : (
                                    "Filter"
                                )}
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            {filtering
                                ? "Toggle license filter off to show the whole tree"
                                : "Toggle license filter on to filter the tree by license"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Separator className="mb-2" />

            <div className="flex-1 overflow-auto pl-1" ref={treeDivRef}>
                {isLoading && (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
                {data && pathExclusions && (
                    <Tree
                        className=""
                        data={treeData}
                        openByDefault={false}
                        searchTerm={treeFilter}
                        searchMatch={(node, term) => handleSearch(node, term)}
                        width="100%"
                        height={treeHeight}
                        indent={12}
                        rowHeight={20}
                        paddingTop={30}
                        paddingBottom={10}
                        padding={25}
                        onFocus={(node) => {
                            setSelectedNode(node);
                            if (node.isLeaf) {
                                setOpenedNodeId(node.id);
                                {
                                    !isSelectionMode &&
                                        router.push({
                                            pathname: `/packages/${encodeURIComponent(
                                                purl || "",
                                            )}/tree/${encodeURIComponent(
                                                node.data.path || "",
                                            )}`,
                                            query: licenseFilter
                                                ? {
                                                      licenseFilter: `${licenseFilter}`,
                                                      filtering: `${filtering}`,
                                                  }
                                                : {},
                                        });
                                }
                            }
                        }}
                        ref={treeRef}
                    >
                        {(nodeProps) => (
                            <Node
                                {...nodeProps}
                                licenseFilter={licenseFilter}
                                filtering={filtering}
                                purl={purl}
                                openedNodeId={openedNodeId}
                                uniqueLicenses={uniqueLicensesToColorMap}
                                isSelectionMode={isSelectionMode}
                                setIsSelected={(isSelected) =>
                                    handleNodeSelection(
                                        nodeProps.node,
                                        isSelected,
                                    )
                                }
                            />
                        )}
                    </Tree>
                )}
                {error && (
                    <div className="flex h-full items-center justify-center">
                        Unable to fetch package data
                    </div>
                )}
            </div>

            <Separator className="mb-2" />

            <div className="flex flex-col items-center text-sm">
                <LicenseSelector
                    data={uniqueLicensesToColorMap}
                    filterString={"licenseFilter"}
                    className="mb-1 w-full"
                />
            </div>
        </div>
    );
};

export default PackageInspector;
