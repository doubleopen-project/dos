// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import MultiSection from "@/components/common/MultiSection";
import UserDataForm from "@/components/user_management/UserDataForm";

export default function Settings() {
    const user = useUser({
        required: true,
    });

    function Profile() {
        return <UserDataForm />;
    }

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
