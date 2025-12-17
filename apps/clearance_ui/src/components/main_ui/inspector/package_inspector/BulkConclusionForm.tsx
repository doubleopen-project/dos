// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Info, Loader2 } from "lucide-react";
import { useForm, useFormState } from "react-hook-form";
import { AiOutlineEye } from "react-icons/ai";
import { bcPatternGlobSchema } from "validation-helpers";
import { z } from "zod";
import { useClearanceActionState } from "@/hooks/useClearanceActionState";
import { userHooks } from "@/hooks/zodiosHooks";
import useContextStore from "@/store/context.store";
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
import ClearanceActionNotice from "@/components/common/ClearanceActionNotice";
import ConclusionLicense from "@/components/common/ConclusionLicense";
import ConclusionSPDX from "@/components/common/ConclusionSPDX";
import { findMatchingPaths } from "@/helpers/findMatchingPaths";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { cn } from "@/lib/utils";
import { concludedLicenseExpressionSPDXSchema } from "@/schemes/spdx_schema";

const bulkConclusionFormSchema = z.object({
    pattern: bcPatternGlobSchema,
    concludedLicenseSPDX: concludedLicenseExpressionSPDXSchema,
    concludedLicenseList: concludedLicenseExpressionSPDXSchema,
    comment: z.string(),
    local: z.boolean(),
});

type BulkConclusionFormType = z.infer<typeof bulkConclusionFormSchema>;

type Props = {
    purl: string;
    pattern: string;
    clearPattern: () => void;
    className?: string;
    setOpen: (open: boolean) => void;
};

const BulkConclusionForm = ({
    purl,
    pattern,
    clearPattern,
    className,
    setOpen,
}: Props) => {
    const { canSubmit } = useClearanceActionState();
    const [matchingPaths, setMatchingPaths] = useState<string[]>([]);
    const selectedGroup = useContextStore((s) => s.selectedClearanceGroup);
    const pathPurl = toPathPurl(purl);
    // Fetch the package file tree data
    const { data: fileTreeData } = userHooks.useGetFileTree(
        {
            params: {
                purl: pathPurl,
            },
        },
        { staleTime: Infinity },
    );
    const paths =
        fileTreeData?.filetrees.map((filetree) => filetree.path) || [];
    const defaultValues: BulkConclusionFormType = {
        pattern: pattern,
        concludedLicenseSPDX: "",
        concludedLicenseList: "",
        comment: "",
        local: false,
    };
    const form = useForm<BulkConclusionFormType>({
        resolver: zodResolver(bulkConclusionFormSchema),
        defaultValues,
    });
    const { errors } = useFormState({ control: form.control });

    const keyLCs = userHooks.getKeyByAlias(
        "GetLicenseConclusionsForFileInPackage",
    );
    const keyLicenseConclusions = userHooks.getKeyByAlias(
        "GetLicenseConclusions",
    );
    const keyLicenseConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetLicenseConclusionsCount",
    );
    const keyBulkConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetBulkConclusionsCountByPurl",
    );
    const keyBulkConclusionCount = userHooks.getKeyByAlias(
        "GetBulkConclusionsCount",
    );

    const queryClient = useQueryClient();
    const { mutate: addBulkConclusion, isLoading } =
        userHooks.usePostBulkConclusion(
            {
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
                    clearPattern();
                    setOpen(false);
                    toast({
                        title: "Bulk conclusion",
                        description: `Bulk license conclusion added successfully.
                        ${res.filesGlob} files matched the pattern, 
                        ${res.filesPackage} identical (SHA256) files affected in this package, 
                        ${res.filesAll} identical (SHA256) files affected in the database.`,
                    });
                    // When a bulk conclusion is added, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyLicenseConclusions);
                    queryClient.invalidateQueries(keyBulkConclusionCountByPurl);
                    queryClient.invalidateQueries(
                        keyLicenseConclusionCountByPurl,
                    );
                    queryClient.invalidateQueries(keyBulkConclusionCount);
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
            if (!selectedGroup) {
                // This should not happen as the clearance action state disables the submit button
                // but is added here so TypeScript recognizes selectedGroup is defined below.
                toast({
                    variant: "destructive",
                    title: "ERROR",
                    description:
                        "No clearance group selected. Please select a clearance group to add a bulk conclusion.",
                });
            } else if (
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
                    clearanceGroupId: selectedGroup.id,
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
                Add bulk license conclusion
            </Label>
            <ClearanceActionNotice />
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
                                            className={cn(
                                                errors.pattern
                                                    ? "border-destructive border"
                                                    : undefined,
                                                "min-h-[40px]! text-xs",
                                            )}
                                            placeholder="Glob pattern matching to the files to be concluded..."
                                            data-testid="glob-pattern"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
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
                    <FormLabel>Select exactly one of the two below</FormLabel>
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
                                                : undefined
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
                                                : ""
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
                            <FormItem className="mr-1 flex-1">
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[40px]! text-xs"
                                        placeholder="Comment on your bulk conclusion..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="local"
                        render={({ field }) => (
                            <FormItem className="ml-1 flex flex-row items-end space-y-2 space-x-3 rounded-md">
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
                    <div className="flex justify-end">
                        <Button
                            type="reset"
                            variant="outline"
                            className="mt-2 mr-2 rounded-md p-1 text-xs"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="mt-2 rounded-md p-1 text-xs"
                            disabled={!canSubmit || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="m-1 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                <>Add bulk conclusion</>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default BulkConclusionForm;
