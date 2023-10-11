// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Package = {
    purl: string;
    updatedAt: Date;
};

export const columns: ColumnDef<Package>[] = [
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
                    Package URL
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
                    Last Updated
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
];
