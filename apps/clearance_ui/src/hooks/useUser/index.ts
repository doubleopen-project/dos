// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { userHooks } from "@/hooks/zodiosHooks";

export const useUser = () => {
    const { data, error } = userHooks.useGetUser(
        {
            withCredentials: true,
        },
        { retry: false },
    );

    const user = data ? data : null;

    return error ? null : user;
};
