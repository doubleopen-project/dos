// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import PathExclusion from "@/components/main_ui/package_path_exclusions/PathExclusion";
import PathExclusionEditForm from "@/components/main_ui/package_path_exclusions/PathExclusionEditForm";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type Props = {
    purl: string;
};

const PathExclusionWrapper = ({ purl }: Props) => {
    const pathPurl = toPathPurl(purl);
    const { data, isLoading, error } = userHooks.useGetPathExclusionsByPurl(
        { withCredentials: true, params: { purl: pathPurl } },
        { enabled: !!pathPurl },
    );
    const [editing, setEditing] = useState(-1);

    // Get user from useUser hook, to decide what DB rights the user has for curations
    let user = undefined;
    user = useUser();
    const userName = user ? user.username : "Guest";
    const userRole = user ? user.role : "";

    const editHandler = (id: number) => {
        setEditing(id);
    };

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
                    {data.pathExclusions.map((pe) =>
                        pe.id === editing ? (
                            <PathExclusionEditForm
                                key={`edit-pe-${pe.id}`}
                                pathExclusion={pe}
                                editHandler={editHandler}
                            />
                        ) : (
                            <PathExclusion
                                key={`pe-${pe.id}`}
                                pathExclusion={pe}
                                userName={userName}
                                userRole={userRole}
                                editHandler={editHandler}
                            />
                        ),
                    )}
                </div>
            )}
        </>
    );
};

export default PathExclusionWrapper;
