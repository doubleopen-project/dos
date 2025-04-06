// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "@/lib/authTokenManager";

export default function AccessTokenSync() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.accessToken) {
            setAccessToken(session.accessToken);
        }
    }, [session?.accessToken]);

    return null;
}
