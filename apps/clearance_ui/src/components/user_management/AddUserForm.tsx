// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import generator from "generate-password";
import { Check, Dices, Info, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { getPasswordSchema, getUsernameSchema } from "validation-helpers";
import z from "zod";
import { adminHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import PasswordTooltip from "@/components/user_management/PasswordTooltip";

const addUserFormSchema = z.object({
    username: getUsernameSchema(true),
    password: getPasswordSchema(true),
    passwordIsTemporary: z.boolean().optional(),
    role: z.enum(["USER", "ADMIN"]),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    dosApiToken: z.string().optional(),
});

type AddUserDataType = z.infer<typeof addUserFormSchema>;

type AddUserFormProps = {
    onNewUserCreated: (
        user: {
            id: string;
            username: string;
            password: string;
            realmRoles: string[];
            dosApiToken?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            requiredActions?: string[];
        } | null,
    ) => void;
};

const AddUserForm = ({ onNewUserCreated }: AddUserFormProps) => {
    const session = useSession();
    const {
        isError,
        isLoading,
        isSuccess,
        reset,
        mutate: addUser,
    } = adminHooks.useCreateUser(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
        },
        {
            onSuccess: (data) => {
                onNewUserCreated({
                    id: data.id,
                    username: data.username,
                    password: form.getValues("password"),
                    realmRoles: data.realmRoles,
                    dosApiToken: data.dosApiToken,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    requiredActions: data.requiredActions,
                });
            },
            onError: (error) => {
                onNewUserCreated(null);
                console.log(error);
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
            },
        },
    );

    const form = useForm<AddUserDataType>({
        resolver: zodResolver(addUserFormSchema),
        defaultValues: {
            username: "",
            password: "",
            passwordIsTemporary: true,
            role: "USER",
            firstName: "",
            lastName: "",
            email: "",
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
                                <div className="flex flex-row">
                                    <FormLabel>Password</FormLabel>
                                    <PasswordTooltip />
                                </div>
                                <div className="flex flex-row">
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <Button
                                        className="gen-pass-btn ml-2"
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
                        name="passwordIsTemporary"
                        render={({ field }) => (
                            <FormItem className="!mt-4 flex items-center">
                                <FormLabel className="mt-1">
                                    Temporary password
                                </FormLabel>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger
                                            type="button"
                                            className="ml-1"
                                        >
                                            <Info size={"15px"} />
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="top"
                                            className="mb-2"
                                        >
                                            <p>
                                                If checked, the user will be
                                                forced to change their password
                                                on first login.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="ml-1"
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
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="!mt-4">
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="First name"
                                        {...field}
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
                            <FormItem className="!mt-4">
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="!mt-4">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
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

                    {isLoading && (
                        <div className="flex flex-row">
                            <Button
                                className="grow"
                                type="submit"
                                variant={"outline"}
                                disabled
                            >
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            <Button
                                className="ml-1 flex-1 border bg-gray-400 hover:bg-gray-400"
                                type="reset"
                                disabled
                            >
                                Discard changes
                            </Button>
                        </div>
                    )}
                    {!isLoading && !isSuccess && (
                        <div className="flex flex-row">
                            <Button className="mr-1 flex-1" type="submit">
                                Add user
                            </Button>
                            <Button
                                className="ml-1 flex-1 border"
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
                                className="ml-1 flex-1 border bg-gray-400 hover:bg-gray-400"
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
