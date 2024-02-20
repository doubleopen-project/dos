// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByAlias } from "@zodios/core";
import axios from "axios";
import { Check, Info, Loader2, X } from "lucide-react";
import { useForm, useFormState } from "react-hook-form";
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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import ConclusionLicense from "@/components/common/ConclusionLicense";
import ConclusionSPDX from "@/components/common/ConclusionSPDX";
import { concludedLicenseExpressionSPDXSchema } from "@/schemes/spdx_schema";

const licenseConclusionFormSchema = z.object({
    concludedLicenseSPDX: concludedLicenseExpressionSPDXSchema,
    concludedLicenseList: concludedLicenseExpressionSPDXSchema,
    comment: z.string(),
    local: z.boolean(),
});

type LicenseConclusionFormType = z.infer<typeof licenseConclusionFormSchema>;

type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

type Props = {
    licenseConclusion: LicenseConclusion;
    editHandler: (id: number) => void;
};

const LicenseConclusionEditForm = ({
    licenseConclusion,
    editHandler,
}: Props) => {
    const defaultValues: LicenseConclusionFormType = {
        concludedLicenseSPDX:
            licenseConclusion?.concludedLicenseExpressionSPDX || "",
        concludedLicenseList: "",
        comment: licenseConclusion?.comment || "",
        local: licenseConclusion?.local || false,
    };
    const form = useForm<LicenseConclusionFormType>({
        resolver: zodResolver(licenseConclusionFormSchema),
        defaultValues,
    });
    const { errors } = useFormState({ control: form.control });

    const keyLCs = userHooks.getKeyByAlias(
        "GetLicenseConclusionsForFileInPackage",
    );
    const keyFiletree = userHooks.getKeyByAlias("GetFileTree");
    const keyLicenseConclusions = userHooks.getKeyByAlias(
        "GetLicenseConclusions",
    );
    const keyLicenseConclusionsCountByPurl = userHooks.getKeyByAlias(
        "GetLicenseConclusionsCount",
    );

    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { mutate: editLicenseConclusion, isLoading } =
        userHooks.usePutLicenseConclusion(
            {
                withCredentials: true,
                params: {
                    id: licenseConclusion.id || -1,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "License conclusion",
                        description:
                            "License conclusion edited and saved successfully.",
                    });
                    // When a bulk conclusion is edited, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyFiletree);
                    queryClient.invalidateQueries(keyLicenseConclusions);
                    queryClient.invalidateQueries(
                        keyLicenseConclusionsCountByPurl,
                    );
                    // Close the edit form component and switch to the ordinary component view
                    editHandler(-1);
                },
                onError: (error) => {
                    if (axios.isAxiosError(error)) {
                        if (
                            error.response?.data?.path ===
                            "concludedLicenseSPDX"
                        ) {
                            form.setError("concludedLicenseSPDX", {
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

    const onSubmit = (data: LicenseConclusionFormType) => {
        // Create an array of fields with values
        const fieldsWithValue = [
            data.concludedLicenseSPDX,
            data.concludedLicenseList,
        ].filter((field) => field !== undefined && field !== "");

        // If exactly one field has a value, store that into concludedLicenseExpressionSPDX
        if (fieldsWithValue.length === 1) {
            const concludedLicenseExpressionSPDX = fieldsWithValue[0] || "";
            editLicenseConclusion({
                concludedLicenseExpressionSPDX: concludedLicenseExpressionSPDX,
                comment: data.comment ?? "",
                local: data.local,
            });
        } else if (fieldsWithValue.length === 0) {
            toast({
                variant: "destructive",
                title: "ERROR",
                description:
                    "No license (SPDX expression, or from a license list) specified. Please specify exactly one.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "ERROR",
                description:
                    "More than one license specified. Please specify exactly one.",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="bg-muted m-2 ml-12 flex items-stretch justify-between rounded-lg border p-2">
                    <div className="mr-1 flex-1 items-start text-left">
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold">
                                    {
                                        new Date(licenseConclusion.updatedAt)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                </span>
                                <span className="rounded-sm bg-orange-400 p-1 text-xs font-semibold">
                                    {licenseConclusion.user.username}
                                </span>
                            </div>
                            <div className="flex text-xs">
                                <div className="mr-2 flex whitespace-nowrap font-semibold">
                                    Detected:
                                </div>
                                <div>
                                    {
                                        licenseConclusion.detectedLicenseExpressionSPDX
                                    }
                                </div>
                            </div>
                            <FormLabel className="text-xs font-semibold">
                                Select exactly one of the two below:
                            </FormLabel>
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
                                                fractionalWidth={0.75}
                                                className={
                                                    errors.concludedLicenseList
                                                        ? "border-destructive border"
                                                        : "hover:bg-slate-200"
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
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
                                                        : "bg-white dark:bg-black"
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem className="text-muted-foreground">
                                        <FormLabel className="mr-1 text-xs font-semibold">
                                            Comment:
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="text-xs"
                                                placeholder="Comment..."
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
                                                        By checking this box,
                                                        this license conclusion
                                                        will only apply <br />{" "}
                                                        to the files in this
                                                        version of this package.
                                                    </p>
                                                    <br />
                                                    <p>
                                                        If you want to apply
                                                        this license conclusion
                                                        across all packages
                                                        <br />
                                                        that have the one or
                                                        more of the affected
                                                        files (identified <br />
                                                        by the file's sha256's),
                                                        leave this box
                                                        unchecked.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <FormMessage className="text-xs" />
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
                        </div>
                    </div>
                    <div className="flex pl-1">
                        <div className="flex items-center">
                            <Separator
                                orientation="vertical"
                                className="w-[2px]"
                            />
                            {isLoading ? (
                                <Loader2 className="ml-2 mr-1 h-10 w-10 animate-spin" />
                            ) : (
                                <Button
                                    data-testid="license-conclusion-edit"
                                    variant="outline"
                                    type="submit"
                                    className="ml-2 mr-1 px-2"
                                >
                                    <Check
                                        size={16}
                                        className="text-green-400"
                                    />
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="px-2"
                                onClick={() => editHandler(-1)}
                            >
                                <X size={16} className="text-[#ff3366]" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default LicenseConclusionEditForm;
