// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { ModeToggle } from "@/components/ModeToggle";
import PurlDetails from "@/components/PurlDetails";
import SideMenu from "./SideMenu";
import UserMenuItem from "./UserMenuItem";

const Navbar = () => {
    const router = useRouter();
    const user = useUser();

    const { purl, path } = router.query;

    useEffect(() => {
        console.log("purl=", purl, "path=", path);
    }, [purl, path]);

    return (
        <div className="overflow-none flex flex-row items-center justify-between border-b-[1px] py-2">
            <div className="flex items-center justify-start">
                <SideMenu />
                <Link href="/" className="pl-2 pr-4">
                    <span className="logo">doubleOpen</span>
                    <span className="logo logo-brackets">()</span>
                </Link>
            </div>
            {/* Insert package and file path here */}
            {purl && <PurlDetails purl={purl as string} />}
            <div>
                <UserMenuItem user={user} className="mr-1" />
                <ModeToggle className="mr-1" />
            </div>
        </div>
    );
};

export default Navbar;
