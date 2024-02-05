// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const ClearanceToolbar = () => {
    const router = useRouter();
    const purl = router.query.purl as string;
    console.log(purl);
    return (
        <div>
            <Link
                href={`/packages/${encodeURIComponent(purl)}`}
                className={cn(
                    router.pathname === "/packages/[purl]" ? "underline" : "",
                    "inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                Inspect
            </Link>
            <Link
                href={`/packages/${encodeURIComponent(
                    purl,
                )}/license_conclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/license_conclusions"
                        ? "underline"
                        : "",
                    "inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                License
            </Link>
            <Link
                href={`/packages/${encodeURIComponent(purl)}/bulk_conclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/bulk_conclusions"
                        ? "underline"
                        : "",
                    "inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                Bulk
            </Link>
            <Link
                href={`/packages/${encodeURIComponent(purl)}/path_exclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/path_exclusions"
                        ? "underline"
                        : "",
                    "inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900",
                )}
            >
                Path
            </Link>
        </div>
    );
};

export default ClearanceToolbar;
