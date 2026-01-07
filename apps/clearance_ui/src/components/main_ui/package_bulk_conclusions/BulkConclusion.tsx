// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BCAffectedFilesTooltip from "@/components/common/BCAffectedFilesTooltip";
import ClearanceGroupBadge from "@/components/common/clearance_groups/ClearanceGroupBadge";
import DeleteBulkConclusion from "@/components/common/delete_item/DeleteBulkConclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import PurlDetails from "@/components/common/PurlDetails";
import { hasPermission } from "@/helpers/hasPermission";

type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusionsByPurl"
>["bulkConclusions"][0];

type Props = {
    purl?: string;
    bulkConclusion: BulkConclusion;
    editHandler: (id: number) => void;
};

const BulkConclusion = ({ purl, bulkConclusion, editHandler }: Props) => {
    const user = useUser();
    return (
        <div
            className="hover:bg-muted m-2 ml-12 flex items-stretch justify-between rounded-lg border p-2"
            data-testid="bulk-conclusion"
        >
            <div className="mr-1 flex-1 items-start text-left">
                <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                        <div className="font-semibold">
                            {
                                new Date(bulkConclusion.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                            }
                        </div>
                        <div className="rounded-sm bg-orange-400 p-1 text-xs font-semibold">
                            {bulkConclusion.curator.username}
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex text-xs">
                            <div className="mr-2 flex font-semibold whitespace-nowrap">
                                Concluded:
                            </div>
                            <div className="rounded-sm bg-green-400 dark:text-black">
                                {bulkConclusion.concludedLicenseExpressionSPDX}
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            {bulkConclusion.clearanceGroups.map((cg) => (
                                <ClearanceGroupBadge
                                    key={cg.clearanceGroup.id}
                                    clearanceGroup={cg.clearanceGroup}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Pattern:
                        </div>
                        <div className="break-all">
                            {bulkConclusion.pattern}
                        </div>
                    </div>
                    <div className="text-xs">
                        <div className="mr-2 font-semibold">Context purl:</div>
                        <div className="ml-9">
                            <PurlDetails
                                purl={bulkConclusion.package.purl}
                                hideBorder={true}
                                hideCopyToClipboard={true}
                            />
                        </div>
                    </div>
                    <div className="text-muted-foreground flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Comment:
                        </div>
                        <div className="italic">{bulkConclusion.comment}</div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Files affected in this package:
                        </div>
                        <div>
                            {bulkConclusion.package.purl === purl ? (
                                <BCAffectedFilesTooltip
                                    bulkConclusionId={bulkConclusion.id}
                                    mode="context"
                                    badgeStyle="bg-blue-400 text-xs"
                                />
                            ) : (
                                <BCAffectedFilesTooltip
                                    bulkConclusionId={bulkConclusion.id}
                                    mode="query"
                                    queryPurl={purl}
                                    badgeStyle="bg-orange-400 text-xs"
                                />
                            )}
                        </div>
                    </div>
                    {bulkConclusion.local && (
                        <div>
                            <Badge className="bg-red-400 p-0.5 font-bold">
                                LOCAL
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex pl-1">
                {(user?.username === bulkConclusion.curator.username ||
                    user?.role === "app-admin") && (
                    <div className="flex items-center">
                        <Separator orientation="vertical" className="w-[2px]" />
                        <EditButton
                            name="edit"
                            className="mr-1 ml-2 px-2"
                            onClick={() => editHandler(bulkConclusion.id)}
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
                        <DeleteBulkConclusion
                            id={bulkConclusion.id}
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

export default BulkConclusion;
