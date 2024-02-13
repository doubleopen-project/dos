// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { Check, X } from "lucide-react";
import { userAPI } from "validation-helpers";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusionsByPurl"
>["pathExclusions"][0];

type Props = {
    pathExclusion: PathExclusion;
    editHandler: (id: number) => void;
};

const PathExclusion = ({ pathExclusion, editHandler }: Props) => {
    return (
        <div className="bg-muted m-2 flex items-stretch justify-between rounded-lg border p-2">
            <div className="mr-1 flex-1 items-start text-left">
                <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">
                            {
                                new Date(pathExclusion.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                            }
                        </span>
                        <span className="rounded-sm bg-orange-400 p-1 text-xs font-semibold">
                            {pathExclusion.user.username}
                        </span>
                    </div>
                    <div className="text-xs">
                        <span className="mr-1 font-semibold">
                            Glob pattern:
                        </span>
                        <span className="rounded-sm bg-slate-200 dark:bg-slate-600">
                            {pathExclusion.pattern}
                        </span>
                    </div>
                    <div className="text-xs">
                        <span className="mr-1 font-semibold">Reason:</span>
                        <span>{pathExclusion.reason}</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                        <span className="mr-1 font-semibold">Comment:</span>
                        <span className="italic">{pathExclusion.comment}</span>
                    </div>
                </div>
            </div>
            <div className="flex pl-1">
                <div className="flex items-center">
                    <Separator orientation="vertical" className="w-[2px]" />
                    <Button variant="outline" className="ml-2 mr-1 px-2">
                        <Check size={16} className="text-green-400" />
                    </Button>
                    <Button
                        variant="outline"
                        className="px-2"
                        onClick={() => editHandler(-1)}
                    >
                        <X size={16} className="text-[#ff3366]" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PathExclusion;
