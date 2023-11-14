// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useRef, useEffect } from "react";
import { Tree } from "react-arborist";
import { Button } from "../ui/button";
import type { TreeNode } from "@/types/index";
import { updateHasLicenseFindings } from "@/helpers/updateHasLicenseFindings";
import { extractUniqueLicenses } from "@/helpers/extractUniqueLicenses";
import { filterTreeDataByLicense } from "@/helpers/filterTreeDataByLicense";
import { parseAsString, useQueryState } from "next-usequerystate";
import { convertJsonToTree } from "@/helpers/convertJsonToTree";
import { userHooks } from "@/hooks/zodiosHooks";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ComboBoxPackage from "@/components/package_inspector/ComboBoxPackage";
import Node from "@/components/package_inspector/Node";
import type { SelectedNode } from "@/types/index";
import ExclusionTools from "@/components/path_exclusions/ExclusionTools";
import ExclusionDB from "@/components/path_exclusions/ExclusionDB";

type Props = {
    purl: string | undefined;
};

const PackageTree = ({ purl }: Props) => {
    const [treeFilter, setTreeFilter] = useState("");
    const [licenseFilter, setLicenseFilter] = useQueryState(
        "licenseFilter",
        parseAsString.withDefault(""),
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const [treeHeight, setTreeHeight] = useState(0);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [originalTreeData, setOriginalTreeData] = useState<TreeNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<SelectedNode>();
    const treeRef = useRef<HTMLDivElement>(null);

    // Fetch the package file tree data
    const { data, isLoading, error } = userHooks.useImmutableQuery(
        "/filetree",
        { purl: purl as string },
        { withCredentials: true },
        { enabled: !!purl },
    );

    // Fetch the path exclusions for the package
    const { data: pathExclusions } = userHooks.useImmutableQuery(
        "/path-exclusions",
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

    return (
        <div className="flex flex-col h-full">
            <div className="flex-row p-1 mb-2 border rounded-md shadow-lg">
                <Label className="font-bold">Package: </Label>
                <Badge className="rounded-md">{purl}</Badge>
            </div>

            <div className="flex items-center p-1 mb-3 text-sm border rounded-md shadow-lg">
                <Input
                    className="w-full p-1 text-xs rounded-md"
                    type="text"
                    placeholder="Filter"
                    value={treeFilter}
                    onChange={handleTreeFilter}
                />
                <Button
                    className="p-1 ml-2 text-xs rounded-md"
                    onClick={handleExpand}
                    variant={"outline"}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </Button>
            </div>

            <ExclusionTools selectedNode={selectedNode} purl={purl} />

            <div className="flex-1 pl-1 overflow-auto" ref={treeRef}>
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-16 h-16 mr-2 animate-spin" />
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
                                purl={purl}
                            />
                        )}
                    </Tree>
                )}
                {error && (
                    <div className="flex items-center justify-center h-full">
                        Unable to fetch package data
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center p-1 mt-2 text-sm border rounded-md shadow-lg">
                <div className="mb-1 w-full">
                    <ComboBoxPackage
                        data={uniqueLicenses}
                        filterString={"licenseFilter"}
                    />
                </div>
                <ExclusionDB purl={purl} fractionalWidth={1.0} />
            </div>
        </div>
    );
};

export default PackageTree;
