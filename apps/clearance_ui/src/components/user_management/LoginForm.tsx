// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import z from "zod";
import { authHooks, userHooks } from "@/hooks/zodiosHooks";
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
import { cn } from "@/lib/utils";

const parseError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 401
            ? "Invalid username or password"
            : error.response?.data.message || error.response?.statusText;
    } else {
        return error;
    }
};

const loginFormSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .trim()
        .min(1, { message: "Username is required" }),
    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(1, { message: "Password is required" }),
});

type LoginFormType = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [errMsg, setErrMsg] = useState<string | undefined>(undefined);

    const { isLoading, mutate: loginUser } = authHooks.useMutation(
        "post",
        "/login/password",
        {
            withCredentials: true,
        },
        {
            onSuccess: () => {
                const key = userHooks.getKeyByPath("get", "/user");
                queryClient.invalidateQueries(key);
                const redirectToPath = router.query.redirectToPath as string;
                if (
                    redirectToPath &&
                    !redirectToPath.includes("[") &&
                    !redirectToPath.includes("]")
                ) {
                    router.push(redirectToPath);
                } else {
                    router.push("/");
                }
            },
            onError: (error: unknown) => {
                setErrMsg(parseError(error));
            },
        },
    );

    const form = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const submitForm = (loginData: LoginFormType) => {
        loginUser(loginData);
    };

    return (
        <div className="h-min w-72 rounded-md border shadow-lg">
            <Form {...form}>
                <div
                    className={cn(
                        "pl-4 pr-4 pt-4 text-xs text-red-500",
                        errMsg ? "visible" : "hidden",
                    )}
                >
                    {errMsg}
                </div>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    onChange={() => {
                        if (errMsg) setErrMsg(undefined);
                    }}
                    className="flex flex-col space-y-8 p-4"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <div className="flex">
                                        <RiUser3Fill
                                            className="mr-1"
                                            size="2.5rem"
                                        />
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            required
                                        />
                                    </div>
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="flex">
                                        <RiLockPasswordFill
                                            className="mr-1"
                                            size="2.5rem"
                                        />
                                        <Input
                                            placeholder="********"
                                            type="password"
                                            {...field}
                                            required
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="grow" type="submit" disabled={isLoading}>
                        {isLoading && (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Please wait</span>
                            </>
                        )}
                        {!isLoading && <span>Login</span>}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;
