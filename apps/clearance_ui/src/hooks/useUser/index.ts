// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useSession } from "next-auth/react";

export type User = {
    username: string;
    role: "ADMIN" | "USER";
};

export const useUser: () => User | null = () => {
    const session = useSession();

    if (session.data?.error !== undefined) {
        return null;
    }

    return session.status === "authenticated"
        ? {
              username: session.data.user.preferred_username,
              role: session.data.user.realm_roles?.find(
                  (role) => role === "app-admin",
              )
                  ? "ADMIN"
                  : "USER",
          }
        : null;
};
