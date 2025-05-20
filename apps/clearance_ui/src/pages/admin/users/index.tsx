// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import MultiSection from "@/components/common/MultiSection";
import RegisterUser from "@/components/user_management/RegisterUser";
import { hasPermission } from "@/helpers/hasPermission";

export default function UserManagement() {
    const router = useRouter();
    const user = useUser({
        required: true,
    });

    useEffect(() => {
        if (
            user &&
            user.permissions &&
            !hasPermission(user.permissions, "Users", "POST")
        ) {
            router.push("/403");
        }
    }, [user, router]);

    return (
        <>
            {user &&
                user.permissions &&
                hasPermission(user.permissions, "Users", "POST") && (
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
        </>
    );
}
