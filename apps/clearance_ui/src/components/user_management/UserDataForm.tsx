// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { passwordStrength } from "check-password-strength";
import { Check, Loader2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { getUsernameSchema } from "validation-helpers";
import z from "zod";
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
import PasswordTooltip from "@/components/user_management/PasswordTooltip";
import { cn } from "@/lib/utils";

const userDataFormSchema = z
    .object({
        username: getUsernameSchema(false),
        password: z
            .string()
            .trim()
            .refine(
                (password) => {
                    if (password.length > 0 && password.length < 8)
                        return false;
                    return true;
                },
                { message: "Password needs to be at least 8 characters long" },
            )
            .refine(
                (password) => {
                    if (password.length === 0) return true;
                    return passwordStrength(password).id > 1;
                },
                {
                    message: "Password is too weak",
                },
            ),
        confirmPassword: z.string(),
        role: z.string(),
    })
    .partial()
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmPassword"],
            });
        }
    });
type PutUserDataType = {
    username: string | undefined;
    role: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
};

type UserDataProps = {
    user: {
        username: string;
        role: string;
    };
};

const UserDataForm = ({ user }: UserDataProps) => {
    const [editMode, setEditMode] = useState(false);
    const queryClient = useQueryClient();

    const {
        error,
        isLoading,
        isSuccess,
        reset,
        mutate: updateUser,
    } = userHooks.usePut(
        "/user",
        {
            withCredentials: true,
        },
        undefined,
    );

    const form = useForm<PutUserDataType>({
        resolver: zodResolver(userDataFormSchema),
        values: {
            username: user.username,
            password: "",
            confirmPassword: "",
            role: user.role,
        },
    });

    const onSubmit = (data: PutUserDataType) => {
        if (!data.password || data.password === "") delete data.password;
        updateUser(data);
    };

    const onDiscard = () => {
        const key = userHooks.getKeyByPath("get", "/user");
        queryClient.invalidateQueries(key);
        form.reset();
        setEditMode(false);
    };

    const onInputChange = () => {
        if (isSuccess || error) reset();
    };

    useEffect(() => {
        // Invalidate user data query when component unmounts
        return () => {
            const key = userHooks.getKeyByPath("get", "/user");
            queryClient.invalidateQueries(key);
        };
    }, [queryClient]);

    useEffect(() => {
        if (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.path === "username") {
                    form.setError("username", {
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
        } else {
            if (form.formState.errors.root) {
                form.clearErrors();
            }
        }
    }, [error, form]);

    return (
        <div className="flex flex-col">
            {editMode && (
                <Button
                    className="mx-4 ml-auto mt-8 rounded-lg border border-violet-950 bg-gray-200 p-2"
                    variant={"outline"}
                    disabled
                >
                    <Pencil />
                </Button>
            )}

            {!editMode && (
                <Button
                    className="mx-4 ml-auto mt-8 rounded-lg p-2"
                    variant={"outline"}
                    onClick={() => setEditMode(true)}
                >
                    <Pencil />
                </Button>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onReset={onDiscard}
                    onChange={onInputChange}
                    className="flex flex-col space-y-8 p-4"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="username"
                                        {...field}
                                        disabled={!editMode}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="!mt-4">
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="!mt-4">
                                <div className="flex flex-row">
                                    <FormLabel>New password</FormLabel>
                                    {editMode && <PasswordTooltip />}
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type="password"
                                        {...field}
                                        disabled={!editMode}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="!mt-4">
                                <FormLabel>Confirm new password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type="password"
                                        {...field}
                                        disabled={!editMode}
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
                    <div
                        className={cn(
                            "flex flex-row",
                            editMode ? "visible" : "hidden",
                        )}
                    >
                        <Button
                            className={cn(
                                "mr-1 flex-1",
                                isSuccess ? "!opacity-100" : undefined,
                            )}
                            type="submit"
                            variant={isSuccess ? "success" : "default"}
                            disabled={isLoading || isSuccess}
                        >
                            {isSuccess && <Check />}

                            {isLoading && (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Please wait</span>
                                </>
                            )}

                            {!isLoading && editMode && !isSuccess && (
                                <span>Save changes</span>
                            )}
                        </Button>
                        <Button
                            className={cn(
                                "ml-1 flex-1 border",
                                isLoading || isSuccess
                                    ? "bg-gray-400 hover:bg-gray-400"
                                    : undefined,
                            )}
                            type="reset"
                            variant={
                                !isLoading && editMode && !isSuccess
                                    ? "destructive"
                                    : undefined
                            }
                            disabled={isLoading || isSuccess}
                        >
                            Discard changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UserDataForm;
