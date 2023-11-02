// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { useRouter } from "next/router";

import { useUser } from "@/hooks/useUser";
import { authHooks } from "@/hooks/zodiosHooks";

import LoginForm from "@/components/LoginForm";

const parseError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 401
            ? "Invalid username or password"
            : error.response?.data.message || error.response?.statusText;
    } else {
        return error;
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
        reset,
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
                errMsg={error ? parseError(error) : undefined}
                isLoading={isLoading || isSuccess}
                onReset={reset}
            />
        </div>
    );
}
