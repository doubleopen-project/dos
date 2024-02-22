// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BCAffectedFilesTooltip from "@/components/common/BCAffectedFilesTooltip";
import DeleteBulkConclusion from "@/components/common/delete_item/DeleteBulkConclusion";
import EditButton from "@/components/common/edit_item/EditButton";

type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusionsByPurl"
>["bulkConclusions"][0];

type Props = {
    bulkConclusion: BulkConclusion;
    userName: string;
    userRole: string;
    editHandler: (id: number) => void;
};

const BulkConclusion = ({
    bulkConclusion,
    userName,
    userRole,
    editHandler,
}: Props) => {
    return (
        <div
            className="hover:bg-muted m-2 flex items-stretch justify-between rounded-lg border p-2"
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
                            {bulkConclusion.user.username}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
                            Concluded:
                        </div>
                        <div className="rounded-sm bg-green-400 dark:text-black">
                            {bulkConclusion.concludedLicenseExpressionSPDX}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
                            Pattern:
                        </div>
                        <div className="break-all">
                            {bulkConclusion.pattern}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
                            Context purl:
                        </div>
                        <div className="break-all">
                            {bulkConclusion.package.purl}
                        </div>
                    </div>
                    <div className="text-muted-foreground flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
                            Comment:
                        </div>
                        <div className="italic">{bulkConclusion.comment}</div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
                            Files affected in this package:
                        </div>
                        <div>
                            <BCAffectedFilesTooltip
                                bulkConclusionId={bulkConclusion.id}
                                mode="context"
                                badgeStyle="bg-blue-400 text-xs"
                            />
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
                {(userName === bulkConclusion.user.username ||
                    userRole === "ADMIN") && (
                    <div className="flex items-center">
                        <Separator orientation="vertical" className="w-[2px]" />
                        <EditButton
                            name="edit"
                            className="ml-2 mr-1 px-2"
                            onClick={() => editHandler(bulkConclusion.id)}
                        />
                        <DeleteBulkConclusion id={bulkConclusion.id} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkConclusion;
