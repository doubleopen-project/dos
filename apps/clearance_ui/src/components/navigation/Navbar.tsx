// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { IoMenuSharp } from "react-icons/io5";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import UserMenuItem from "./UserMenuItem";

const Navbar = () => {
    const user = useUser();
    return (
        <div className="overflow-none flex flex-row items-center justify-between border-b-[1px] py-2">
            <div className="flex items-center justify-start">
                <Button variant="outline" size="sm" className="ml-2">
                    <IoMenuSharp size="20px" color="gray" />
                </Button>
                <Link href="/" className="pl-2 pr-4">
                    <span className="logo">doubleOpen</span>
                    <span className="logo logo-brackets">()</span>
                </Link>
                {user && (
                    <>
                        <Link
                            href="/packages"
                            className="inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900"
                        >
                            Package Library
                        </Link>
                        <Link
                            href="/clearances"
                            className="inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900"
                        >
                            Clearance Library
                        </Link>
                    </>
                )}
            </div>
            <div>
                <UserMenuItem user={user} className="mr-1" />
                <ModeToggle className="mr-1" />
            </div>
        </div>
    );
};

export default Navbar;
