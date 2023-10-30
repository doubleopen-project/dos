// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import z from "zod";
import { useForm } from "react-hook-form";
import { Check, Loader2, Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUsernameSchema, getPasswordSchema } from "validation-helpers";

import { adminHooks } from "@/hooks/zodiosHooks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const addUserFormSchema = z.object({
    username: getUsernameSchema(true),
    password: getPasswordSchema(true),
    role: z.enum(["USER", "ADMIN"]),
    subscription: z.enum(["SILVER", "GOLD"]),
});

type AddUserDataType = z.infer<typeof addUserFormSchema>;

const AddUserForm = () => {
    const {
        error,
        isLoading,
        isSuccess,
        reset,
        mutate: addUser,
    } = adminHooks.useMutation("post", "/user", {
        withCredentials: true,
    });

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
        if (isSuccess) reset();
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

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="ml-1">
                                                <Info size={"15px"} />
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                Password should have:
                                                <ul className="list-disc list-inside">
                                                    <li>
                                                        at least 8 characters
                                                    </li>
                                                    <li>
                                                        at least one uppercase
                                                        letter
                                                    </li>
                                                    <li>
                                                        at least one lowercase
                                                        letter
                                                    </li>
                                                    <li>at least one number</li>
                                                    <li>
                                                        at least one special
                                                        character
                                                    </li>
                                                </ul>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <FormControl>
                                    <Input
                                        placeholder=""
                                        type="password"
                                        {...field}
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
