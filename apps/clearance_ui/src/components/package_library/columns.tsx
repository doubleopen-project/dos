// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ZodiosResponseByPath } from "@zodios/core";
import {
    ChevronDownIcon,
    ChevronsUpDownIcon,
    ChevronUpIcon,
} from "lucide-react";
import Link from "next/link";
import { Options } from "nuqs";
import { userAPI } from "validation-helpers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import DeletePackage from "@/components/common/delete_item/DeletePackage";
import PurlDetails from "@/components/common/PurlDetails";

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type Package = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/packages"
>["packages"][0];

export const columns = (
    userRole: string,
    sortBy: string | null,
    sortOrder: string | null,
    setSortBy: <Shallow>(
        value:
            | "purl"
            | "name"
            | "version"
            | "updatedAt"
            | "type"
            | "namespace"
            | ((
                  old:
                      | "purl"
                      | "name"
                      | "version"
                      | "updatedAt"
                      | "type"
                      | "namespace"
                      | null,
              ) =>
                  | "purl"
                  | "name"
                  | "version"
                  | "updatedAt"
                  | "type"
                  | "namespace"
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
): ColumnDef<Package>[] => {
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
            accessorKey: "name",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "name") {
                                setSortBy("name");
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
                        {sortBy === "name" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "name" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Link
                                className="font-semibold text-blue-400"
                                href={`/packages/${encodeURIComponent(
                                    row.original.purl,
                                )}`}
                            >
                                {row.getValue("name")}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <PurlDetails purl={row.original.purl} />
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: "version",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "version") {
                                setSortBy("version");
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
                            Version
                        </Label>
                        {sortBy === "version" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "version" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
        },
        {
            accessorKey: "type",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "type") {
                                setSortBy("type");
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
                        <Label className="cursor-pointer font-bold">Type</Label>
                        {sortBy === "type" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "type" && sortOrder === "asc" ? (
                            <ChevronUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
        },
        {
            accessorKey: "namespace",
            header: () => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => {
                            if (sortBy !== "namespace") {
                                setSortBy("namespace");
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
                            Namespace
                        </Label>
                        {sortBy === "namespace" && sortOrder === "desc" ? (
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        ) : sortBy === "namespace" && sortOrder === "asc" ? (
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
                        {userRole === "ADMIN" && (
                            <>
                                <DeletePackage data={row.original} />
                            </>
                        )}
                    </>
                );
            },
        },
    ];
};
