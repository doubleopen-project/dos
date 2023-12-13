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
import DeleteBulkCuration from "../delete_item/DeleteBulkCuration";

type User = ZodiosResponseByPath<typeof userAPI, "get", "/user">;

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type BulkCuration = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/bulk-curation"
>["bulkCurations"][0];

export const columns = (user: User): ColumnDef<BulkCuration>[] => {
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
                <div className="text-sm">{row.original.package.purl}</div>
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
            accessorKey: "licenseExpressionSPDX",
            header: () => (
                <Label className="font-bold cursor-pointer">
                    SPDX License Expression
                </Label>
            ),
            columns: [
                {
                    accessorKey: "detectedLicenseExpressionSPDX",
                    header: ({ column }) => {
                        return (
                            <Button
                                variant="ghost"
                                className="px-0"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc",
                                    )
                                }
                            >
                                <Label className="font-bold cursor-pointer">
                                    Detected
                                </Label>
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
                    accessorKey: "concludedLicenseExpressionSPDX",
                    header: ({ column }) => {
                        return (
                            <Button
                                variant="ghost"
                                className="px-0"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc",
                                    )
                                }
                            >
                                <Label className="font-bold cursor-pointer">
                                    Concluded
                                </Label>
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
            ],
        },
        {
            accessorKey: "affectedPaths",
            header: () => (
                <Label className="font-bold cursor-pointer">
                    Affected Files
                </Label>
            ),
            columns: [
                {
                    accessorKey: "affectedPathsThisPurl",
                    header: () => {
                        return (
                            <Label className="font-bold cursor-pointer">
                                This
                            </Label>
                        );
                    },
                    cell: ({ row }) => (
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger>
                                    <Badge className="text-sm bg-blue-400">
                                        {row.original.licenseConclusions
                                            .map(
                                                (lc) =>
                                                    lc.affectedPaths
                                                        .inContextPurl.length,
                                            )
                                            .reduce((a, b) => a + b, 0)}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-sm">
                                        {row.original.licenseConclusions.map(
                                            (lc) => (
                                                <div key={lc.id}>
                                                    {lc.affectedPaths.inContextPurl.map(
                                                        (aff, index) => (
                                                            <div key={index}>
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
                    ),
                },
                {
                    accessorKey: "affectedPathsTotal",
                    header: () => {
                        return (
                            <Label className="font-bold cursor-pointer">
                                Other
                            </Label>
                        );
                    },
                    cell: ({ row }) => (
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger>
                                    <Badge className="text-sm bg-orange-400">
                                        {row.original.licenseConclusions
                                            .map(
                                                (lc) =>
                                                    lc.affectedPaths
                                                        .additionalMatches
                                                        .length,
                                            )
                                            .reduce((a, b) => a + b, 0)}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-sm">
                                        {row.original.licenseConclusions.map(
                                            (lc) => (
                                                <div key={lc.id}>
                                                    {lc.affectedPaths.additionalMatches.map(
                                                        (aff, index) => (
                                                            <div key={index}>
                                                                {aff.purl} :{" "}
                                                                {aff.path}
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
                    ),
                },
            ],
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
            id: "actions",
            cell: ({ row }) => {
                return (
                    <>
                        {(user.role === "ADMIN" ||
                            user.username === row.original.user.username) && (
                            <DeleteBulkCuration id={row.original.id} />
                        )}
                    </>
                );
            },
        },
    ];
};
