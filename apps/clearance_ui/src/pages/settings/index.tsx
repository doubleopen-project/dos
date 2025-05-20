// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useUser } from "@/hooks/useUser";
import MultiSection from "@/components/common/MultiSection";
import TokenDialog from "@/components/user_management/TokenDialog";
import UserDataForm from "@/components/user_management/UserDataForm";

export default function Settings() {
    const user = useUser();
    const session = useSession({
        required: true,
    });

    function Profile() {
        return <UserDataForm />;
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
                <TokenDialog />
            </>
        );
    }

    useEffect(() => {
        if (session.data?.error === "SessionNotActiveError") {
            signOut();
        } else if (session.data?.error !== undefined) {
            signIn("keycloak");
        }
    }, [session.data?.error]);

    return (
        <>
            {user ? (
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
            ) : (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
        </>
    );
}
