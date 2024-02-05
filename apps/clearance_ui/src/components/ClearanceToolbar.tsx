// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuFileStack, LuFolderTree } from "react-icons/lu";
import { TbFoldersOff } from "react-icons/tb";
import { TfiPencil } from "react-icons/tfi";
import { cn } from "@/lib/utils";

const ClearanceToolbar = () => {
    const router = useRouter();
    const purl = router.query.purl as string;
    console.log(purl);
    return (
        <div className="pl-2 pt-1">
            <Link
                href={`/packages/${encodeURIComponent(purl)}`}
                className={cn(
                    router.pathname === "/packages/[purl]" ||
                        router.pathname.includes("/tree/")
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "inline-block rounded-sm px-2 py-1 text-xs hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                <div className="flex items-center">
                    <LuFolderTree className="mr-1" />
                    Inspect
                </div>
            </Link>
            <Link
                href={`/packages/${encodeURIComponent(
                    purl,
                )}/license_conclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/license_conclusions"
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "inline-block rounded-sm px-2 py-1 text-xs hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                <div className="flex items-center">
                    <TfiPencil className="mr-1" />
                    License Conclusions
                </div>
            </Link>
            <Link
                href={`/packages/${encodeURIComponent(purl)}/bulk_conclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/bulk_conclusions"
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "inline-block rounded-sm px-2 py-1 text-xs hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                <div className="flex items-center">
                    <LuFileStack className="mr-1" />
                    Bulk Conclusions
                </div>
            </Link>
            <Link
                href={`/packages/${encodeURIComponent(purl)}/path_exclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/path_exclusions"
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "inline-block rounded-sm px-2 py-1 text-xs hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                <div className="flex items-center">
                    <TbFoldersOff className="mr-1" />
                    Path Exclusions
                </div>
            </Link>
        </div>
    );
};

export default ClearanceToolbar;
