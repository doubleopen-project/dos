// SPDX-FileCopyrightText: 2023 Double Open Oy
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
import DeletePathExclusion from "@/components/delete_item/DeletePathExclusion";

type User = ZodiosResponseByPath<typeof userAPI, "get", "/user">;

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type LicenseConclusion = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/path-exclusion"
>["pathExclusions"][0];

export const columns = (user: User): ColumnDef<LicenseConclusion>[] => {
    return [
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
            accessorKey: "purl",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="font-bold cursor-pointer">PURL</Label>
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
                <div className="text-sm">{row.getValue("purl")}</div>
            ),
        },
        {
            accessorKey: "username",
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
                            Creator
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
                <Badge className="text-sm bg-green-400">
                    {row.original.user.username}
                </Badge>
            ),
        },
        {
            accessorKey: "pattern",
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
                            Pattern
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
            accessorKey: "reason",
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
                            Reason
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
            accessorKey: "affectedPaths",
            header: () => (
                <Label className="font-bold cursor-pointer">
                    Affected Files
                </Label>
            ),
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                            <Badge className="text-sm bg-blue-400">
                                {row.original.affectedPaths.length}
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
            ),
        },
        {
            accessorKey: "comment",
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
                            Comment
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
