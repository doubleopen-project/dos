// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { passwordStrength } from "check-password-strength";
import { Check, Loader2, Pencil } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { getUsernameSchema } from "validation-helpers";
import z from "zod";
import { useUser } from "@/hooks/useUser";
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
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email().optional(),
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

type PutUserDataType = z.infer<typeof userDataFormSchema>;

const UserDataForm = () => {
    const user = useUser();
    const session = useSession();
    const [editMode, setEditMode] = useState(false);
    const queryClient = useQueryClient();

    const {
        error,
        isLoading,
        isSuccess,
        reset,
        mutate: updateUser,
    } = userHooks.usePutUser(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
        },
        {
            onSuccess: () => {
                // This will update the user data in the session
                signIn("keycloak");
            },
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.data?.path === "username") {
                        form.setError("username", {
                            type: "manual",
                            message: error.response?.data?.message,
                        });
                    } else if (
                        error.response?.data?.message ===
                        "User with this username or email already exists"
                    ) {
                        if (
                            form.getValues("username") ===
                            session.data?.user?.preferred_username
                        ) {
                            form.setError("email", {
                                type: "manual",
                                message:
                                    "Email already in use with another user",
                            });
                        } else if (
                            form.getValues("email") ===
                            session.data?.user?.email
                        ) {
                            form.setError("username", {
                                type: "manual",
                                message: "Username already in use",
                            });
                        } else {
                            form.setError("root", {
                                type: "manual",
                                message: error.response?.data?.message,
                            });
                        }
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

    const form = useForm<PutUserDataType>({
        resolver: zodResolver(userDataFormSchema),
        values: {
            username: user?.username,
            firstName: session.data?.user?.given_name || "",
            lastName: session.data?.user?.family_name || "",
            email: session.data?.user?.email || "",
            password: "",
            confirmPassword: "",
            role: user?.role,
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

    return (
        <div className="flex flex-col">
            {editMode && (
                <Button
                    className="mx-4 mt-8 ml-auto rounded-lg border border-violet-950 bg-gray-200 p-2"
                    variant={"outline"}
                    disabled
                >
                    <Pencil />
                </Button>
            )}

            {!editMode && (
                <Button
                    className="mx-4 mt-8 ml-auto rounded-lg p-2"
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
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="First name"
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
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Last name"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email"
                                        {...field}
                                        disabled={!editMode}
                                        type="email"
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
                            <FormItem className="mt-4!">
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
                            <FormItem className="mt-4!">
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
                            <FormItem className="mt-4!">
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
                                isSuccess ? "opacity-100!" : undefined,
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
