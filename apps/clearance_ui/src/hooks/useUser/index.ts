// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { Permissions } from "validation-helpers";

export const useUser = () => {
    const session = useSession();
    const [permissions, setPermissions] = useState<Permissions | null>(null);

    const fetchPermissions = async () => {
        const response = await fetch("/api/authz/permissions", {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
        });

        if (response.ok) {
            const data = (await response.json()) as Permissions;
            return data;
        } else {
            // If error response is 403, it means the user has no permissions
            if (response.status === 403) {
                console.error("User has no permissions.");
                return [];
            } else {
                throw new Error(
                    "Permissions request was unsuccessful. API responded with: " +
                        response.status +
                        " " +
                        response.statusText +
                        " when fetching permissions.",
                );
            }
        }
    };

    const { data, error } = useQuery({
        queryKey: ["permissions"],
        queryFn: fetchPermissions,
        enabled: session.status === "authenticated" && !session.data.error,
        refetchInterval: 5 * 60 * 1000, // Refetch permissions every 5 minutes
        retry: 1,
    });

    useEffect(() => {
        if (data) {
            setPermissions(data);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    if (session.data?.error !== undefined) {
        return null;
    }

    return session.status === "authenticated"
        ? {
              username: session.data.user.preferred_username,
              email: session.data.user.email,
              firstName: session.data.user.given_name,
              lastName: session.data.user.family_name,
              role:
                  session.data.user.realm_access.roles?.find((role) =>
                      role.startsWith("app-"),
                  ) || "app-no-role",
              permissions: permissions,
          }
        : null;
};
