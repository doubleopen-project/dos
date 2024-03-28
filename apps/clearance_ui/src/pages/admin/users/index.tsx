// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import MultiSection from "@/components/common/MultiSection";
import RegisterUser from "@/components/user_management/RegisterUser";

export default function UserManagement() {
    const session = useSession({
        required: true,
    });
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            router.push("/");
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
            {user && user.role === "ADMIN" && (
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
            {user && user.role === "USER" && (
                <div className="flex h-full items-center justify-center">
                    <p className="text-red-500">Unauthorized</p>
                </div>
            )}
            {user === null && (
                <div className="flex h-full items-center justify-center">
                    <p className="text-red-500">Please login to continue</p>
                </div>
            )}
        </>
    );
}
