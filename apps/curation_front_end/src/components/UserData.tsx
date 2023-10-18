// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userDataFormSchema } from "validation-helpers";
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
import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { useState } from "react";
import { ZodError } from "zod";

type PutUserDataType = {
    username: string | undefined;
    password: string | undefined;
};

type UserDataProps = {
    username: string;
    role: string;
};

const UserData = ({ username, role }: UserDataProps) => {

    const [editMode, setEditMode] = useState(false);

    const form = useForm<PutUserDataType>({
        resolver: zodResolver(userDataFormSchema),
        defaultValues: {
            username: username,
            password: "",
        },
    });

    const onSubmit = (data: PutUserDataType) => {
        console.log(data);
        if (data.password === "") data.password = undefined;
        updateUser(data);
    };

    const {
        error,
        isSuccess,
        isLoading,
        mutate: updateUser,
    } = userHooks.useMutation("put", "/user", { params: { id: true }, withCredentials: true });

    const errVisibilityClass = error ? "visible" : "hidden";

    return (

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
                    name="password"
                    render={({ field }) => (
                        <FormItem className="!mt-4">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="********"
                                    type="password"
                                    {...field}
                                    disabled={!editMode}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!editMode && (
                    <Button className="grow" type="button" onClick={() => setEditMode(true)}>
                        Edit
                    </Button>
                )
                }
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error.name}</span>
                    </div>
                )}
                {isLoading && (
                    <Button className="grow" type="submit" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </Button>
                )}
                {!isLoading && (
                    <Button className="grow" type="submit">
                        Save changes
                    </Button>
                )}

            </form>
        </Form>

    )
}

export default UserData;
