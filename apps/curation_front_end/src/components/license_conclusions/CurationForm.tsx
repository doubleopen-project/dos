// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByPath } from "@zodios/core";
import axios from "axios";
import { useForm } from "react-hook-form";
import parse from "spdx-expression-parse";
import { userAPI } from "validation-helpers";
import { z } from "zod";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import CurationDB from "@/components/license_conclusions/CurationDB";
import CurationLicense from "@/components/license_conclusions/CurationLicense";
import CurationSPDX from "@/components/license_conclusions/CurationSPDX";
import { cn } from "@/lib/utils";

const curationFormSchema = z.object({
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
    concludedLicenseDB: z.string(),
    concludedLicenseList: z.string(),
    comment: z.string(),
    local: z.boolean(),
});

type CurationFormType = z.infer<typeof curationFormSchema>;

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type Props = {
    purl: string;
    fileData: DataType;
    className?: string;
};

const CurationForm = ({ purl, fileData, className }: Props) => {
    const defaultValues: CurationFormType = {
        concludedLicenseSPDX: "",
        concludedLicenseDB: "",
        concludedLicenseList: "",
        comment: "",
        local: false,
    };
    const form = useForm<CurationFormType>({
        resolver: zodResolver(curationFormSchema),
        defaultValues,
    });
    const keyFile = userHooks.getKeyByPath("post", "/file");
    const keyFiletree = userHooks.getKeyByPath("post", "/filetree");
    const queryClient = useQueryClient();

    const pathPurl = purl.replace(/\//g, "%2F");
    const sha256 = fileData.sha256;

    const { mutate: addLicenseConclusion } = userHooks.usePostLicenseConclusion(
        {
            params: {
                purl: pathPurl,
                sha256: sha256,
            },
            withCredentials: true,
        },
        {
            onSuccess: () => {
                // When a license conclusion is added, invalidate the file and filetree queries to refetch the data
                queryClient.invalidateQueries(keyFile);
                queryClient.invalidateQueries(keyFiletree);
                toast({
                    title: "License conclusion",
                    description: "License conclusion added successfully.",
                });
            },
            onError: (error) => {
                const msg = axios.isAxiosError(error)
                    ? error.response?.data?.message
                    : error.message;

                toast({
                    variant: "destructive",
                    title: "ERROR",
                    description: msg,
                });
            },
        },
    );
    const { toast } = useToast();

    function onSubmit(data: CurationFormType) {
        // Create an array of fields with values
        const fieldsWithValue = [
            data.concludedLicenseSPDX,
            data.concludedLicenseDB,
            data.concludedLicenseList,
        ].filter((field) => field !== undefined && field !== "");

        // If exactly one field has a value, store that into concludedLicenseExpressionSPDX
        if (fieldsWithValue.length === 1) {
            const concludedLicenseExpressionSPDX = fieldsWithValue[0] || "";
            if (
                window.confirm(
                    `Do you want to add a license conclusion\n${JSON.stringify(
                        concludedLicenseExpressionSPDX,
                        null,
                        2,
                    )} to this file?`,
                )
            ) {
                addLicenseConclusion({
                    concludedLicenseExpressionSPDX:
                        concludedLicenseExpressionSPDX,
                    detectedLicenseExpressionSPDX:
                        fileData.licenseFindings[0]?.licenseExpressionSPDX ??
                        "",
                    comment: data.comment ?? "",
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
            <Label className="mb-1 font-bold">Curation:</Label>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1"
                >
                    <FormField
                        control={form.control}
                        name="concludedLicenseDB"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <CurationDB
                                        data={fileData}
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
                        name="concludedLicenseList"
                        render={({ field }) => (
                            <FormItem>
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
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem className="flex-1 mr-1">
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
                        <div className="flex items-center">
                            <Button
                                type="submit"
                                className="text-xs text-left"
                                variant={"outline"}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CurationForm;
