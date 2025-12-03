// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";

export function RequireAdmin({ children }: { children: ReactNode }) {
    const router = useRouter();
    const user = useUser({ required: true });

    if (!user) return null;

    if (user && user.role !== "app-admin") {
        router.push("/403");
        return null;
    }

    return <>{children}</>;
}
