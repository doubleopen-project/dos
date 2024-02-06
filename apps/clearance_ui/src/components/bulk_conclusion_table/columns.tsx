// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ZodiosResponseByAlias, ZodiosResponseByPath } from "@zodios/core";
import {
    ChevronDownIcon,
    ChevronsUpDownIcon,
    ChevronUpIcon,
} from "lucide-react";
import { Options } from "next-usequerystate";
import Link from "next/link";
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
import PurlDetails from "@/components/PurlDetails";
import DeleteBulkConclusion from "../delete_item/DeleteBulkConclusion";

type User = ZodiosResponseByPath<typeof userAPI, "get", "/user">;

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusions"
>["bulkConclusions"][0];

export const columns = (
    user: User,
    sortBy: string | null,
    sortOrder: string | null,
    setSortBy: <Shallow>(
        value:
            | "pkg"
            | "username"
            | "pattern"
            | "detectedLicenseExpressionSPDX"
            | "concludedLicenseExpressionSPDX"
            | "comment"
            | "local"
            | "updatedAt"
            | ((
                  old:
                      | "pkg"
                      | "username"
                      | "pattern"
                      | "detectedLicenseExpressionSPDX"
                      | "concludedLicenseExpressionSPDX"
                      | "comment"
                      | "local"
                      | "updatedAt"
                      | null,
              ) =>
                  | "pkg"
                  | "username"
                  | "pattern"
                  | "detectedLicenseExpressionSPDX"
                  | "concludedLicenseExpressionSPDX"
                  | "comment"
                  | "local"
                  | "updatedAt"
                  | null)
            | null,
        options?: Options<Shallow> | undefined,
    ) => Promise<URLSearchParams>,
    setSortOrder: <Shallow>(
        value:
            | "asc"
            | "desc"
            | ((old: "asc" | "desc" | null) => "asc" | "desc" | null)
            | null,
        options?: Options<Shallow> | undefined,
    ) => Promise<URLSearchParams>,
    setPageIndex: <Shallow>(
        value: number | ((old: number) => number | null) | null,
        options?: Options<Shallow> | undefined,
    ) => Promise<URLSearchParams>,
): ColumnDef<BulkConclusion>[] => {
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
                            if (sortBy !== "pkg") {
                                setSortBy("pkg");
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
                        {sortBy === "pkg" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "pkg" && sortOrder === "asc" ? (
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
                    {row.original.user.username}
                </Badge>
            ),
        },
        {
            accessorKey: "pattern",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "pattern") {
                                setSortBy("pattern");
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
                            Pattern
                        </Label>
                        {sortBy === "pattern" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "pattern" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="break-all">{row.original.pattern}</div>
            ),
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
                        const affectedPathsThis =
                            row.original.licenseConclusions
                                .map(
                                    (lc) =>
                                        lc.affectedPaths.inContextPurl.length,
                                )
                                .reduce((a, b) => a + b, 0);
                        return affectedPathsThis > 0 ? (
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger>
                                        <Badge className="bg-blue-400 text-sm">
                                            {affectedPathsThis}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-sm">
                                            {row.original.licenseConclusions.map(
                                                (lc) => (
                                                    <div key={lc.id}>
                                                        {lc.affectedPaths.inContextPurl.map(
                                                            (aff, index) => (
                                                                <div
                                                                    key={index}
                                                                >
                                                                    {aff}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : null;
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
                        const affectedPathsOther =
                            row.original.licenseConclusions
                                .map(
                                    (lc) =>
                                        lc.affectedPaths.additionalMatches
                                            .length,
                                )
                                .reduce((a, b) => a + b, 0);
                        return affectedPathsOther > 0 ? (
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger>
                                        <Badge className="bg-orange-400 text-sm">
                                            {affectedPathsOther}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-sm">
                                            {row.original.licenseConclusions.map(
                                                (lc) => (
                                                    <div key={lc.id}>
                                                        {lc.affectedPaths.additionalMatches.map(
                                                            (aff, index) => (
                                                                <div
                                                                    key={index}
                                                                >
                                                                    {
                                                                        PackageURL.fromString(
                                                                            aff.purl,
                                                                        ).name
                                                                    }
                                                                    :
                                                                    {
                                                                        PackageURL.fromString(
                                                                            aff.purl,
                                                                        )
                                                                            .version
                                                                    }{" "}
                                                                    : {aff.path}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : null;
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
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <>
                        {(user.role === "ADMIN" ||
                            user.username === row.original.user.username) && (
                            <DeleteBulkConclusion id={row.original.id} />
                        )}
                    </>
                );
            },
        },
    ];
};
