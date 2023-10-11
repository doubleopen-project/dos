// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";
import { useEffect } from "react";
import { userHooks } from "@/hooks/zodiosHooks";

interface UseUserOptions {
    redirectTo?: string;
    redirectIfFound?: boolean;
}

export const useUser = (options: UseUserOptions) => {
    const { data, error } = userHooks.useGetUser(
        { withCredentials: true },
        { retry: false, cacheTime: 0 },
    );

    const router = useRouter();

    const user = error ? null : data ? { username: data.username } : null;
    const finished = Boolean(data);
    const hasUser = Boolean(user);

    useEffect(() => {
        if (!options.redirectTo || !finished) return;
        if (
            // If redirectTo is set, redirect if the user was not found.
            (options.redirectTo && !options.redirectIfFound && !hasUser) ||
            // If redirectIfFound is also set, redirect if the user was found
            (options.redirectIfFound && hasUser && !error)
        ) {
            router.push(options.redirectTo);
        }
    }, [options, finished, hasUser, error, router]);

    return error ? null : user;
};
