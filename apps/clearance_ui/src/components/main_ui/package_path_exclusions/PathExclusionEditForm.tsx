// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByAlias } from "@zodios/core";
import axios from "axios";
import { Check, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { userAPI, validReasons } from "validation-helpers";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const exclusionFormSchema = z.object({
    pattern: z.string().min(1, "Pattern cannot be empty"),
    reason: z.string().min(1, "Please select a valid reason from this list"),
    comment: z.string().optional(),
});

type ExclusionFormType = z.infer<typeof exclusionFormSchema>;

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusionsByPurl"
>["pathExclusions"][0];

type Props = {
    pathExclusion: PathExclusion;
    editHandler: (id: number) => void;
};

const PathExclusionEditForm = ({ pathExclusion, editHandler }: Props) => {
    const defaultValues: ExclusionFormType = {
        pattern: pathExclusion.pattern || "",
        reason: pathExclusion.reason || "",
        comment: pathExclusion.comment || "",
    };
    const form = useForm<ExclusionFormType>({
        resolver: zodResolver(exclusionFormSchema),
        defaultValues,
    });
    const keyPathExclusionsByPurl = userHooks.getKeyByAlias(
        "GetPathExclusionsByPurl",
    );
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { mutate: editPathExclusion, isLoading } =
        userHooks.usePutPathExclusion(
            {
                withCredentials: true,
                params: {
                    id: pathExclusion.id || -1,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Path exclusion",
                        description:
                            "Path exclusion edited and saved successfully.",
                    });
                    // When a path exclusions is edited, invalidate the query to refetch the data
                    queryClient.invalidateQueries(keyPathExclusionsByPurl);
                    // Close the edit form component and switch to the ordinary component view
                    editHandler(-1);
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
        editPathExclusion({
            pattern: data.pattern,
            reason: data.reason,
            comment: data.comment,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="bg-muted m-2 flex items-stretch justify-between rounded-lg border p-2">
                    <div className="mr-1 flex-1 items-start text-left">
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold">
                                    {
                                        new Date(pathExclusion.updatedAt)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                </span>
                                <span className="rounded-sm bg-orange-400 p-1 text-xs font-semibold">
                                    {pathExclusion.user.username}
                                </span>
                            </div>
                            <FormField
                                control={form.control}
                                name="pattern"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mr-1 text-xs font-semibold">
                                            Glob pattern:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-xs"
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
                                        <FormLabel className="mr-1 text-xs font-semibold">
                                            Reason:
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="text-xs">
                                                    <SelectValue placeholder="Select a valid reason..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {validReasons.map((reason) => (
                                                    <SelectItem
                                                        className="text-xs"
                                                        key={reason}
                                                        value={reason}
                                                        onSelect={() =>
                                                            field.onChange(
                                                                reason,
                                                            )
                                                        }
                                                    >
                                                        {reason}
                                                    </SelectItem>
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

export default PathExclusionEditForm;
