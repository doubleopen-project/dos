// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import MultiSection from "@/components/MultiSection";
import RegisterUser from "@/components/user_management/RegisterUser";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";

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
