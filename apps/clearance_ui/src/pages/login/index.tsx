// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

//import { useEffect } from "react";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import LoginForm from "@/components/user_management/LoginForm";

export default function Login() {
    const router = useRouter();

    const { data: user } = userHooks.useGetUser(
        {
            withCredentials: true,
        },
        { retry: false },
    );

    if (user) {
        const redirectToPath = router.query.redirectToPath as string;
        if (
            redirectToPath &&
            !redirectToPath.includes("[") &&
            !redirectToPath.includes("]")
        ) {
            router.push(redirectToPath);
        } else {
            router.push("/");
        }
    }

    return (
        <div className="flex h-full items-center justify-center">
            <LoginForm />
        </div>
    );
}
