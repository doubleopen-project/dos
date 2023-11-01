// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useRef, useEffect } from "react";
import { Tree } from "react-arborist";
import { Button } from "./ui/button";
import type { TreeNode } from "@/types/index";
import { updateHasLicenseFindings } from "@/helpers/updateHasLicenseFindings";
import { extractUniqueLicenses } from "@/helpers/extractUniqueLicenses";
import { filterTreeDataByLicense } from "@/helpers/filterTreeDataByLicense";
import { parseAsString, useQueryState } from "next-usequerystate";
import { convertJsonToTree } from "@/helpers/convertJsonToTree";
import { userHooks } from "@/hooks/zodiosHooks";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import ComboBoxPackage from "./ComboBoxPackage";
import Node from "./Node";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import ExclusionForm from "@/components/ExclusionForm";
import ExclusionList from "@/components/ExclusionList";
import { DialogClose } from "@radix-ui/react-dialog";
import ExclusionFormDialog from "./ExclusionFormDialog";

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
            <div className="flex-row p-1 mb-2 rounded-md border shadow-lg">
                <Label className="font-bold">Package: </Label>
                <Badge className="rounded-md">{purl}</Badge>
            </div>

            <div className="p-1 mb-2 rounded-md border shadow-lg flex items-center text-sm">
                <Input
                    className="p-1 rounded-md w-full text-xs"
                    type="text"
                    placeholder="Filter"
                    value={treeFilter}
                    onChange={handleTreeFilter}
                />
                <Button
                    className="text-xs p-1 rounded-md ml-2"
                    onClick={handleExpand}
                    variant={"outline"}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </Button>
            </div>

            <div className="flex-1 pl-1 overflow-auto" ref={treeRef}>
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
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

            <div className="p-1 mt-2 rounded-md shadow-lg border flex flex-col items-center text-sm">
                <ComboBoxPackage
                    data={uniqueLicenses}
                    filterString={"licenseFilter"}
                />
                <div className="pt-1 rounded-md flex text-sm justify-end">
                    <ExclusionList purl={purl} />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="text-xs p-1 rounded-md ml-2"
                            >
                                Add path exclusion
                            </Button>
                        </DialogTrigger>
                        <ExclusionFormDialog purl={purl} />
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PackageTree;
