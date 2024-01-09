// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ColumnDef } from "@tanstack/react-table";
import { ZodiosResponseByPath } from "@zodios/core";
import {
    Check,
    ChevronDownIcon,
    ChevronsUpDownIcon,
    ChevronUpIcon,
    X,
} from "lucide-react";
import Link from "next/link";
import { PackageURL } from "packageurl-js";
import { userAPI } from "validation-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
type LicenseConclusion = ZodiosResponseByPath<
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
                    cell: ({ row, getValue, table }) => {
                        const tableMeta = table.options.meta;
                        const initialValue = getValue();

                        if (tableMeta?.editedRows[parseInt(row.id)]) {
                            return (
                                <Input
                                    defaultValue={
                                        typeof initialValue === "string"
                                            ? initialValue
                                            : ""
                                    }
                                    type="text"
                                />
                            );
                        }
                        return (
                            <span>
                                {typeof initialValue === "string"
                                    ? initialValue
                                    : ""}
                            </span>
                        );
                    },
                    meta: {
                        type: "text",
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
            cell: ({ row, getValue, table }) => {
                const tableMeta = table.options.meta;
                const initialValue = getValue();

                if (tableMeta?.editedRows[parseInt(row.id)]) {
                    return (
                        <Textarea
                            defaultValue={
                                typeof initialValue === "string"
                                    ? initialValue
                                    : ""
                            }
                        />
                    );
                }
                return (
                    <span>
                        {typeof initialValue === "string" ? initialValue : ""}
                    </span>
                );
            },
            meta: {
                type: "text-area",
            },
        },
        {
            id: "actions",
            cell: ({ row, table }) => {
                const meta = table.options.meta;

                const setEditedRows = (
                    e: React.MouseEvent<HTMLButtonElement>,
                ) => {
                    const elName = e.currentTarget.name;

                    meta?.setEditedRows(() => {
                        const old = meta.editedRows;
                        return {
                            ...old,
                            [parseInt(row.id)]: !old[parseInt(row.id)],
                        };
                    });
                    if (elName !== "edit") {
                        //meta?.revertData(row.index, e.currentTarget.name === "cancel");
                        if (e.currentTarget.name === "cancel") {
                            console.log("cancel");
                        }
                        if (e.currentTarget.name === "save") {
                            console.log("save");
                        }
                    }
                };

                return meta?.editedRows[parseInt(row.id)] ? (
                    <div className="flex">
                        <Button
                            onClick={setEditedRows}
                            name="save"
                            variant="outline"
                            className="mr-1 px-2"
                        >
                            <Check size={16} className="text-green-400" />
                        </Button>
                        <Button
                            onClick={setEditedRows}
                            name="cancel"
                            variant="outline"
                            className="mr-1 px-2"
                        >
                            <X size={16} className="text-[#ff3366]" />
                        </Button>
                    </div>
                ) : (
                    <>
                        {(user.username === row.original.user.username ||
                            user.role === "ADMIN") && (
                            <div className="flex">
                                <EditLCButton
                                    onClick={setEditedRows}
                                    name="edit"
                                />
                                <DeleteLicenseConclusion data={row.original} />
                            </div>
                        )}
                    </>
                );
            },
        },
    ];
};
