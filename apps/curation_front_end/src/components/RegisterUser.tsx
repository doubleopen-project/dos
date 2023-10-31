// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useState } from "react";

import { cn } from "@/lib/utils";

import AddUserForm from "@/components/AddUserForm";
import CopyUserData from "@/components/CopyUserData";

type RegisterUserProps = {
    visible: boolean;
};

const RegisterUser = ({ visible }: RegisterUserProps) => {
    const [newUser, setNewUser] = useState<{
        username: string;
        password: string;
        role: string;
        subscription: string;
        token: string;
    } | null>(null);

    return (
        <div className="flex-1 lg:max-w-2xl">
            <div
                className={cn(
                    "w-full p-20 border rounded-md shadow-lg",
                    visible ? "" : "hidden",
                )}
            >
                <h2>Register new user</h2>
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
            </div>
        </div>
    );
};

export default RegisterUser;
