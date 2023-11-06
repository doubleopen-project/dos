// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";

import { useUser } from "@/hooks/useUser";

import RegisterUser from "@/components/RegisterUser";
import MultiSection from "@/components/MultiSection";

export default function UserManagement() {
    const user = useUser({ redirectTo: "/login", admin: true });

    return (
        <>
            {user && (
                <MultiSection
                    title="User Management"
                    defaultSection="adduser"
                    sections={[
                        {
                            title: "Register New User",
                            tag: "adduser",
                            href: "/admin/users?section=adduser",
                            content: RegisterUser,
                        },
                    ]}
                />
            )}
            {!user && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-16 h-16 mr-2 animate-spin" />
                </div>
            )}
        </>
    );
}
