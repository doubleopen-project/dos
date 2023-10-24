// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { Label } from "../ui/label";
import {
    Tooltip,
    TooltipTrigger,
    TooltipProvider,
    TooltipContent,
} from "@/components/ui/tooltip";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Package = {
    name: string;
    version: string;
    purl: string;
    updatedAt: Date;
};

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
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="hover:text-blue-400">
                <Link
                    href={`/packages/${encodeURIComponent(
                        row.getValue("purl"),
                    )}`}
                >
                    {row.getValue("purl")}
                </Link>
            </div>
        ),
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
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
