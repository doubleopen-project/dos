// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import AddUserForm from "@/components/user_management/AddUserForm";
import CopyUserData from "@/components/user_management/CopyUserData";
import { useState } from "react";

const RegisterUser = () => {
    const [newUser, setNewUser] = useState<{
        username: string;
        password: string;
        role: string;
        subscription: string;
        token: string;
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
                        "role: " +
                        newUser.role +
                        "\n" +
                        "subscription: " +
                        newUser.subscription +
                        "\n" +
                        "token: " +
                        newUser.token
                    }
                />
            )}
        </>
    );
};

export default RegisterUser;
