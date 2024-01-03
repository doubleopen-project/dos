// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { ModeToggle } from "@/components/ModeToggle";
import logo from "@/public/icons/Double_Open_logo.png";
import UserMenuItem from "./UserMenuItem";

const Navbar = () => {
    const user = useUser();
    return (
        <div className="overflow-none flex flex-row items-center justify-between border-b-[1px] py-1">
            <div className="flex items-center justify-start">
                <Link href="/" className="px-4">
                    <div
                        className="inline-block rounded-lg text-white"
                        title="Home"
                    >
                        <Image src={logo} alt="DoubleOpen Logo" width="160" />
                    </div>
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
                <ModeToggle />
            </div>
        </div>
    );
};

export default Navbar;
