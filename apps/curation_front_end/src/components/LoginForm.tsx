// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import z from "zod";

const loginFormSchema = z.object({
    username: z.string(),
    password: z.string(),
});

type LoginFormType = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormType) => void;
    errMsg?: string;
    isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    errMsg,
    isLoading,
}) => {
    const form = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const errVisibilityClass = errMsg ? "visible" : "hidden";

    return (
        <div className="w-72 rounded-md border shadow-lg h-min">
            <Form {...form}>
                <div
                    className={
                        errVisibilityClass +
                        " text-xs text-red-500 pt-4 pr-4 pl-4"
                    }
                >
                    {errMsg}
                </div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 p-4 flex flex-col"
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
                    {isLoading && (
                        <Button
                            className="grow"
                            type="submit"
                            variant={"outline"}
                            disabled
                        >
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    )}
                    {!isLoading && (
                        <Button
                            className="grow"
                            type="submit"
                            variant={"outline"}
                        >
                            Login
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;
