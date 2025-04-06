// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import PathExclusion from "@/components/main_ui/package_path_exclusions/PathExclusion";
import PathExclusionEditForm from "@/components/main_ui/package_path_exclusions/PathExclusionEditForm";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type Props = {
    purl: string;
};

const PathExclusionWrapper = ({ purl }: Props) => {
    const pathPurl = toPathPurl(purl);
    const { data, isLoading, error } = userHooks.useGetPathExclusionsByPurl(
        {
            params: { purl: pathPurl },
        },
        { enabled: !!pathPurl },
    );
    const [editing, setEditing] = useState(-1);

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
                <div className="flex h-full items-center justify-center font-semibold text-red-500">
                    Error: {getErrorMessage(error)}
                </div>
            )}
            {data &&
                (data.pathExclusions.length > 0 ? (
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
                                    editHandler={editHandler}
                                />
                            ),
                        )}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center border">
                        No path exclusions created for this package
                    </div>
                ))}
        </>
    );
};

export default PathExclusionWrapper;
