// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Fira_Code } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { PackageURL } from "packageurl-js";
import { useUser } from "@/hooks/useUser";
import { Label } from "@/components/ui/label";
import ClearanceGroupSelector from "@/components/common/clearance_groups/ClearanceGroupSelector";
import CopyToClipboard from "@/components/common/CopyToClipboard";
import { ModeToggle } from "@/components/common/ModeToggle";
import SideMenu from "@/components/navigation/SideMenu";
import UserMenuItem from "@/components/navigation/UserMenuItem";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";
import { cn } from "@/lib/utils";

const fira_code = Fira_Code({
    weight: "500",
    subsets: ["latin"],
    display: "swap",
});

const Navbar = () => {
    const user = useUser();
    const router = useRouter();
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
                <Link href="/" className="pr-4 pl-2">
                    <span
                        className={cn(
                            fira_code.className,
                            "text-xl font-bold text-black dark:text-white",
                        )}
                    >
                        doubleOpen
                    </span>
                    <span
                        className={cn(
                            fira_code.className,
                            "text-xl font-bold text-[#ff3366]",
                        )}
                    >
                        ()
                    </span>
                </Link>
                {user && mainPurl && (
                    <div className="flex-row items-center">
                        <Label className="text-xs break-all">{mainPurl}</Label>
                        <CopyToClipboard copyText={mainPurl} />
                    </div>
                )}
                {user && path && (
                    <>
                        <Label className="pr-2 pl-1 text-lg font-semibold text-[#FF3366]">
                            /
                        </Label>
                        <div className="flex-row items-center">
                            <Label className="text-xs break-all">{path}</Label>
                            <CopyToClipboard copyText={path as string} />
                        </div>
                    </>
                )}
            </div>
            <div className="flex">
                <UserMenuItem className="mr-1" />
                {user && <ClearanceGroupSelector className="mr-1" />}
                <ModeToggle className="mr-1" />
            </div>
        </div>
    );
};

export default Navbar;
