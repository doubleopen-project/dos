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
import DeleteLicenseConclusion from "@/components/delete_item/DeleteLicenseConclusion";
import EditLCButton from "@/components/edit_item/EditLCButton";

type User = ZodiosResponseByPath<typeof userAPI, "get", "/user">;

// Get the table column datatype from the query response
// Note: for reusing the component, this needs to be changed
export type LicenseConclusion = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/license-conclusions"
>["licenseConclusions"][0];

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
                        <Label className="cursor-pointer font-bold">
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
            accessorKey: "contextPurl",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="cursor-pointer font-bold">
                            Package
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
                                <div className="text-sm">
                                    {row.original.contextPurl}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
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
                        <Label className="cursor-pointer font-bold">
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
                <Badge className="bg-green-400 text-sm">
                    {row.original.user.username}
                </Badge>
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
                                <Label className="cursor-pointer font-bold">
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
                                <Label className="cursor-pointer font-bold">
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
                            row.original.affectedPaths.inContextPurl.length;
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
                                            {row.original.affectedPaths.inContextPurl.map(
                                                (aff, index) => (
                                                    <div key={index}>
                                                        {aff.path}
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
                            row.original.affectedPaths.additionalMatches.length;

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
                                            {row.original.affectedPaths.additionalMatches.map(
                                                (aff, index) => (
                                                    <div key={index}>
                                                        {
                                                            PackageURL.fromString(
                                                                aff.purl,
                                                            ).name
                                                        }
                                                        :
                                                        {
                                                            PackageURL.fromString(
                                                                aff.purl,
                                                            ).version
                                                        }{" "}
                                                        : {aff.path}
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
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <Label className="cursor-pointer font-bold">
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
                    <div>
                        {(user.role === "ADMIN" ||
                            user.username === row.original.user.username) && (
                            <div className="flex">
                                <EditLCButton />
                                <DeleteLicenseConclusion data={row.original} />
                            </div>
                        )}
                    </div>
                );
            },
        },
    ];
};
