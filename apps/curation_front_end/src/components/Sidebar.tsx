// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineHome } from "react-icons/ai";
import {
    GrInspect,
    GrCatalog,
    GrLogout,
    GrUserManager,
    GrUserSettings,
    GrLogin,
} from "react-icons/gr";

import { useUser } from "@/hooks/useUser";

import { ModeToggle } from "@/components/ModeToggle";

interface SidebarProps {
    children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
    const router = useRouter();
    const user = useUser({});
    return (
        <div className="flex">
            <div className="fixed w-20 h-screen p-4  border-r-[1px] flex flex-col justify-between">
                <div className="flex flex-col items-center">
                    <Link href="/">
                        <div
                            className="inline-block p-3 text-white bg-purple-800 rounded-lg hover:bg-purple-400"
                            title="Home"
                        >
                            <AiOutlineHome size={20} />
                        </div>
                    </Link>
                    <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
                    <Link href="/packages">
                        <div
                            className="inline-block p-3 my-4 bg-gray-200 rounded-lg hover:bg-gray-400"
                            title="Package Library"
                        >
                            <GrCatalog size={20} />
                        </div>
                    </Link>
                    <Link href="/curation">
                        <div
                            className="inline-block p-3 my-4 bg-gray-200 rounded-lg hover:bg-gray-400"
                            title="Package Curations"
                        >
                            <GrInspect size={20} />
                        </div>
                    </Link>

                    {!user && (
                        <Link href="/login">
                            <div
                                className="inline-block p-3 my-4 bg-gray-200 rounded-lg hover:bg-gray-400"
                                title="Login"
                            >
                                <GrLogin size={20} />
                            </div>
                        </Link>
                    )}
                    {router.pathname !== "/logout" && user && (
                        <Link href="/settings">
                            <div
                                className="inline-block p-3 my-4 bg-gray-200 rounded-lg hover:bg-gray-400"
                                title="Settings"
                            >
                                <GrUserSettings size={20} />
                            </div>
                        </Link>
                    )}
                    {router.pathname !== "/logout" &&
                        user?.role === "ADMIN" && (
                            <Link href="/admin/users">
                                <div
                                    className="inline-block p-3 my-4 bg-gray-200 rounded-lg hover:bg-gray-400"
                                    title="User Management"
                                >
                                    <GrUserManager size={20} />
                                </div>
                            </Link>
                        )}
                    {router.pathname !== "/logout" && user && (
                        <Link href="/logout">
                            <div
                                className="inline-block p-3 my-4 bg-gray-200 rounded-lg hover:bg-gray-400"
                                title="Logout"
                            >
                                <GrLogout size={20} />
                            </div>
                        </Link>
                    )}
                    <ModeToggle />
                </div>
            </div>
            <main className="w-full ml-20">{children}</main>
        </div>
    );
};

export default Sidebar;
