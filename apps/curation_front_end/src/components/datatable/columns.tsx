// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronsUpDownIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipTrigger,
    TooltipProvider,
    TooltipContent,
} from "@/components/ui/tooltip";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type Package = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/packages"
>["packages"][0];

export const columns: ColumnDef<Package>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Label className="font-bold">Name</Label>
                    {column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                        <Link
                            className="hover:text-blue-400"
                            href={`/packages/${encodeURIComponent(
                                row.getValue("purl"),
                            )}`}
                        >
                            {row.getValue("name")}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm">{row.getValue("purl")}</div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    },
    {
        accessorKey: "version",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Label className="font-bold">Version</Label>
                    {column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Label className="font-bold">Type</Label>
                    {column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Label className="font-bold">Namespace</Label>
                    {column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
    },
    {
        accessorKey: "purl",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Label className="font-bold">Purl</Label>
                    {column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Label className="font-bold">Last updated</Label>
                    {column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "asc" ? (
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
];
