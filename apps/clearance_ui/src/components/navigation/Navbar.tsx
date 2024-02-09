// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PackageURL } from "packageurl-js";
import { useUser } from "@/hooks/useUser";
import { Label } from "@/components/ui/label";
import CopyToClipboard from "@/components/CopyToClipboard";
import { ModeToggle } from "@/components/ModeToggle";
import SideMenu from "@/components/navigation/SideMenu";
import UserMenuItem from "@/components/navigation/UserMenuItem";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

const Navbar = () => {
    const router = useRouter();
    const user = useUser();
    const { purl, path } = router.query;
    let mainPurl;

    if (typeof purl === "string") {
        const parsedPurl = parsePurlAndQualifiers(purl);
        mainPurl = new PackageURL(
            parsedPurl.type,
            parsedPurl.namespace,
            parsedPurl.name,
            parsedPurl.version,
            null,
            null,
        ).toString();
    }

    return (
        <div className="overflow-none flex flex-row items-center justify-between border-b-[1px] py-2">
            <div className="flex items-center justify-start">
                <SideMenu />
                <Link href="/" className="pl-2 pr-4">
                    <span className="logo">doubleOpen</span>
                    <span className="logo logo-brackets">()</span>
                </Link>
                {mainPurl && (
                    <div className="flex-row items-center">
                        <Label className="break-all text-xs">{mainPurl}</Label>
                        <CopyToClipboard copyText={mainPurl} />
                    </div>
                )}
                {path && (
                    <>
                        <Label className="pl-1 pr-2 text-lg font-semibold text-[#FF3366]">
                            /
                        </Label>
                        <div className="flex-row items-center">
                            <Label className="break-all text-xs">{path}</Label>
                            <CopyToClipboard copyText={path as string} />
                        </div>
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
