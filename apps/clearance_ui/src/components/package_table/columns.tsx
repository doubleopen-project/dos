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
import { userAPI } from "validation-helpers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import DeletePackage from "../delete_item/DeletePackage";
import PurlDetails from "../PurlDetails";

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type Package = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/packages"
>["packages"][0];

export const columns = (userRole: string): ColumnDef<Package>[] => {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="font-bold cursor-pointer">Name</Label>
                        {column.getIsSorted() === "desc" ? (
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronsUpDownIcon className="w-4 h-4 ml-2" />
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
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="font-bold cursor-pointer">
                            Version
                        </Label>
                        {column.getIsSorted() === "desc" ? (
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronsUpDownIcon className="w-4 h-4 ml-2" />
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
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="font-bold cursor-pointer">Type</Label>
                        {column.getIsSorted() === "desc" ? (
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronsUpDownIcon className="w-4 h-4 ml-2" />
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
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="font-bold cursor-pointer">
                            Namespace
                        </Label>
                        {column.getIsSorted() === "desc" ? (
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronsUpDownIcon className="w-4 h-4 ml-2" />
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
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="font-bold cursor-pointer">
                            Updated
                        </Label>
                        {column.getIsSorted() === "desc" ? (
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ChevronUpIcon className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronsUpDownIcon className="w-4 h-4 ml-2" />
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
