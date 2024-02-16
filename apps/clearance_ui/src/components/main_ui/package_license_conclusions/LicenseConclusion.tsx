// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DeleteLicenseConclusion from "@/components/common/delete_item/DeleteLicenseConclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import AffectedPath from "@/components/main_ui/package_license_conclusions/AffectedPath";

type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

type Props = {
    licenseConclusion: LicenseConclusion;
    userName: string;
    userRole: string;
    editHandler: (id: number) => void;
};

const LicenseConclusion = ({
    licenseConclusion,
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
                        <span className="font-semibold">
                            {
                                new Date(licenseConclusion.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                            }
                        </span>
                        <span className="rounded-sm bg-orange-400 p-1 text-xs font-semibold">
                            {licenseConclusion.user.username}
                        </span>
                    </div>

                    <div className="text-xs">
                        <span className="mr-1 font-semibold">Detected:</span>
                        <span className="break-all">
                            {licenseConclusion.detectedLicenseExpressionSPDX ||
                                "No detected license"}
                        </span>
                    </div>
                    <div className="text-xs">
                        <span className="mr-1 font-semibold">Concluded:</span>
                        <span className="rounded-sm bg-slate-200 dark:bg-slate-600">
                            {licenseConclusion.concludedLicenseExpressionSPDX}
                        </span>
                    </div>
                    <div className="text-xs">
                        <span className="mr-1 font-semibold">
                            Context PURL:
                        </span>
                        <span className="break-all">
                            {licenseConclusion.contextPurl}
                        </span>
                    </div>
                    <div className="text-xs">
                        <div className="mr-1 font-semibold">
                            Affected paths in this package:
                        </div>
                        {licenseConclusion.affectedPaths.inQueryPurl.map(
                            (p, index) => (
                                <AffectedPath key={index} path={p.path} />
                            ),
                        )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        <span className="mr-1 font-semibold">Comment:</span>
                        <span className="italic">
                            {licenseConclusion.comment}
                        </span>
                    </div>
                    {licenseConclusion.local && (
                        <span>
                            <Badge className="bg-red-400 p-0.5 font-bold">
                                LOCAL
                            </Badge>
                        </span>
                    )}
                </div>
            </div>
            <div className="flex pl-1">
                {(userName === licenseConclusion.user.username ||
                    userRole === "ADMIN") && (
                    <div className="flex items-center">
                        <Separator orientation="vertical" className="w-[2px]" />
                        <EditButton
                            name="edit"
                            className="ml-2 mr-1 px-2"
                            onClick={() => editHandler(licenseConclusion.id)}
                        />
                        <DeleteLicenseConclusion data={licenseConclusion} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LicenseConclusion;
