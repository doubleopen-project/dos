// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";

interface UseUserOptions {
    redirectTo?: string;
    redirectIfFound?: boolean;
    admin?: boolean;
}

export const useUser = (options: UseUserOptions) => {
    const { data, isLoading, error } = userHooks.useGetUser(
        { withCredentials: true },
        { retry: false, cacheTime: 0 },
    );

    const router = useRouter();

    const user = error
        ? null
        : isLoading
          ? undefined
          : data
            ? { username: data.username, role: data.role }
            : null;
    const finished = Boolean(data);
    const hasUser = Boolean(user);
    const isAdmin = user?.role === "ADMIN";

    useEffect(() => {
        if (!options.redirectTo || !finished) return;
        if (
            // If redirectTo is set, redirect if the user was not found.
            (options.redirectTo && !options.redirectIfFound && !hasUser) ||
            // If redirectIfFound is also set, redirect if the user was found
            (options.redirectIfFound && hasUser && !error) ||
            // If admin is set, redirect if the user is not an admin
            (options.admin && !isAdmin)
        ) {
            router.push(options.redirectTo);
        }
    }, [options, finished, hasUser, error, router, isAdmin]);

    return error ? null : user;
};
