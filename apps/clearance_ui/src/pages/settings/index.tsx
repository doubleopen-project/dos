// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import MultiSection from "@/components/common/MultiSection";
import TokenDialog from "@/components/user_management/TokenDialog";
import UserDataForm from "@/components/user_management/UserDataForm";

export default function Settings() {
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

    function Profile() {
        return (
            <>
                {user && <UserDataForm />}
                {isLoading && (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
            </>
        );
    }

    function Tokens() {
        return (
            <>
                <p className="pt-4">
                    Here you can create a token you will need for running ORT
                    with DOS Scanner, or to use the scanner via the API.
                </p>
                <p className="pb-8 pt-4">
                    Please note that your previous token will be invalidated
                    when you create a new one.
                </p>
                {user && <TokenDialog />}
                {isLoading && (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            {user && (
                <MultiSection
                    title="Settings"
                    defaultSection="profile"
                    sections={[
                        {
                            title: "Profile",
                            tag: "profile",
                            href: "/settings?section=profile",
                            content: Profile,
                        },
                        {
                            title: "Tokens",
                            tag: "tokens",
                            href: "/settings?section=tokens",
                            content: Tokens,
                        },
                    ]}
                />
            )}
            {errMsg && (
                <div className="flex h-full items-center justify-center">
                    <p className="text-red-500">{errMsg}</p>
                </div>
            )}
        </>
    );
}
