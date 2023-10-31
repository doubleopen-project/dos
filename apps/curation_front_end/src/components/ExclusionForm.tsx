// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormLabel,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userHooks } from "@/hooks/zodiosHooks";
import { useQueryClient } from "@tanstack/react-query";
import isGlob from "is-glob";
import { validReasons } from "validation-helpers";

const exclusionFormSchema = z.object({
    pattern: z
        .string()
        .min(1, "Pattern cannot be empty")
        .refine((pattern) => isGlob(pattern), {
            message: "Pattern is not a valid glob",
        }),
    reason: z.string().min(1, "Please select a valid reason from this list"),
    comment: z.string().optional(),
});

type ExclusionFormType = z.infer<typeof exclusionFormSchema>;

type Props = {
    purl: string | undefined;
};

const ExclusionForm = ({ purl }: Props) => {
    const defaultValues: ExclusionFormType = {
        pattern: "",
        reason: "",
        comment: "",
    };

    const form = useForm<ExclusionFormType>({
        resolver: zodResolver(exclusionFormSchema),
        defaultValues,
    });

    const key = userHooks.getKeyByPath("post", "/path-exclusions");
    const queryClient = useQueryClient();
    const { mutate: addPathExclusion } = userHooks.useMutation(
        "post",
        "/path-exclusion",
        {
            withCredentials: true,
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(key);
            },
        },
    );

    const onSubmit = (data: ExclusionFormType) => {
        addPathExclusion({
            purl: purl,
            pattern: data.pattern,
            reason: data.reason,
            comment: data.comment,
        });
    };

    return (
        <div className="flex flex-col w-full">
            <Label className="mb-1 font-bold">Add path exclusion</Label>
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
                                        className="text-xs"
                                        placeholder="Pattern..."
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a valid reason..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {validReasons.map((reason) => (
                                            <SelectItem
                                                key={reason}
                                                value={reason}
                                                onSelect={() =>
                                                    field.onChange(reason)
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
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            type="submit"
                            className="p-1 mt-2 text-xs rounded-md"
                        >
                            Add path exclusion
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ExclusionForm;
