// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";
import { LoginFormType } from "validation-helpers";
import LoginForm from "@/components/LoginForm";
import { useUser } from "@/hooks/useUser";
import { authHooks } from "@/hooks/zodiosHooks";

const getErrorString = (errorCode: number) => {
    switch (errorCode) {
        case 401:
            return "Invalid username or password";
        default:
            return "Something went wrong. Please try again.";
    }
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
        <div className="bg-gray-200 h-screen flex justify-center items-center">
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
