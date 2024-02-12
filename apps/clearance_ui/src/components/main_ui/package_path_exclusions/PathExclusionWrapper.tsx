// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import DeletePathExclusion from "@/components/delete_item/DeletePathExclusion";
import EditButton from "@/components/edit_item/EditButton";
import PathExclusion from "@/components/main_ui/package_path_exclusions/PathExclusion";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type Props = {
    purl: string;
};

const PackagePathExclusions = ({ purl }: Props) => {
    const pathPurl = toPathPurl(purl);
    const { data, isLoading, error } = userHooks.useGetPathExclusionsByPurl(
        { withCredentials: true, params: { purl: pathPurl } },
        { enabled: !!pathPurl },
    );

    // Get user from useUser hook, to decide what DB rights the user has for curations
    let user = undefined;
    user = useUser();
    const userName = user ? user.username : "Guest";
    const userRole = user ? user.role : "";

    return (
        <>
            {isLoading && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
            {error && (
                <div className="flex h-full items-center justify-center">
                    <div>Error: {error.message}</div>
                </div>
            )}
            {data && (
                <div className="w-full flex-1 overflow-y-auto border">
                    {data.pathExclusions.map((pe) => (
                        <PathExclusion
                            pathExclusion={pe}
                            userName={userName}
                            userRole={userRole}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default PackagePathExclusions;
