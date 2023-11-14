// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import z from "zod";

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

interface LoginFormProps {
    onSubmit: (data: LoginFormType) => void;
    errMsg?: string;
    isLoading?: boolean;
    onReset: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    errMsg,
    isLoading,
    onReset,
}) => {
    const form = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    return (
        <div className="border rounded-md shadow-lg w-72 h-min">
            <Form {...form}>
                <div
                    className={cn(
                        "text-xs text-red-500 pt-4 pr-4 pl-4",
                        errMsg ? "visible" : "hidden",
                    )}
                >
                    {errMsg}
                </div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onChange={() => {
                        if (errMsg) onReset();
                    }}
                    className="flex flex-col p-4 space-y-8"
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
                    <Button
                        className="grow"
                        type="submit"
                        variant={"outline"}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
