// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Info } from "lucide-react";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { useClearanceActionState } from "@/hooks/useClearanceActionState";
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
import ClearanceActionNotice from "@/components/common/ClearanceActionNotice";
import ConclusionLicense from "@/components/common/ConclusionLicense";
import ConclusionSPDX from "@/components/common/ConclusionSPDX";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { cn } from "@/lib/utils";
import { concludedLicenseExpressionSPDXSchema } from "@/schemes/spdx_schema";

const conclusionFormSchema = z.object({
    concludedLicenseSPDX: concludedLicenseExpressionSPDXSchema,
    concludedLicenseList: concludedLicenseExpressionSPDXSchema,
    comment: z.string(),
    local: z.boolean(),
});

type ConclusionFormType = z.infer<typeof conclusionFormSchema>;

type Props = {
    purl: string;
    fileSha256: string;
    detectedExpression: string | undefined;
    className?: string;
};

const ConclusionForm = ({
    purl,
    fileSha256,
    detectedExpression,
    className,
}: Props) => {
    const { canSubmit } = useClearanceActionState();
    const defaultValues: ConclusionFormType = {
        concludedLicenseSPDX: "",
        concludedLicenseList: "",
        comment: "",
        local: false,
    };
    const form = useForm<ConclusionFormType>({
        resolver: zodResolver(conclusionFormSchema),
        defaultValues,
    });
    const { errors } = useFormState({ control: form.control });
    const keyLCsForFile = userHooks.getKeyByAlias(
        "GetLicenseConclusionsForFileInPackage",
    );
    const keyLicenseConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetLicenseConclusionsCount",
    );
    const keyLCs = userHooks.getKeyByAlias("GetLicenseConclusions");
    const queryClient = useQueryClient();

    const pathPurl = toPathPurl(purl);

    const { mutate: addLicenseConclusion } = userHooks.usePostLicenseConclusion(
        {
            params: {
                purl: pathPurl,
                sha256: fileSha256,
            },
        },
        {
            onSuccess: () => {
                // When a license conclusion is added, invalidate the corresponding queries to refetch the data
                queryClient.invalidateQueries(keyLCsForFile);
                queryClient.invalidateQueries(keyLCs);
                queryClient.invalidateQueries(keyLicenseConclusionCountByPurl);
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

    function onSubmit(data: ConclusionFormType) {
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
                    detectedLicenseExpressionSPDX: detectedExpression,
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
        <div className={cn("flex w-full flex-col", className)}>
            <ClearanceActionNotice />
            <Form {...form}>
                <form
                    id="conclusionForm"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1"
                >
                    <FormField
                        control={form.control}
                        name="concludedLicenseList"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ConclusionLicense
                                        concludedLicenseExpressionSPDX={
                                            field.value
                                        }
                                        setConcludedLicenseExpressionSPDX={
                                            field.onChange
                                        }
                                        fractionalWidth={1}
                                        className={
                                            errors.concludedLicenseList
                                                ? "border-destructive border"
                                                : undefined
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="ml-1 text-xs" />
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
                                        className={
                                            errors.concludedLicenseSPDX
                                                ? "border-destructive border"
                                                : undefined
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="ml-1 text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem className="mr-1 flex-1">
                                <FormControl>
                                    <Textarea
                                        className="min-h-[40px]! text-xs"
                                        placeholder="Comment on your license conclusion..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="ml-1 text-xs" />
                            </FormItem>
                        )}
                    />
                    <div className="flex">
                        <FormField
                            control={form.control}
                            name="local"
                            render={({ field }) => (
                                <FormItem className="ml-1 flex flex-row items-start space-y-0 space-x-3 rounded-md p-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <Label className="text-xs">Local</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger type="button">
                                                <Info size={"15px"} />
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="mr-3"
                                            >
                                                <p>
                                                    By checking this box, this
                                                    license conclusion will only
                                                    apply to the files in this
                                                    version of this package.
                                                </p>
                                                <p>
                                                    If you want to apply this
                                                    license conclusion across
                                                    all packages that have the
                                                    same file (identified by the
                                                    file's sha256), leave this
                                                    box unchecked.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <FormMessage className="ml-1 text-xs" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            form="conclusionForm"
                            className="ml-4 text-left text-xs"
                            disabled={!canSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ConclusionForm;
