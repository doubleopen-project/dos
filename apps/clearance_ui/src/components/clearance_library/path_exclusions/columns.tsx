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
import PurlDetails from "@/components/common/PurlDetails";
import DeletePathExclusion from "@/components/delete_item/DeletePathExclusion";

type User = ZodiosResponseByPath<typeof userAPI, "get", "/user">;

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusions"
>["pathExclusions"][0];

export const columns = (
    user: User,
    sortBy: string | null,
    sortOrder: string | null,
    setSortBy: <Shallow>(
        value:
            | "updatedAt"
            | "comment"
            | "pattern"
            | "reason"
            | "pkg"
            | "username"
            | ((
                  old:
                      | "updatedAt"
                      | "comment"
                      | "pattern"
                      | "reason"
                      | "pkg"
                      | "username"
                      | null,
              ) =>
                  | "updatedAt"
                  | "comment"
                  | "pattern"
                  | "reason"
                  | "pkg"
                  | "username"
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
            accessorKey: "pkg",
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
                const pkg = PackageURL.fromString(row.original.purl);
                const pkgName = pkg.name + ":" + pkg.version;
                return (
                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Link
                                    className="font-semibold text-blue-400"
                                    href={`/packages/${encodeURIComponent(
                                        row.original.purl,
                                    )}`}
                                >
                                    {pkgName}
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <PurlDetails purl={row.original.purl} />
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
        },
        {
            accessorKey: "reason",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "reason") {
                                setSortBy("reason");
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
                            Reason
                        </Label>
                        {sortBy === "reason" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "reason" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
        },
        {
            accessorKey: "affectedPaths",
            header: () => (
                <Label className="cursor-pointer font-bold">
                    Affected Files
                </Label>
            ),
            cell: ({ row }) => {
                const affectedPaths = row.original.affectedPaths.length;
                return affectedPaths > 0 ? (
                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger>
                                <Badge className="bg-blue-400 text-sm">
                                    {affectedPaths}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-sm">
                                    {row.original.affectedPaths.map(
                                        (aff, index) => (
                                            <div key={index}>{aff}</div>
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
                            <DeletePathExclusion data={row.original} />
                        )}
                    </>
                );
            },
        },
    ];
};
