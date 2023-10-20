// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useUser } from "@/hooks/useUser";
import UserDataForm from "@/components/UserDataForm";
import { Loader2 } from "lucide-react";

export default function Profile() {
    const user = useUser({ redirectTo: "/login", redirectIfFound: false });

    return (
        <div className="h-screen flex justify-center items-center p-2">
            <div className="w-full rounded-md h-full p-20 m-1 border shadow-lg">
                <h1 className="text-3xl font-semibold leading-none tracking-tight">
                    Profile
                </h1>
                {user && <UserDataForm user={user} />}
                {!user && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
