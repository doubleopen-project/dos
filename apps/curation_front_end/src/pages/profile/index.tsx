// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useUser } from "@/hooks/useUser";
import UserData from "@/components/UserData";

export default function Profile() {
    const user = useUser({ redirectTo: "/login", redirectIfFound: false });

    return (
        <div className="bg-gray-200 h-screen flex justify-center items-center">
            <div className="w-full bg-white rounded-md h-full p-20 m-20">
                <h1 className="text-2xl font-semibold leading-none tracking-tight">Profile</h1>
                {user && (
                    <UserData
                        username={user?.username}
                        role={user?.role}
                    />
                )
                }
            </div>
        </div >
    )
}