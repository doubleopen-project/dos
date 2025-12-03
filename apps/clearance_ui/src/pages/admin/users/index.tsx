// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { RequireAdmin } from "@/components/auth/RequireAdmin";
import MultiSection from "@/components/common/MultiSection";
import RegisterUser from "@/components/user_management/RegisterUser";

export default function UserManagement() {
    return (
        <RequireAdmin>
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
        </RequireAdmin>
    );
}
