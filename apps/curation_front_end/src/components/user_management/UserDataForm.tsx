// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";

import z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Check, Loader2 } from "lucide-react";
import { getUsernameSchema, getPasswordSchema } from "validation-helpers";

import { userHooks } from "@/hooks/zodiosHooks";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordTooltip from "@/components/user_management/PasswordTooltip";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";

const userDataFormSchema = z
    .object({
        username: getUsernameSchema(false),
        password: getPasswordSchema(false),
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
    role: string;
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
        {
            onSuccess() {
                // invalidate user data query
                const key = userHooks.getKeyByPath("get", "/user");
                queryClient.invalidateQueries(key);
            },
        },
    );

    const form = useForm<PutUserDataType>({
        resolver: zodResolver(userDataFormSchema),
        values: {
            username: user.username,
            password: undefined,
            confirmPassword: undefined,
            role: user.role,
        },
    });

    const onSubmit = (data: PutUserDataType) => {
        if (!data.password) data.password = undefined;
        updateUser(data);
    };

    const onDiscard = () => {
        reset();
        form.reset();
        setEditMode(false);
    };

    const onInputChange = () => {
        if (isSuccess || error) reset();
    };

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
                    className="p-2 mx-4 mt-8 ml-auto bg-gray-200 border rounded-lg border-violet-950"
                    variant={"outline"}
                    disabled
                >
                    <Pencil />
                </Button>
            )}

            {!editMode && (
                <Button
                    className="p-2 mx-4 mt-8 ml-auto rounded-lg"
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
                    className="flex flex-col p-4 space-y-8"
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
                            className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
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
                                "flex-1 mr-1",
                                isSuccess ? "!opacity-100" : undefined,
                            )}
                            type="submit"
                            variant={"outline"}
                            disabled={isLoading || isSuccess}
                        >
                            {isSuccess && <Check />}

                            {isLoading && (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    <span>Please wait</span>
                                </>
                            )}

                            {!isLoading && editMode && !isSuccess && (
                                <span>Save changes</span>
                            )}
                        </Button>
                        <Button
                            className={cn(
                                "flex-1 ml-1 border",
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
