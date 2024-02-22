// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoInfo } from "react-icons/go";
import { LuFileStack, LuFolderTree } from "react-icons/lu";
import { TbFoldersOff } from "react-icons/tb";
import { TfiPencil } from "react-icons/tfi";
import { useShallow } from "zustand/react/shallow";
import { userHooks } from "@/hooks/zodiosHooks";
import useMainUiStore from "@/store/mainui.store";
import { Badge } from "@/components/ui/badge";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { cn } from "@/lib/utils";

const ClearanceToolbar = () => {
    const router = useRouter();
    const [purl, path] = useMainUiStore(
        useShallow((state) => [state.purl, state.path]),
    );

    // Get the counts of different clearance items for this package, to show in the toolbar
    const { data: licenseConclusionCount } =
        userHooks.useGetLicenseConclusionsCount(
            {
                withCredentials: true,
                queries: { purl: purl, hasBulkConclusionId: false },
            },
            { enabled: !!purl },
        );
    const { data: bulkConclusionCount } =
        userHooks.useGetBulkConclusionsCountByPurl(
            { withCredentials: true, params: { purl: toPathPurl(purl) } },
            { enabled: !!purl },
        );
    const { data: pathExclusionCount } = userHooks.useGetPathExclusionsCount(
        { withCredentials: true, queries: { purl: purl, purlStrict: true } },
        { enabled: !!purl },
    );

    return (
        <div className="pl-2 pt-1">
            {/* Inspect package and its tree */}
            <Link
                href={`/packages/${encodeURIComponent(purl)}${
                    path ? `/tree/${encodeURIComponent(path)}` : ""
                }`}
                className={cn(
                    router.pathname === "/packages/[purl]" ||
                        router.pathname.includes("/tree/")
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "hover:bg-muted inline-block rounded-sm px-2 py-1 text-xs",
                )}
            >
                <div className="flex items-center">
                    <LuFolderTree className="mr-1" />
                    Inspect
                </div>
            </Link>

            {/* Package details */}
            <Link
                href={`/packages/${encodeURIComponent(purl)}/details`}
                className={cn(
                    router.pathname === "/packages/[purl]/details"
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "hover:bg-muted inline-block rounded-sm px-2 py-1 text-xs",
                )}
            >
                <div className="flex items-center">
                    <GoInfo className="mr-1" />
                    Package Info
                </div>
            </Link>

            {/* License conclusions */}
            <Link
                href={`/packages/${encodeURIComponent(
                    purl,
                )}/license_conclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/license_conclusions"
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "hover:bg-muted inline-block rounded-sm px-2 py-1 text-xs",
                )}
            >
                <div className="flex items-center">
                    <TfiPencil className="mr-1" />
                    <span>License Conclusions</span>
                    {licenseConclusionCount &&
                        licenseConclusionCount.count > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-1 text-xs font-semibold"
                            >
                                {licenseConclusionCount.count}
                            </Badge>
                        )}
                </div>
            </Link>

            {/* Bulk conclusions */}
            <Link
                href={`/packages/${encodeURIComponent(purl)}/bulk_conclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/bulk_conclusions"
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "hover:bg-muted inline-block rounded-sm px-2 py-1 text-xs",
                )}
            >
                <div className="flex items-center">
                    <LuFileStack className="mr-1" />
                    <span>Bulk Conclusions</span>
                    {bulkConclusionCount && bulkConclusionCount.count > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-1 text-xs font-semibold"
                        >
                            {bulkConclusionCount.count}
                        </Badge>
                    )}
                </div>
            </Link>

            {/* Path exclusions */}
            <Link
                href={`/packages/${encodeURIComponent(purl)}/path_exclusions`}
                className={cn(
                    router.pathname === "/packages/[purl]/path_exclusions"
                        ? "border-b-4 border-[#ff3366] font-semibold"
                        : "",
                    "hover:bg-muted inline-block rounded-sm px-2 py-1 text-xs",
                )}
            >
                <div className="flex items-center">
                    <TbFoldersOff className="mr-1" />
                    <span>Path Exclusions</span>
                    {pathExclusionCount && pathExclusionCount.count > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-1 text-xs font-semibold"
                        >
                            {pathExclusionCount.count}
                        </Badge>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ClearanceToolbar;
