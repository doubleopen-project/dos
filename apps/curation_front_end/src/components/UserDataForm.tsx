// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ZodiosBodyByPath } from "@zodios/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userAPI, PutUserReq } from "validation-helpers";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PasswordInput, UsernameInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type PutUserDataType = ZodiosBodyByPath<typeof userAPI, "put", "/user">;

type UserDataFormProps = {
    onSubmit: (data: PutUserDataType) => void;
    errMsg?: string;
    isLoading?: boolean;
}

const UserDataForm = ({ onSubmit, errMsg, isLoading }: UserDataFormProps) => {
    const form = useForm<PutUserDataType>({
        resolver: zodResolver(PutUserReq),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    return (
        <div className="w-72 bg-white rounded-md h-min">
            <Form {...form}>
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
                                    <UsernameInput
                                        placeholder="username"
                                        {...field}
                                        required
                                    />
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
                                    <PasswordInput
                                        placeholder="********"
                                        type="password"
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {isLoading && (
                        <Button className="grow" type="submit" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    )}
                    {!isLoading && (
                        <Button className="grow" type="submit">
                            Save
                        </Button>
                    )}

                </form>
            </Form>
        </div>
    )
}

export default UserDataForm;
