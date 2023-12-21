// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { authHooks } from "@/hooks/zodiosHooks";

export default function Logout() {
    const [counter, setCounter] = useState(3);
    const queryClient = useQueryClient();

    const {
        error,
        isSuccess,
        isLoading,
        mutate: logoutUser,
    } = authHooks.useMutation(
        "post",
        "/logout",
        { withCredentials: true },
        {
            onSuccess: () => {
                queryClient.removeQueries();
            },
        },
    );
    const router = useRouter();

    useEffect(() => {
        if (counter === 0) router.push("/");
        if (isSuccess) {
            setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);
        }
    }, [counter, router, isSuccess]);

    useEffect(() => {
        logoutUser(undefined);
    }, [logoutUser]);

    return (
        <div className="h-screen">
            <div className="flex h-full items-center justify-center ">
                {isLoading && (
                    <div className="flex h-min w-72 justify-center rounded-md p-10 text-lg">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
                {error && (
                    <h1 className="h-min w-72 rounded-md border p-10 text-lg shadow-lg">
                        Error
                    </h1>
                )}
                {isSuccess && (
                    <div className="h-min w-72 rounded-md border p-10 text-lg shadow-lg">
                        <p>Logged out successfully.</p>
                        <p>Redirecting in {counter} seconds.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
