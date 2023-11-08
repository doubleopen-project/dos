// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

import { authHooks, userHooks } from "@/hooks/zodiosHooks";

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
                const key = userHooks.getKeyByPath("get", "/user");
                queryClient.invalidateQueries(key);
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
            <div className="flex items-center justify-center h-full ">
                {isLoading && (
                    <div className="flex justify-center p-10 text-lg rounded-md w-72 h-min">
                        <Loader2 className="w-16 h-16 mr-2 animate-spin" />
                    </div>
                )}
                {error && (
                    <h1 className="p-10 text-lg border rounded-md shadow-lg w-72 h-min">
                        Error
                    </h1>
                )}
                {isSuccess && (
                    <div className="p-10 text-lg border rounded-md shadow-lg w-72 h-min">
                        <p>Logged out successfully.</p>
                        <p>Redirecting in {counter} seconds.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
