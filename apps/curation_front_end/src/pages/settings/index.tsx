// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import MultiSection from "@/components/MultiSection";
import TokenDialog from "@/components/user_management/TokenDialog";
import UserDataForm from "@/components/user_management/UserDataForm";

export default function Settings() {
    const user = useUser({ redirectTo: "/login", redirectIfFound: false });

    function Profile() {
        return (
            <>
                {user && <UserDataForm user={user} />}
                {!user && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-16 h-16 mr-2 animate-spin" />
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
                <p className="pt-4 pb-8">
                    Please note that your previous token will be invalidated
                    when you create a new one.
                </p>
                {user && <TokenDialog />}
                {!user && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-16 h-16 mr-2 animate-spin" />
                    </div>
                )}
            </>
        );
    }

    return (
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
    );
}
