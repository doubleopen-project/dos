// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { validReasons } from "validation-helpers";
import { z } from "zod";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { patternGlobSchema } from "@/schemes/pattern_schema";

const exclusionFormSchema = z.object({
    pattern: patternGlobSchema,
    reason: z.string().min(1, "Please select a valid reason from this list"),
    comment: z.string().optional(),
});

type ExclusionFormType = z.infer<typeof exclusionFormSchema>;

type Props = {
    purl: string;
    mode: "Edit" | "Add";
    id?: number;
    pattern: string;
    clearPattern: () => void;
    reason?: string;
    comment?: string;
    setOpen: (open: boolean) => void;
};

const ExclusionForm = ({
    purl,
    mode,
    id,
    pattern,
    clearPattern,
    reason,
    comment,
    setOpen,
}: Props) => {
    const defaultValues: ExclusionFormType = {
        pattern: pattern,
        reason: reason || "",
        comment: comment || "",
    };
    const form = useForm<ExclusionFormType>({
        resolver: zodResolver(exclusionFormSchema),
        defaultValues,
    });
    const pathPurl = toPathPurl(purl);
    const keyPathExclusionsByPurl = userHooks.getKeyByAlias(
        "GetPathExclusionsByPurl",
    );
    const keyPathExclusionCountByPurl = userHooks.getKeyByAlias(
        "GetPathExclusionsCount",
    );
    const queryClient = useQueryClient();

    const { mutate: addPathExclusion, isLoading: createIsLoading } =
        userHooks.usePostPathExclusion(
            {
                withCredentials: true,
                params: {
                    purl: pathPurl,
                },
            },
            {
                onSuccess: () => {
                    clearPattern();
                    setOpen(false);
                    toast({
                        title: "Path exclusion",
                        description: "Path exclusion added successfully.",
                    });
                    // When a path exclusion is added, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyPathExclusionsByPurl);
                    queryClient.invalidateQueries(keyPathExclusionCountByPurl);
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

    const { mutate: editPathExclusion, isLoading: updateIsLoading } =
        userHooks.usePutPathExclusion(
            {
                withCredentials: true,
                params: {
                    id: id || -1,
                },
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    toast({
                        title: "Path exclusion",
                        description:
                            "Path exclusion edited and saved successfully.",
                    });
                    // When a path exclusion is edited, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyPathExclusionsByPurl);
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

    const onSubmit = (data: ExclusionFormType) => {
        if (mode === "Add") {
            addPathExclusion({
                pattern: data.pattern,
                reason: data.reason,
                comment: data.comment,
            });
        } else if (mode === "Edit") {
            editPathExclusion({
                pattern: data.pattern,
                reason: data.reason,
                comment: data.comment,
            });
        }
    };
    const { toast } = useToast();

    return (
        <div className="flex w-full flex-col">
            <Label className="mb-1 font-bold">{mode + " path exclusion"}</Label>
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
                                    <Input
                                        className="!min-h-[40px] text-xs"
                                        placeholder="Glob pattern matching to the path to be excluded..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reason</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="text-xs">
                                            <SelectValue placeholder="Select a valid reason..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[40vh] overflow-y-auto">
                                        {validReasons.map((reason) => (
                                            <SelectGroup key={reason.name}>
                                                <SelectItem
                                                    value={reason.name}
                                                    onSelect={() =>
                                                        field.onChange(
                                                            reason.name,
                                                        )
                                                    }
                                                    className="py-0.5 text-xs"
                                                >
                                                    {reason.name}
                                                </SelectItem>
                                                <SelectLabel className="text-muted-foreground mb-1 ml-5 py-0.5 text-xs font-normal italic">
                                                    {reason.description}
                                                </SelectLabel>
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
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
                            disabled={createIsLoading || updateIsLoading}
                        >
                            {createIsLoading || updateIsLoading ? (
                                <>
                                    <Loader2 className="m-1 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                <span>Submit</span>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ExclusionForm;
