// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useState } from "react";
import AddUserForm from "@/components/user_management/AddUserForm";
import CopyUserData from "@/components/user_management/CopyUserData";

const RegisterUser = () => {
    const [newUser, setNewUser] = useState<{
        id: string;
        username: string;
        password: string;
        realmRoles: string[];
        dosApiToken?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        requiredActions?: string[];
    } | null>(null);

    return (
        <>
            <AddUserForm onNewUserCreated={setNewUser} />
            {newUser && (
                <CopyUserData
                    copyContent={
                        "username: " +
                        newUser.username +
                        "\n" +
                        "password: " +
                        newUser.password +
                        "\n" +
                        "roles: " +
                        newUser.realmRoles +
                        "\n" +
                        "dos api token: " +
                        newUser.dosApiToken +
                        "\n" +
                        "first name: " +
                        newUser.firstName +
                        "\n" +
                        "last name: " +
                        newUser.lastName +
                        "\n" +
                        "email: " +
                        newUser.email +
                        "\n" +
                        "required actions: " +
                        newUser.requiredActions
                    }
                />
            )}
        </>
    );
};

export default RegisterUser;
