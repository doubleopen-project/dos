// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import {
    GrCatalog,
    GrInspect,
    GrLogin,
    GrLogout,
    GrUserManager,
    GrUserSettings,
} from "react-icons/gr";
import { useUser } from "@/hooks/useUser";
import { ModeToggle } from "@/components/ModeToggle";

interface SidebarProps {
    children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
    const user = useUser();
    return (
        <div className="flex">
            <div className="overflow-none flex h-screen flex-col items-center justify-between border-r-[1px] p-4">
                <div className="flex flex-col items-center">
                    <Link href="/">
                        <div
                            className="inline-block rounded-lg bg-purple-800 p-3 text-white hover:bg-purple-400"
                            title="Home"
                        >
                            <AiOutlineHome size={20} />
                        </div>
                    </Link>
                    <span className="w-full border-b-[1px] border-gray-200 p-2"></span>
                    {user && (
                        <>
                            <Link href="/packages">
                                <div
                                    className="my-4 inline-block rounded-lg bg-gray-200 p-3 text-black hover:bg-gray-400"
                                    title="Package Library"
                                >
                                    <GrCatalog size={20} />
                                </div>
                            </Link>
                            <Link href="/clearances">
                                <div
                                    className="my-4 inline-block rounded-lg bg-gray-200 p-3 text-black hover:bg-gray-400"
                                    title="Clearance Library"
                                >
                                    <GrInspect size={20} />
                                </div>
                            </Link>

                            <Link href="/settings">
                                <div
                                    className="my-4 inline-block rounded-lg bg-gray-200 p-3 text-black hover:bg-gray-400"
                                    title="Settings"
                                >
                                    <GrUserSettings size={20} />
                                </div>
                            </Link>
                        </>
                    )}
                    {user?.role === "ADMIN" && (
                        <Link href="/admin/users">
                            <div
                                className="my-4 inline-block rounded-lg bg-gray-200 p-3 text-black hover:bg-gray-400"
                                title="User Management"
                            >
                                <GrUserManager size={20} />
                            </div>
                        </Link>
                    )}
                    {!user && (
                        <Link href="/login">
                            <div
                                className="my-4 inline-block rounded-lg bg-gray-200 p-3 text-black hover:bg-gray-400"
                                title="Login"
                            >
                                <GrLogin size={20} />
                            </div>
                        </Link>
                    )}
                    {user && (
                        <Link href="/logout">
                            <div
                                className="my-4 inline-block rounded-lg bg-gray-200 p-3 text-black hover:bg-gray-400"
                                title="Logout"
                            >
                                <GrLogout size={20} />
                            </div>
                        </Link>
                    )}
                    <ModeToggle />
                </div>
            </div>
            <main className="w-full overflow-auto">{children}</main>
        </div>
    );
};

export default Sidebar;
