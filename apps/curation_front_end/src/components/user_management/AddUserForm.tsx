// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import generator from "generate-password";
import { Check, Dices, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { getPasswordSchema, getUsernameSchema } from "validation-helpers";
import z from "zod";
import { adminHooks } from "@/hooks/zodiosHooks";
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
import PasswordTooltip from "@/components/user_management/PasswordTooltip";

const addUserFormSchema = z.object({
    username: getUsernameSchema(true),
    password: getPasswordSchema(true),
    role: z.enum(["USER", "ADMIN"]),
    subscription: z.enum(["SILVER", "GOLD"]),
});

type AddUserDataType = z.infer<typeof addUserFormSchema>;

type AddUserFormProps = {
    onNewUserCreated: (
        user: {
            username: string;
            password: string;
            role: string;
            subscription: string;
            token: string;
        } | null,
    ) => void;
};

const parseError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data.message;
    } else {
        return error;
    }
};

const AddUserForm = ({ onNewUserCreated }: AddUserFormProps) => {
    const {
        error,
        isError,
        isLoading,
        isSuccess,
        reset,
        mutate: addUser,
    } = adminHooks.useMutation(
        "post",
        "/user",
        {
            withCredentials: true,
        },
        {
            onSuccess: (data) => {
                onNewUserCreated(data);
            },
            onError: () => {
                onNewUserCreated(null);
            },
        },
    );

    const form = useForm<AddUserDataType>({
        resolver: zodResolver(addUserFormSchema),
        defaultValues: {
            username: "",
            password: "",
            role: "USER",
            subscription: "SILVER",
        },
    });

    const onSubmit = (data: AddUserDataType) => {
        addUser(data);
    };

    const onDiscard = () => {
        reset();
        form.reset();
    };

    const onchange = () => {
        if (isSuccess || isError) reset();
    };

    return (
        <div className="flex flex-col">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onReset={onDiscard}
                    onChange={onchange}
                    className="flex flex-col p-4 space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
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
                                    <FormLabel>Password</FormLabel>
                                    <PasswordTooltip />
                                </div>
                                <div className="flex flex-row">
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <Button
                                        className="ml-2 gen-pass-btn"
                                        variant={"outline"}
                                        onClick={() => {
                                            const password = generator.generate(
                                                {
                                                    length: 15,
                                                    numbers: true,
                                                    lowercase: true,
                                                    uppercase: true,
                                                    symbols: true,
                                                    strict: true,
                                                },
                                            );
                                            field.onChange(password);
                                        }}
                                        type="button"
                                    >
                                        <Dices />
                                    </Button>
                                </div>
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
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="USER">
                                            USER
                                        </SelectItem>
                                        <SelectItem value="ADMIN">
                                            ADMIN
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subscription"
                        render={({ field }) => (
                            <FormItem className="!mt-4">
                                <FormLabel>Subscription</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subscription" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="SILVER">
                                            SILVER
                                        </SelectItem>
                                        <SelectItem value="GOLD">
                                            GOLD
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && (
                        <div
                            className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {parseError(error)}
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
                    {!isLoading && !isSuccess && (
                        <div className="flex flex-row">
                            <Button
                                className="flex-1 mr-1"
                                type="submit"
                                variant={"outline"}
                            >
                                Add user
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
                                variant={"success"}
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

export default AddUserForm;
