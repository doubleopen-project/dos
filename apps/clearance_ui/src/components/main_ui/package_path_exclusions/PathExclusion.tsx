// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import DeletePathExclusion from "@/components/delete_item/DeletePathExclusion";
import EditButton from "@/components/edit_item/EditButton";

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusionsByPurl"
>["pathExclusions"][0];

type Props = {
    pathExclusion: PathExclusion;
    userName: string;
    userRole: string;
};

const PathExclusion = ({ pathExclusion, userName, userRole }: Props) => {
    return (
        <div className="bg-muted m-2 flex items-stretch justify-between rounded-lg border p-2">
            <div
                key={pathExclusion.id}
                className="flex-1 items-start text-left"
            >
                <div className="flex w-full flex-col gap-1 pr-2 text-sm">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold">
                            {
                                new Date(pathExclusion.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                            }
                        </span>
                        <span className="rounded-sm bg-orange-400 p-1 font-semibold">
                            {pathExclusion.user.username}
                        </span>
                    </div>
                    <div className="mb-1 rounded-sm p-1 font-semibold">
                        {pathExclusion.pattern}
                    </div>
                    <span className="text-smaller">
                        <span className="mr-1">Reason:</span>
                        <span>{pathExclusion.reason}</span>
                    </span>
                    <span className="text-smaller italic">
                        {pathExclusion.comment}
                    </span>
                </div>
            </div>
            <div key={`edit-${pathExclusion.id}`} className="flex border">
                {(userName === pathExclusion.user.username ||
                    userRole === "ADMIN") && (
                    <div className="flex flex-row align-middle">
                        <EditButton
                            name="edit"
                            className="mr-1 px-2"
                            onClick={() => {}}
                        />
                        <DeletePathExclusion data={pathExclusion} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PathExclusion;
