// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
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
import { findNodeByPath } from "@/helpers/findNodeByPath";
import { findNodesWithLicense } from "@/helpers/findNodesWithLicense";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { searchForLicense } from "@/helpers/searchForLicense";
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
    const session = useSession();
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
    const [excludedPaths, setExcludedPaths] = useState<Set<string>>(new Set());
    const [concludedPaths, setConcludedPaths] = useState<Set<string>>(
        new Set(),
    );
    const [uniqueLicensesToColorMap, setUniqueLicensesToColorMap] =
        useState<Map<string, string> | null>(null);
    const [
        fileSha256ToDecomposedLicensesMap,
        setFileSha256ToDecomposedLicensesMap,
    ] = useState<Map<string, Set<string>> | null>(null);
    const [fileSha256ToLFsMap, setFileSha256ToLFsMap] = useState<Map<
        string,
        string[]
    > | null>(null);
    const [glob, setGlob] = useState<string>("");
    const treeDivRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathPurl = toPathPurl(purl);
    const peWorkerRef = useRef<Worker>();
    const lcWorkerRef = useRef<Worker>();

    // Fetch the package file tree data
    const { data, isLoading, error } = userHooks.useGetFileTree(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
            params: {
                purl: pathPurl,
            },
        },
        { enabled: !!pathPurl },
    );

    // Fetch the package license findings data
    const { data: lfData } = userHooks.useGetLicenseFindingsForPackage(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
            params: {
                purl: pathPurl,
            },
        },
        { enabled: !!pathPurl },
    );

    // Fetch the package path exclusions data
    const { data: pathExclusionsData } = userHooks.useGetPathExclusionsByPurl(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
            params: {
                purl: pathPurl,
            },
        },
        { enabled: !!pathPurl },
    );

    // Fetch the package license conclusions data
    const { data: licenseConclusionsData } = userHooks.useGetLicenseConclusions(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
            queries: {
                purl: purl,
            },
        },
        { enabled: !!purl },
    );

    const treeRef = useRef<TreeApi<TreeNode>>();

    const handleTreeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTreeFilter(event.target.value);
    };

    // When not in license filtering mode, search the tree by name of node.
    // When in license filtering mode, search the tree by filtered license.
    const handleSearch = (node: NodeApi<TreeNode>, term: string): boolean => {
        if (licenseFilter && filtering && fileSha256ToLFsMap) {
            const fileSha256 = node.data.fileSha256;

            if (!fileSha256) return false;

            const lfs = fileSha256ToLFsMap.get(fileSha256);
            if (!lfs) return false;

            return (
                lfs.some((license) =>
                    license.toLowerCase().includes(licenseFilter.toLowerCase()),
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
        if (!lfData) return;
        const nodes = findNodesWithLicense(treeData, licenseFilter, lfData);
        treeRef.current?.closeAll();
        for (const node of nodes) {
            treeRef.current?.openParents(node.id);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
    }, []);

    // Process license finding data
    useEffect(() => {
        if (lfData) {
            const uniqueLicensesToColor = new Map<string, string>();
            const fileSha256ToDecomposedLicenses = new Map<
                string,
                Set<string>
            >();
            const fileSha256ToLFs = new Map<string, string[]>();

            const allLicenses = new Set<string>(
                lfData.licenseFindings.map((lf) => lf.licenseExpressionSPDX),
            );

            const decomposedLicenses = decomposeLicenses(allLicenses);

            decomposedLicenses.forEach((license) => {
                uniqueLicensesToColor.set(license, stringToColour(license));

                for (const lf of lfData.licenseFindings) {
                    if (
                        license === lf.licenseExpressionSPDX ||
                        searchForLicense(license, lf.licenseExpressionSPDX)
                    ) {
                        if (
                            !fileSha256ToDecomposedLicenses.has(lf.fileSha256)
                        ) {
                            fileSha256ToDecomposedLicenses.set(
                                lf.fileSha256,
                                new Set([license]),
                            );
                        } else {
                            fileSha256ToDecomposedLicenses.set(
                                lf.fileSha256,
                                new Set([
                                    ...fileSha256ToDecomposedLicenses.get(
                                        lf.fileSha256,
                                    )!,
                                    license,
                                ]),
                            );
                        }
                    }
                }
            });

            lfData.licenseFindings.forEach((lf) => {
                if (!fileSha256ToLFs.has(lf.fileSha256)) {
                    fileSha256ToLFs.set(lf.fileSha256, [
                        lf.licenseExpressionSPDX,
                    ]);
                } else {
                    fileSha256ToLFs
                        .get(lf.fileSha256)
                        ?.push(lf.licenseExpressionSPDX);
                }
            });

            setUniqueLicensesToColorMap(uniqueLicensesToColor);
            setFileSha256ToDecomposedLicensesMap(
                fileSha256ToDecomposedLicenses,
            );
            setFileSha256ToLFsMap(fileSha256ToLFs);
        }
    }, [lfData]);

    // Construct the tree data
    useEffect(() => {
        if (data) {
            const convertedData = convertJsonToTree(data.filetrees);
            setTreeData(convertedData);
        }
    }, [data]);

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
            if (licenseFilter && lfData) {
                handleOpenFilteredNodes();
            }
        }
    }, [filtering, treeData, licenseFilter]);

    useEffect(() => {
        /*
         * Create a new web worker for updating the excluded nodes when path
         * exclusion data is available the first time, or when it changes
         */
        peWorkerRef.current = new Worker(
            new URL(
                "@/workers/pathExclusionsWorker.worker.ts",
                import.meta.url,
            ),
        );
        /*
         * Create the same for license conclusions
         */
        lcWorkerRef.current = new Worker(
            new URL(
                "@/workers/licenseConclusionsWorker.worker.ts",
                import.meta.url,
            ),
        );

        // Set up event listener for messages from the worker
        peWorkerRef.current.onmessage = (event) => {
            // Set the excluded nodes based on the data from the worker
            // The Node component will use this data to style the nodes
            setExcludedPaths(event.data);
        };

        lcWorkerRef.current.onmessage = (event) => {
            // Set the concluded nodes based on the data from the worker
            // The Node component will use this data to style the nodes
            setConcludedPaths(event.data);
        };

        // Clean up the workers when the component unmounts
        return () => {
            peWorkerRef.current?.terminate();
            lcWorkerRef.current?.terminate();
        };
    }, []); // Run this effect only once when the component mounts

    useEffect(() => {
        if (pathExclusionsData && treeData.length > 0) {
            // Post the path exclusions data to the worker
            // The worker will then figure out which nodes to exclude
            peWorkerRef.current?.postMessage({
                tree: treeData,
                pathExclusionPatterns: pathExclusionsData.pathExclusions.map(
                    (pe) => pe.pattern,
                ),
            });
        }
    }, [pathExclusionsData, treeData]);

    useEffect(() => {
        if (licenseConclusionsData && treeData.length > 0) {
            const filesWithLCs = new Set();

            licenseConclusionsData.licenseConclusions.forEach((lc) => {
                filesWithLCs.add(lc.fileSha256);
            });
            // Post the path exclusions data to the worker
            // The worker will then figure out which nodes to exclude
            lcWorkerRef.current?.postMessage({
                tree: treeData,
                filesWithLCs: filesWithLCs,
            });
        }
    }, [licenseConclusionsData, treeData]);

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
                {data && (
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
                                fileSha256ToDecomposedLicensesMap={
                                    fileSha256ToDecomposedLicensesMap
                                }
                                uniqueLicenses={uniqueLicensesToColorMap}
                                isSelectionMode={isSelectionMode}
                                setIsSelected={(isSelected) =>
                                    handleNodeSelection(
                                        nodeProps.node,
                                        isSelected,
                                    )
                                }
                                excludedPaths={excludedPaths}
                                concludedPaths={concludedPaths}
                            />
                        )}
                    </Tree>
                )}
                {error && (
                    <div className="flex h-full items-center justify-center font-semibold text-red-500">
                        Error: {getErrorMessage(error)}
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
