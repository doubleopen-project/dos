// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
//import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import parse from "spdx-expression-parse";
import { z } from "zod";
//import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import CurationLicense from "@/components/license_conclusions/CurationLicense";
import CurationSPDX from "@/components/license_conclusions/CurationSPDX";
import { cn } from "@/lib/utils";

const bulkCurationFormSchema = z.object({
    pattern: z.string().min(1, "Pattern cannot be empty"),
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
    // This is just to make lint happy
    console.log(purl);
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
    /*
    const keyFile = userHooks.getKeyByPath("post", "/file");
    const keyFiletree = userHooks.getKeyByPath("post", "/filetree");
    const queryClient = useQueryClient();

    const { mutate: addLicenseConclusion } = userHooks.useMutation(
        "post",
        "/license-conclusion",
        {
            withCredentials: true,
        },
        {
            onSuccess: () => {
                setOpen(false);
                // When a license conclusion is added, invalidate the file and filetree queries to refetch the data
                queryClient.invalidateQueries(keyFile);
                queryClient.invalidateQueries(keyFiletree);
            },
        },
    );
    */
    const { toast } = useToast();

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
                // Temporary
                setOpen(false);
                /*
                addLicenseConclusion({
                    fileSha256: fileData.sha256,
                    concludedLicenseExpressionSPDX:
                        concludedLicenseExpressionSPDX,
                    detectedLicenseExpressionSPDX:
                        fileData.licenseFindings[0]?.licenseExpressionSPDX ??
                        "",
                    comment: data.comment ?? "",
                    contextPurl: purl,
                });
                */
                toast({
                    title: "License conclusion",
                    description: "License conclusion added successfully.",
                });
            } else {
                return;
            }
        } else if (fieldsWithValue.length === 0) {
            toast({
                variant: "destructive",
                title: "ERROR",
                description:
                    "No license conclusion (SPDX expression, from DB, from a license list) are specified. Please specify exactly one.",
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
                    <FormField
                        control={form.control}
                        name="pattern"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pattern</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="text-xs !min-h-[40px]"
                                        placeholder="Glob pattern matching to the files to be curated..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="text-xs rounded-md p-1 mt-2"
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
