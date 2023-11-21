// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { authHooks, userHooks } from "@/hooks/zodiosHooks";
import LoginForm from "@/components/user_management/LoginForm";

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
    const queryClient = useQueryClient();

    const router = useRouter();

    const {
        error,
        isSuccess,
        isLoading,
        reset,
        mutate: loginUser,
    } = authHooks.useMutation(
        "post",
        "/login/password",
        {
            withCredentials: true,
        },
        {
            onSuccess: () => {
                const key = userHooks.getKeyByPath("get", "/user");
                queryClient.invalidateQueries(key);
            },
        },
    );

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
