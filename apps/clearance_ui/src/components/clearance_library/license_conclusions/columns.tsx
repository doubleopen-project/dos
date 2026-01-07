// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ColumnDef } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import {
    ChevronDownIcon,
    ChevronsUpDownIcon,
    ChevronUpIcon,
} from "lucide-react";
import Link from "next/link";
import { Options } from "nuqs";
import { PackageURL } from "packageurl-js";
import { userAPI } from "validation-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ActionCell from "@/components/clearance_library/license_conclusions/ActionCell";
import TableCell from "@/components/clearance_library/license_conclusions/TableCell";
import ClearanceGroupTooltipIcon from "@/components/common/clearance_groups/ClearanceGroupTooltipIcon";
import LCAffectedFilesTooltip from "@/components/common/LCAffectedFilesTooltip";
import PurlDetails from "@/components/common/PurlDetails";

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

export const columns = (
    sortBy: string | null,
    sortOrder: string | null,
    setSortBy: (
        value:
            | "contextPurl"
            | "username"
            | "detectedLicenseExpressionSPDX"
            | "concludedLicenseExpressionSPDX"
            | "comment"
            | "local"
            | "updatedAt"
            | ((
                  old:
                      | "contextPurl"
                      | "username"
                      | "detectedLicenseExpressionSPDX"
                      | "concludedLicenseExpressionSPDX"
                      | "comment"
                      | "local"
                      | "updatedAt"
                      | null,
              ) =>
                  | "contextPurl"
                  | "username"
                  | "detectedLicenseExpressionSPDX"
                  | "concludedLicenseExpressionSPDX"
                  | "comment"
                  | "local"
                  | "updatedAt"
                  | null)
            | null,
        options?: Options | undefined,
    ) => Promise<URLSearchParams>,
    setSortOrder: (
        value:
            | "asc"
            | "desc"
            | ((old: "asc" | "desc" | null) => "asc" | "desc" | null)
            | null,
        options?: Options | undefined,
    ) => Promise<URLSearchParams>,
    setPageIndex: (
        value: number | ((old: number) => number | null) | null,
        options?: Options | undefined,
    ) => Promise<URLSearchParams>,
): ColumnDef<LicenseConclusion>[] => {
    return [
        {
            accessorKey: "updatedAt",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "updatedAt") {
                                setSortBy("updatedAt");
                                setSortOrder("asc");
                                setPageIndex(1);
                            } else {
                                if (!sortOrder) {
                                    setSortOrder("asc");
                                    setPageIndex(1);
                                } else {
                                    if (sortOrder === "asc") {
                                        setSortOrder("desc");
                                        setPageIndex(1);
                                    } else {
                                        setSortOrder("asc");
                                        setPageIndex(1);
                                    }
                                }
                            }
                        }}
                    >
                        <Label className="cursor-pointer font-bold">
                            Updated
                        </Label>
                        {sortBy === "updatedAt" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "updatedAt" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <>
                    {
                        new Date(row.getValue("updatedAt"))
                            .toISOString()
                            .split("T")[0]
                    }
                </>
            ),
        },
        {
            accessorKey: "contextPurl",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "contextPurl") {
                                setSortBy("contextPurl");
                                setSortOrder("asc");
                                setPageIndex(1);
                            } else {
                                if (!sortOrder) {
                                    setSortOrder("asc");
                                    setPageIndex(1);
                                } else {
                                    if (sortOrder === "asc") {
                                        setSortOrder("desc");
                                        setPageIndex(1);
                                    } else {
                                        setSortOrder(null);
                                        setSortBy(null);
                                        setPageIndex(1);
                                    }
                                }
                            }
                        }}
                    >
                        <Label className="cursor-pointer font-bold">
                            Package
                        </Label>
                        {sortBy === "contextPurl" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "contextPurl" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const pkg = PackageURL.fromString(row.original.contextPurl);
                const pkgName = pkg.name + ":" + pkg.version;
                return (
                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Link
                                    className="font-semibold text-blue-400"
                                    href={`/packages/${encodeURIComponent(
                                        row.original.contextPurl,
                                    )}`}
                                >
                                    {pkgName}
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <PurlDetails purl={row.original.contextPurl} />
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
        },
        {
            accessorKey: "username",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "username") {
                                setSortBy("username");
                                setSortOrder("asc");
                                setPageIndex(1);
                            } else {
                                if (!sortOrder) {
                                    setSortOrder("asc");
                                    setPageIndex(1);
                                } else {
                                    if (sortOrder === "asc") {
                                        setSortOrder("desc");
                                        setPageIndex(1);
                                    } else {
                                        setSortOrder(null);
                                        setSortBy(null);
                                        setPageIndex(1);
                                    }
                                }
                            }
                        }}
                    >
                        <Label className="cursor-pointer font-bold">
                            Creator
                        </Label>
                        {sortBy === "username" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "username" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Badge className="bg-green-400 text-sm">
                    {row.original.curator.username}
                </Badge>
            ),
            sortingFn: (a, b) => {
                return a.original.curator.username.localeCompare(
                    b.original.curator.username,
                );
            },
        },
        {
            accessorKey: "licenseExpressionSPDX",
            header: () => (
                <Label className="cursor-pointer font-bold">
                    SPDX License Expression
                </Label>
            ),
            columns: [
                {
                    accessorKey: "detectedLicenseExpressionSPDX",
                    header: () => {
                        return (
                            <Button
                                variant="ghost"
                                className="px-0"
                                onClick={() => {
                                    if (
                                        sortBy !==
                                        "detectedLicenseExpressionSPDX"
                                    ) {
                                        setSortBy(
                                            "detectedLicenseExpressionSPDX",
                                        );
                                        setSortOrder("asc");
                                        setPageIndex(1);
                                    } else {
                                        if (!sortOrder) {
                                            setSortOrder("asc");
                                            setPageIndex(1);
                                        } else {
                                            if (sortOrder === "asc") {
                                                setSortOrder("desc");
                                                setPageIndex(1);
                                            } else {
                                                setSortOrder(null);
                                                setSortBy(null);
                                                setPageIndex(1);
                                            }
                                        }
                                    }
                                }}
                            >
                                <Label className="cursor-pointer font-bold">
                                    Detected
                                </Label>
                                {sortBy === "detectedLicenseExpressionSPDX" &&
                                sortOrder === "desc" ? (
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                ) : sortBy ===
                                      "detectedLicenseExpressionSPDX" &&
                                  sortOrder === "asc" ? (
                                    <ChevronUpIcon className="ml-2 h-4 w-4" />
                                ) : (
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        );
                    },
                },
                {
                    accessorKey: "concludedLicenseExpressionSPDX",
                    header: () => {
                        return (
                            <Button
                                variant="ghost"
                                className="px-0"
                                onClick={() => {
                                    if (
                                        sortBy !==
                                        "concludedLicenseExpressionSPDX"
                                    ) {
                                        setSortBy(
                                            "concludedLicenseExpressionSPDX",
                                        );
                                        setSortOrder("asc");
                                        setPageIndex(1);
                                    } else {
                                        if (!sortOrder) {
                                            setSortOrder("asc");
                                            setPageIndex(1);
                                        } else {
                                            if (sortOrder === "asc") {
                                                setSortOrder("desc");
                                                setPageIndex(1);
                                            } else {
                                                setSortOrder(null);
                                                setSortBy(null);
                                                setPageIndex(1);
                                            }
                                        }
                                    }
                                }}
                            >
                                <Label className="cursor-pointer font-bold">
                                    Concluded
                                </Label>
                                {sortBy === "concludedLicenseExpressionSPDX" &&
                                sortOrder === "desc" ? (
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                ) : sortBy ===
                                      "concludedLicenseExpressionSPDX" &&
                                  sortOrder === "asc" ? (
                                    <ChevronUpIcon className="ml-2 h-4 w-4" />
                                ) : (
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        );
                    },
                    cell: TableCell,
                    meta: {
                        type: "text",
                    },
                },
            ],
        },
        {
            accessorKey: "affectedPaths",
            header: () => (
                <Label className="cursor-pointer font-bold">
                    Affected Files
                </Label>
            ),
            columns: [
                {
                    accessorKey: "affectedPathsThis",
                    header: () => {
                        return (
                            <Label className="cursor-pointer font-bold">
                                This
                            </Label>
                        );
                    },
                    cell: ({ row }) => {
                        return (
                            <LCAffectedFilesTooltip
                                licenseConclusionId={row.original.id}
                                mode="context"
                                badgeStyle="bg-blue-400 text-sm"
                            />
                        );
                    },
                },
                {
                    accessorKey: "affectedPathsOther",
                    header: () => {
                        return (
                            <Label className="cursor-pointer font-bold">
                                Other
                            </Label>
                        );
                    },
                    cell: ({ row }) => {
                        return (
                            <LCAffectedFilesTooltip
                                licenseConclusionId={row.original.id}
                                mode="additional"
                                badgeStyle="bg-orange-400 text-sm"
                            />
                        );
                    },
                },
            ],
        },
        {
            accessorKey: "comment",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "comment") {
                                setSortBy("comment");
                                setSortOrder("asc");
                                setPageIndex(1);
                            } else {
                                if (!sortOrder) {
                                    setSortOrder("asc");
                                    setPageIndex(1);
                                } else {
                                    if (sortOrder === "asc") {
                                        setSortOrder("desc");
                                        setPageIndex(1);
                                    } else {
                                        setSortOrder(null);
                                        setSortBy(null);
                                        setPageIndex(1);
                                    }
                                }
                            }
                        }}
                    >
                        <Label className="cursor-pointer font-bold">
                            Comment
                        </Label>
                        {sortBy === "comment" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "comment" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: TableCell,
            meta: {
                type: "textarea",
            },
        },
        {
            accessorKey: "clearanceGroups",
            header: () => (
                <Label className="cursor-pointer font-bold">Groups</Label>
            ),
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.clearanceGroups.map((cg) => (
                        <ClearanceGroupTooltipIcon
                            key={cg.clearanceGroup.id}
                            clearanceGroup={cg.clearanceGroup}
                        />
                    ))}
                </div>
            ),
        },
        {
            id: "actions",
            cell: ActionCell,
        },
    ];
};
