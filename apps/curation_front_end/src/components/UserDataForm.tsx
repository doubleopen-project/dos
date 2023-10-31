// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useState } from "react";

import axios from "axios";
import z, { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { ZodiosError } from "@zodios/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Check, Loader2, Info } from "lucide-react";

import { userHooks } from "@/hooks/zodiosHooks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordTooltip from "./PasswordTooltip";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const userDataFormSchema = z.object({
    username: z.string(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z.string().optional(),
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
    const [username, setUsername] = useState<string>(user.username);
    const [otherError, setOtherError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<
        string | null
    >(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    const {
        error,
        isLoading,
        isSuccess,
        reset,
        mutate: updateUser,
    } = userHooks.usePut("/user", {
        withCredentials: true,
    });

    const form = useForm<PutUserDataType>({
        resolver: zodResolver(userDataFormSchema),
        values: {
            username: username,
            password: "",
            confirmPassword: "",
            role: user.role,
        },
    });

    const nullifyErrors = () => {
        setOtherError(null);
        setUsernameError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);
    };

    const onSubmit = (data: PutUserDataType) => {
        nullifyErrors();
        if (data.password !== data.confirmPassword)
            setConfirmPasswordError("Passwords do not match");
        else {
            if (data.password === "") data.password = undefined;

            updateUser(data, {
                onSuccess() {
                    const formUsername = form.getValues("username");

                    if (formUsername && formUsername !== username) {
                        setUsername(formUsername);
                    }
                },
            });
        }
    };

    const onDiscard = () => {
        reset();
        form.reset();
        setEditMode(false);
        nullifyErrors();
    };

    const onInputChange = () => {
        reset();
        if (otherError) setOtherError(null);
        if (usernameError) setUsernameError(null);
        if (passwordError) setPasswordError(null);
        if (confirmPasswordError) setConfirmPasswordError(null);
    };

    if (error) {
        if (error instanceof ZodiosError) {
            if (error.cause instanceof ZodError) {
                let tempUserError: string | null = null;
                let tempPasswordError: string | null = null;
                for (const issue of error.cause.issues) {
                    for (const path of issue.path) {
                        if (path === "username") {
                            if (tempUserError === null) {
                                tempUserError = issue.message;
                            }
                        }
                        if (path === "password") {
                            if (tempPasswordError === null) {
                                tempPasswordError = issue.message;
                            }
                        }
                    }
                }
                if (tempUserError && !usernameError)
                    setUsernameError(tempUserError);
                if (tempPasswordError && !passwordError)
                    setPasswordError(tempPasswordError);
            }
        } else if (axios.isAxiosError(error)) {
            if (error.response?.data?.path === "username") {
                if (!usernameError)
                    setUsernameError(error.response?.data?.message);
            } else if (error.response?.data?.message && !otherError) {
                if (!otherError) setOtherError(error.response?.data?.message);
            }
        } else {
            if (!otherError) setOtherError(error.message);
        }
    }

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
                                {usernameError && (
                                    <div
                                        className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {usernameError}
                                        </span>
                                    </div>
                                )}
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
                                {passwordError && (
                                    <div
                                        className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {passwordError}
                                        </span>
                                    </div>
                                )}
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
                                {confirmPasswordError && (
                                    <div
                                        className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {confirmPasswordError}
                                        </span>
                                    </div>
                                )}
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
                    {otherError && !usernameError && !passwordError && (
                        <div
                            className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {otherError}
                            </span>
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex flex-row">
                            <Button
                                className="grow"
                                type="submit"
                                variant={"outline"}
                                disabled
                            >
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Please wait
                            </Button>
                            <Button
                                className="flex-1 ml-1 bg-gray-400 border hover:bg-gray-400"
                                type="reset"
                                disabled
                            >
                                Discard changes
                            </Button>
                        </div>
                    )}
                    {!isLoading && editMode && !isSuccess && (
                        <div className="flex flex-row">
                            <Button
                                className="flex-1 mr-1"
                                type="submit"
                                variant={"outline"}
                            >
                                Save changes
                            </Button>
                            <Button
                                className="flex-1 ml-1 border"
                                variant={"destructive"}
                                type="reset"
                            >
                                Discard changes
                            </Button>
                        </div>
                    )}
                    {isSuccess && (
                        <div className="flex flex-row">
                            <Button
                                className="grow !opacity-100"
                                variant={"outline"}
                                disabled
                            >
                                <Check />
                            </Button>
                            <Button
                                className="flex-1 ml-1 bg-gray-400 border hover:bg-gray-400"
                                type="reset"
                                disabled
                            >
                                Discard changes
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
};

export default UserDataForm;
