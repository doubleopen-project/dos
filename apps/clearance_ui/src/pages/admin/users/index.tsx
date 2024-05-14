// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import MultiSection from "@/components/common/MultiSection";
import RegisterUser from "@/components/user_management/RegisterUser";
import { hasPermission } from "@/helpers/hasPermission";

export default function UserManagement() {
    const session = useSession({
        required: true,
    });
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (
            user &&
            user.permissions &&
            !hasPermission(user.permissions, "Users", "POST")
        ) {
            router.push("/403");
        }
    }, [user, router]);

    useEffect(() => {
        if (session.data?.error === "SessionNotActiveError") {
            signOut();
        } else if (session.data?.error !== undefined) {
            signIn("keycloak");
        }
    }, [session.data?.error]);

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
