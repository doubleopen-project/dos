// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByPath } from "@zodios/core";
import axios from "axios";
import isGlob from "is-glob";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { AiOutlineEye } from "react-icons/ai";
import parse from "spdx-expression-parse";
import { userAPI } from "validation-helpers";
import { z } from "zod";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import ConclusionLicense from "@/components/license_conclusions/ConclusionLicense";
import ConclusionSPDX from "@/components/license_conclusions/ConclusionSPDX";
import { findMatchingPaths } from "@/helpers/findMatchingPaths";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { cn } from "@/lib/utils";

const bulkConclusionFormSchema = z.object({
    pattern: z
        .string()
        .min(1, "Pattern cannot be empty")
        .refine((pattern) => isGlob(pattern), {
            message: "Pattern is not a valid glob pattern",
        })
        .refine((pattern) => pattern !== "**", {
            message:
                "You cannot do a bulk conclusion for all files in a package",
        }),
    concludedLicenseSPDX: z
        .string()
        .refine(
            (value) => {
                try {
                    parse(value);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            { message: "Invalid SPDX expression" },
        )
        .or(z.enum(["", "NONE", "NOASSERTION"])),
    concludedLicenseList: z.string(),
    comment: z.string(),
    local: z.boolean(),
});

type BulkConclusionFormType = z.infer<typeof bulkConclusionFormSchema>;

type BCDataType = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/bulk-conclusions/:id"
>;

type Props = {
    purl: string;
    id: number;
    className?: string;
    setOpen: (open: boolean) => void;
};

const BulkConclusionEditForm = ({ purl, id, className, setOpen }: Props) => {
    const [matchingPaths, setMatchingPaths] = useState<string[]>([]);
    const pathPurl = toPathPurl(purl);
    // Fetch the package file tree data
    const { data: fileTreeData } = userHooks.useGetFileTree({
        withCredentials: true,
        params: {
            purl: pathPurl,
        },
    });
    const { data: bulkConclusion } = userHooks.useGetBulkConclusionById({
        withCredentials: true,
        params: {
            id: id,
        },
    });
    const paths =
        fileTreeData?.filetrees.map((filetree) => filetree.path) || [];
    const defaultValues: BulkConclusionFormType = {
        pattern: bulkConclusion?.pattern || "",
        concludedLicenseSPDX:
            bulkConclusion?.concludedLicenseExpressionSPDX || "",
        concludedLicenseList: "",
        comment: bulkConclusion?.comment || "",
        local: bulkConclusion?.local || false,
    };
    const form = useForm<BulkConclusionFormType>({
        resolver: zodResolver(bulkConclusionFormSchema),
        defaultValues,
    });

    const keyLCs = userHooks.getKeyByAlias(
        "GetLicenseConclusionsForFileInPackage",
    );
    const keyFiletree = userHooks.getKeyByAlias("GetFileTree");
    const keyLicenseConclusions = userHooks.getKeyByAlias(
        "GetLicenseConclusions",
    );

    const queryClient = useQueryClient();
    const { mutate: addBulkConclusion } = userHooks.usePostBulkConclusion(
        {
            withCredentials: true,
            params: {
                purl: pathPurl,
            },
        },
        {
            onSuccess: (data) => {
                const res = {
                    filesGlob: data.matchedPathsCount,
                    filesPackage: data.affectedFilesInPackageCount,
                    filesAll: data.affectedFilesAcrossAllPackagesCount,
                };
                setOpen(false);
                toast({
                    title: "Bulk conclusion",
                    description: `Bulk license conclusion added successfully.
                        ${res.filesGlob} files matched the pattern, 
                        ${res.filesPackage} identical (SHA256) files affected in this package, 
                        ${res.filesAll} identical (SHA256) files affected in the database.`,
                });
                // When a bulk curation is added, invalidate the queries to refetch the data
                queryClient.invalidateQueries(keyLCs);
                queryClient.invalidateQueries(keyFiletree);
                queryClient.invalidateQueries(keyLicenseConclusions);
            },
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.data?.path === "pattern") {
                        form.setError("pattern", {
                            type: "manual",
                            message: error.response?.data?.message,
                        });
                    } else if (error.response?.data?.message) {
                        form.setError("root", {
                            type: "manual",
                            message: error.response?.data?.message,
                        });
                    }
                } else {
                    form.setError("root", {
                        type: "manual",
                        message: error.message,
                    });
                }
            },
        },
    );

    const { toast } = useToast();

    // When the dropdown menu is opened, find the matching paths
    const handleOpen = (open: boolean) => {
        if (open) {
            setMatchingPaths(
                findMatchingPaths(paths, form.getValues("pattern")),
            );
        }
    };

    function onSubmit(data: BulkConclusionFormType) {
        // Create an array of fields with values
        const fieldsWithValue = [
            data.concludedLicenseSPDX,
            data.concludedLicenseList,
        ].filter((field) => field !== undefined && field !== "");

        // If exactly one field has a value, store that into concludedLicenseExpressionSPDX
        if (fieldsWithValue.length === 1) {
            const concludedLicenseExpressionSPDX = fieldsWithValue[0] || "";
            if (
                window.confirm(
                    `Do you want to add a bulk license conclusion\n${JSON.stringify(
                        concludedLicenseExpressionSPDX,
                        null,
                        2,
                    )} to these files?`,
                )
            ) {
                addBulkConclusion({
                    pattern: data.pattern,
                    concludedLicenseExpressionSPDX:
                        concludedLicenseExpressionSPDX,
                    comment: data.comment ?? "",
                    local: data.local,
                });
            } else {
                return;
            }
        } else if (fieldsWithValue.length === 0) {
            toast({
                variant: "destructive",
                title: "ERROR",
                description:
                    "No license conclusion (SPDX expression, or from a license list) are specified. Please specify exactly one.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "ERROR",
                description:
                    "More than one license conclusion specified. Please specify exactly one.",
            });
        }
    }

    return (
        <div className={cn("flex w-full flex-col", className)}>
            <Label className="mb-3 font-bold">
                Edit bulk license conclusion
            </Label>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1"
                >
                    <div className="flex flex-row items-end justify-between">
                        <FormField
                            control={form.control}
                            name="pattern"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Pattern</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="!min-h-[40px] text-xs"
                                            placeholder="Glob pattern matching to the files to be concluded..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DropdownMenu onOpenChange={handleOpen}>
                            <DropdownMenuTrigger
                                className="ml-1 rounded-md p-2"
                                type="button"
                                disabled={form.getValues("pattern") === ""}
                            >
                                <AiOutlineEye
                                    className={cn(
                                        "h-fit w-6 text-gray-400",
                                        form.getValues("pattern") === ""
                                            ? "opacity-40"
                                            : "opacity-100",
                                    )}
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[40vh] w-80 overflow-y-auto">
                                {matchingPaths.map((path) => (
                                    <DropdownMenuItem key={path}>
                                        {path}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <FormField
                        control={form.control}
                        name="concludedLicenseList"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Select exactly one of the two below
                                </FormLabel>
                                <FormControl>
                                    <ConclusionLicense
                                        concludedLicenseExpressionSPDX={
                                            field.value
                                        }
                                        setConcludedLicenseExpressionSPDX={
                                            field.onChange
                                        }
                                        fractionalWidth={0.75}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="concludedLicenseSPDX"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ConclusionSPDX
                                        value={field.value}
                                        setValue={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem className="mr-1 flex-1">
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="!min-h-[40px] text-xs"
                                        placeholder="Comment on your bulk conclusion..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="local"
                        render={({ field }) => (
                            <FormItem className="ml-1 flex flex-row items-end space-x-3 space-y-2 rounded-md">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <Label>Mark as local</Label>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger
                                            className="ml-1"
                                            type="button"
                                        >
                                            <Info size={"15px"} />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>
                                                By checking this box, this bulk
                                                license conclusion will only
                                                apply <br /> to the files in
                                                this version of this package.
                                            </p>
                                            <br />
                                            <p>
                                                If you want to apply this bulk
                                                license conclusion across all
                                                packages
                                                <br />
                                                that have the one or more of the
                                                affected files (identified{" "}
                                                <br />
                                                by the file's sha256's), leave
                                                this box unchecked.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.formState.errors.root && (
                        <div
                            className="relative rounded-md border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {form.formState.errors.root?.message}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="mt-2 rounded-md p-1 text-xs"
                        >
                            Add bulk conclusion
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default BulkConclusionEditForm;
