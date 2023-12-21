// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import MultiSection from "@/components/MultiSection";
import RegisterUser from "@/components/user_management/RegisterUser";

export default function UserManagement() {
    const router = useRouter();
    const {
        data: user,
        error,
        isLoading,
    } = userHooks.useGetUser(
        {
            withCredentials: true,
        },
        { retry: false },
    );
    let errMsg;

    if (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            router.push({
                pathname: "/login",
                query: { redirectToPath: router.asPath },
            });
        } else {
            errMsg = error.message;
        }
    }

    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            router.push("/");
        }
    }, [user, router]);

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
            {isLoading && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
            {errMsg && (
                <div className="flex h-full items-center justify-center">
                    <p className="text-red-500">{errMsg}</p>
                </div>
            )}
        </>
    );
}
