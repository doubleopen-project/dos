// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
    const session = useSession();

    useEffect(() => {
        if (session.data?.error === "SessionNotActiveError") {
            signOut();
        }
    }, [session.data?.error]);

    return (
        <main className="min-h-full">
            <div className="flex flex-col items-center justify-center py-6">
                <h1>Welcome to Double Open Clearance UI</h1>
            </div>
        </main>
    );
}
