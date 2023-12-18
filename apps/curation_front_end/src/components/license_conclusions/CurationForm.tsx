// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByPath } from "@zodios/core";
import axios from "axios";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import parse from "spdx-expression-parse";
import { userAPI } from "validation-helpers";
import { z } from "zod";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import CurationDB from "@/components/license_conclusions/CurationDB";
import CurationLicense from "@/components/license_conclusions/CurationLicense";
import CurationSPDX from "@/components/license_conclusions/CurationSPDX";
import { toPathPurl } from "@/helpers/pathParamHelpers";
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

type FileDataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type LCDataType = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/packages/:purl/files/:sha256/license-conclusions/"
>;

type Props = {
    purl: string;
    lcData: LCDataType;
    fileData: FileDataType;
    className?: string;
};

const CurationForm = ({ purl, lcData, fileData, className }: Props) => {
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
    const keyLCs = userHooks.getKeyByPath(
        "get",
        "/packages/:purl/files/:sha256/license-conclusions/",
    );
    const keyFiletree = userHooks.getKeyByPath(
        "get",
        "/packages/:purl/filetrees",
    );
    const queryClient = useQueryClient();

    const pathPurl = toPathPurl(purl);

    const { mutate: addLicenseConclusion } = userHooks.usePostLicenseConclusion(
        {
            params: {
                purl: pathPurl,
                sha256: fileData.sha256,
            },
            withCredentials: true,
        },
        {
            onSuccess: () => {
                // When a license conclusion is added, invalidate the file and filetree queries to refetch the data
                queryClient.invalidateQueries(keyLCs);
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
                                        data={lcData}
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
                    <div className="flex items-stretch justify-between">
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

                        <div className="flex flex-col items-stretch">
                            <FormField
                                control={form.control}
                                name="local"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start p-2 ml-1 space-x-3 space-y-0 rounded-md">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <Label className="text-xs">
                                                Local
                                            </Label>
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
                                                        By checking this box,
                                                        this curation will only
                                                        apply to the files in
                                                        this version of this
                                                        package.
                                                    </p>
                                                    <p>
                                                        If you want to apply
                                                        this curation across all
                                                        packages that have the
                                                        same file (identified by
                                                        the file's sha256),
                                                        leave this box
                                                        unchecked.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
