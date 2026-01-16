// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { Separator } from "@/components/ui/separator";
import ClearanceGroupBadge from "@/components/common/clearance_groups/ClearanceGroupBadge";
import DeletePathExclusion from "@/components/common/delete_item/DeletePathExclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import PEAffectedFilesTooltip from "@/components/common/PEAffectedFilesTooltip";
import { hasPermission } from "@/helpers/hasPermission";

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusionsByPurl"
>["pathExclusions"][0];

type Props = {
    pathExclusion: PathExclusion;
    editHandler: (id: number) => void;
};

const PathExclusion = ({ pathExclusion, editHandler }: Props) => {
    const user = useUser();
    return (
        <div
            className="hover:bg-muted m-2 flex items-stretch justify-between rounded-lg border p-2"
            data-testid="path-exclusion"
        >
            <div className="mr-1 flex-1 items-start text-left">
                <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                        <div className="font-semibold">
                            {
                                new Date(pathExclusion.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                            }
                        </div>
                        <div className="rounded-sm bg-orange-400 p-1 text-xs font-semibold">
                            {pathExclusion.curator.username}
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex text-xs">
                            <div className="mr-2 flex font-semibold whitespace-nowrap">
                                Glob pattern:
                            </div>
                            <div className="rounded-sm bg-slate-200 dark:bg-slate-600">
                                {pathExclusion.pattern}
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            {pathExclusion.clearanceGroups.map((cg) => (
                                <ClearanceGroupBadge
                                    key={cg.clearanceGroup.id}
                                    clearanceGroup={cg.clearanceGroup}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Reason:
                        </div>
                        <div>{pathExclusion.reason}</div>
                    </div>
                    <div className="text-muted-foreground flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Comment:
                        </div>
                        <div className="italic">{pathExclusion.comment}</div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Files affected by this path exclusion:
                        </div>
                        <div>
                            <PEAffectedFilesTooltip
                                pathExclusionId={pathExclusion.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex pl-1">
                {(user?.username === pathExclusion.curator.username ||
                    user?.role === "app-admin") && (
                    <div className="flex items-center">
                        <Separator orientation="vertical" className="w-[2px]" />
                        <EditButton
                            name="edit"
                            className="mr-1 ml-2 px-2"
                            onClick={() => editHandler(pathExclusion.id)}
                            disabled={
                                user.permissions === null ||
                                !hasPermission(
                                    user.permissions,
                                    "ClearanceItems",
                                    "PUT",
                                )
                            }
                            disabledTooltipMsg="You do not currently have permission to edit clearance items."
                        />
                        <DeletePathExclusion
                            data={pathExclusion}
                            disabled={
                                user.permissions === null ||
                                !hasPermission(
                                    user.permissions,
                                    "ClearanceItems",
                                    "DELETE",
                                )
                            }
                            disabledTooltipMsg="You do not currently have permission to delete clearance items."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PathExclusion;
