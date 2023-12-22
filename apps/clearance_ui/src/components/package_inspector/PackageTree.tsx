// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    parseAsBoolean,
    parseAsString,
    useQueryState,
} from "next-usequerystate";
import { Tree, TreeApi } from "react-arborist";
import { userHooks } from "@/hooks/zodiosHooks";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ComboBoxPackage from "@/components/package_inspector/ComboBoxPackage";
import Node from "@/components/package_inspector/Node";
import ExclusionDB from "@/components/path_exclusions/ExclusionDB";
import ExclusionTools from "@/components/path_exclusions/ExclusionTools";
import { convertJsonToTree } from "@/helpers/convertJsonToTree";
import { extractUniqueLicenses } from "@/helpers/extractUniqueLicenses";
import { filterTreeDataByLicense } from "@/helpers/filterTreeDataByLicense";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { updateHasLicenseFindings } from "@/helpers/updateHasLicenseFindings";
import type { SelectedNode, TreeNode } from "@/types/index";
import { Button } from "../ui/button";

type Props = {
    purl: string;
};

const PackageTree = ({ purl }: Props) => {
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
    const [originalTreeData, setOriginalTreeData] = useState<TreeNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<SelectedNode>();
    const treeRef = useRef<HTMLDivElement>(null);

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

    let tree: TreeApi<TreeNode> | null | undefined;
    const uniqueLicenses = extractUniqueLicenses(originalTreeData);

    const handleTreeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTreeFilter(event.target.value);
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

    // Update tree data when the license filter is set and filtered is true
    useEffect(() => {
        if (licenseFilter && filtering) {
            let updatedTreeData = JSON.parse(JSON.stringify(originalTreeData)); // Create a deep copy

            // Filter the tree based on the licenseSearchText
            updatedTreeData = filterTreeDataByLicense(
                updatedTreeData,
                licenseFilter,
            );

            updateHasLicenseFindings(updatedTreeData, licenseFilter); // Update hasLicenseFindings flag
            setTreeData(updatedTreeData); // Set the updated and/or filtered tree data to trigger a re-render
            setIsExpanded(true); // Expand the tree when filtering
        } else {
            // Reset to original tree data if licenseFilter is empty
            setTreeData(originalTreeData);
            setIsExpanded(false);
        }
    }, [licenseFilter, filtering, originalTreeData]);

    // Return the whole original tree data when the license search text is empty
    useEffect(() => {
        if (data && pathExclusions) {
            const convertedData = convertJsonToTree(
                data.filetrees,
                pathExclusions.pathExclusions.map(
                    (exclusion) => exclusion.pattern,
                ),
            );
            setTreeData(convertedData);
            setOriginalTreeData(convertedData);
        }
    }, [data, pathExclusions]);

    // This should have worked without useEffect, as a component should be re-rendered
    // when the isExpanded state changes. However, it didn't
    useEffect(() => {
        if (isExpanded) {
            tree?.openAll();
        } else {
            tree?.closeAll();
        }
    }, [isExpanded]);

    return (
        <div className="flex h-full flex-col">
            <div className="mb-2 flex-row rounded-md border p-1 shadow-lg">
                <Label className="font-bold">Package: </Label>
                <Badge className="rounded-md">{purl}</Badge>
            </div>

            <div className="mb-3 flex items-center rounded-md border p-1 text-sm shadow-lg">
                <Input
                    className="w-full rounded-md p-1 text-xs"
                    type="text"
                    placeholder="Filter"
                    value={treeFilter}
                    onChange={handleTreeFilter}
                />
                <Button
                    className="ml-2 rounded-md p-1 text-xs"
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant={"outline"}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <ExclusionTools
                    selectedNode={selectedNode}
                    purl={purl}
                    className="mr-2 flex-1"
                />
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                className="text-xs"
                                variant="outline"
                                disabled={licenseFilter === ""}
                                pressed={filtering}
                                onPressedChange={() => setFiltering(!filtering)}
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

            <div className="flex-1 overflow-auto pl-1" ref={treeRef}>
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
                        onFocus={(node) => setSelectedNode(node)}
                        ref={(t) => (tree = t)}
                    >
                        {(nodeProps) => (
                            <Node
                                {...nodeProps}
                                licenseFilter={licenseFilter}
                                filtering={filtering}
                                purl={purl}
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

            <div className="mt-2 flex flex-col items-center rounded-md border p-1 text-sm shadow-lg">
                <ComboBoxPackage
                    data={uniqueLicenses}
                    filterString={"licenseFilter"}
                    className="mb-1 w-full"
                />
                <ExclusionDB purl={purl} fractionalWidth={1.0} />
            </div>
        </div>
    );
};

export default PackageTree;
