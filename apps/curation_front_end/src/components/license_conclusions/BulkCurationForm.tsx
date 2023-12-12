// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import isGlob from "is-glob";
import { useForm } from "react-hook-form";
import { AiOutlineEye } from "react-icons/ai";
import parse from "spdx-expression-parse";
import { z } from "zod";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import CurationLicense from "@/components/license_conclusions/CurationLicense";
import CurationSPDX from "@/components/license_conclusions/CurationSPDX";
import { findMatchingPaths } from "@/helpers/findMatchingPaths";
import { cn } from "@/lib/utils";

const bulkCurationFormSchema = z.object({
    pattern: z
        .string()
        .min(1, "Pattern cannot be empty")
        .refine((pattern) => isGlob(pattern), {
            message: "Pattern is not a valid glob pattern",
        })
        .refine((pattern) => pattern !== "**", {
            message: "You cannot bulk curate all files in a package",
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
});

type BulkCurationFormType = z.infer<typeof bulkCurationFormSchema>;

type Props = {
    purl: string | undefined;
    className?: string;
    setOpen: (open: boolean) => void;
};

const BulkCurationForm = ({ purl, className, setOpen }: Props) => {
    const [matchingPaths, setMatchingPaths] = useState<string[]>([]);
    // Fetch the package file tree data
    const { data: fileTreeData } = userHooks.useImmutableQuery(
        "/filetree",
        { purl: purl as string },
        { withCredentials: true },
        { enabled: !!purl },
    );
    const paths =
        fileTreeData?.filetrees.map((filetree) => filetree.path) || [];
    const defaultValues: BulkCurationFormType = {
        pattern: "",
        concludedLicenseSPDX: "",
        concludedLicenseList: "",
        comment: "",
    };
    const form = useForm<BulkCurationFormType>({
        resolver: zodResolver(bulkCurationFormSchema),
        defaultValues,
    });

    const keyFile = userHooks.getKeyByPath("post", "/file");
    const keyFiletree = userHooks.getKeyByPath("post", "/filetree");
    const queryClient = useQueryClient();
    const { mutate: addBulkCuration } = userHooks.usePostBulkCuration(
        {
            withCredentials: true,
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
                    title: "Bulk curation",
                    description: `Bulk curation added successfully.
                        ${res.filesGlob} files matched the pattern, 
                        ${res.filesPackage} identical (SHA256) files affected in this package, 
                        ${res.filesAll} identical (SHA256) files affected in the database.`,
                });
                // When a bulk curation is added, invalidate the file and filetree queries to refetch the data
                queryClient.invalidateQueries(keyFile);
                queryClient.invalidateQueries(keyFiletree);
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

    function onSubmit(data: BulkCurationFormType) {
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
                addBulkCuration({
                    pattern: data.pattern,
                    concludedLicenseExpressionSPDX:
                        concludedLicenseExpressionSPDX,
                    comment: data.comment ?? "",
                    purl: purl as string,
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
        <div className={cn("flex flex-col w-full", className)}>
            <Label className="mb-3 font-bold">Add bulk curation</Label>
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
                                            className="text-xs !min-h-[40px]"
                                            placeholder="Glob pattern matching to the files to be curated..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DropdownMenu onOpenChange={handleOpen}>
                            <DropdownMenuTrigger
                                className="p-2 ml-1 rounded-md"
                                type="button"
                                disabled={form.getValues("pattern") === ""}
                            >
                                <AiOutlineEye
                                    className={cn(
                                        "text-gray-400 h-fit w-6",
                                        form.getValues("pattern") === ""
                                            ? "opacity-40"
                                            : "opacity-100",
                                    )}
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80 max-h-[40vh] overflow-y-auto">
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
                                    <CurationLicense
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
                                    <CurationSPDX
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
                            <FormItem className="flex-1 mr-1">
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="text-xs !min-h-[40px]"
                                        placeholder="Comment on your curation..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.formState.errors.root && (
                        <div
                            className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
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
                            className="p-1 mt-2 text-xs rounded-md"
                            variant={"outline"}
                        >
                            Add bulk curation
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default BulkCurationForm;
