// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";

import { useUser } from "@/hooks/useUser";
import { authHooks } from "@/hooks/zodiosHooks";

import LoginForm from "@/components/LoginForm";

const getErrorString = (errorCode: number) => {
    switch (errorCode) {
        case 401:
            return "Invalid username or password";
        default:
            return "Something went wrong. Please try again.";
    }
};

type LoginFormType = {
    username: string;
    password: string;
};

export default function Login() {
    useUser({ redirectTo: "/", redirectIfFound: true });

    const router = useRouter();

    const {
        error,
        isSuccess,
        isLoading,
        mutate: loginUser,
    } = authHooks.useMutation("post", "/login/password", {
        withCredentials: true,
    });

    const submitForm = (loginData: LoginFormType) => {
        loginUser(loginData);
    };

    if (isSuccess) {
        router.push("/");
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <LoginForm
                onSubmit={submitForm}
                errMsg={
                    error
                        ? getErrorString(
                              parseInt(error.message.slice(-3) as string),
                          )
                        : undefined
                }
                isLoading={isLoading || isSuccess}
            />
        </div>
    );
}
