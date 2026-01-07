// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { Loader2 } from "lucide-react";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ClearanceGroupBadge from "@/components/common/clearance_groups/ClearanceGroupBadge";
import DeleteLicenseConclusion from "@/components/common/delete_item/DeleteLicenseConclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import PurlDetails from "@/components/common/PurlDetails";
import AffectedPath from "@/components/main_ui/package_license_conclusions/AffectedPath";
import { hasPermission } from "@/helpers/hasPermission";

type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

type Props = {
    purl: string;
    licenseConclusion: LicenseConclusion;
    editHandler: (id: number) => void;
};

const LicenseConclusion = ({ purl, licenseConclusion, editHandler }: Props) => {
    const user = useUser();
    const { data, isLoading, error } =
        userHooks.useGetAffectedFilesForLicenseConclusion({
            params: {
                id: licenseConclusion.id,
            },
            queries: {
                purl: purl,
            },
        });
    return (
        <div
            className="hover:bg-muted m-2 ml-12 flex items-stretch justify-between rounded-lg border p-2"
            data-testid="license-conclusion"
        >
            <div className="mr-1 flex-1 items-start text-left">
                <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                        <div className="font-semibold">
                            {
                                new Date(licenseConclusion.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                            }
                        </div>
                        <div className="rounded-sm bg-orange-400 p-1 text-xs font-semibold">
                            {licenseConclusion.curator.username}
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex text-xs">
                            <div className="mr-2 flex font-semibold whitespace-nowrap">
                                Concluded:
                            </div>
                            <div className="rounded-sm bg-green-400 dark:text-black">
                                {
                                    licenseConclusion.concludedLicenseExpressionSPDX
                                }
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            {licenseConclusion.clearanceGroups.map((cg) => (
                                <ClearanceGroupBadge
                                    key={cg.clearanceGroup.id}
                                    clearanceGroup={cg.clearanceGroup}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Detected:
                        </div>
                        <div>
                            {licenseConclusion.detectedLicenseExpressionSPDX ||
                                "No detected license"}
                        </div>
                    </div>
                    <div className="text-xs">
                        <div className="mr-2 font-semibold">Context PURL:</div>
                        <div className="ml-9">
                            <PurlDetails
                                purl={licenseConclusion.contextPurl}
                                hideBorder={true}
                                hideCopyToClipboard={true}
                            />
                        </div>
                    </div>
                    <div className="text-xs">
                        <div className="mr-2 font-semibold">
                            Affected paths in this package:
                        </div>
                        {isLoading && (
                            <Loader2 className="ml-10 h-4 w-4 animate-spin" />
                        )}
                        {data &&
                            data.affectedFiles.inQueryPurl.map((p, index) => (
                                <AffectedPath
                                    key={index}
                                    purl={purl}
                                    path={p.path}
                                />
                            ))}
                        {error && (
                            <div className="ml-10 text-red-500">
                                Error: {"Unknown error"}
                            </div>
                        )}
                    </div>
                    <div className="text-muted-foreground flex text-xs">
                        <div className="mr-2 flex font-semibold whitespace-nowrap">
                            Comment:
                        </div>
                        <div className="italic">
                            {licenseConclusion.comment}
                        </div>
                    </div>
                    {licenseConclusion.local && (
                        <div>
                            <Badge className="bg-red-400 p-0.5 font-bold">
                                LOCAL
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex pl-1">
                {(user?.username === licenseConclusion.curator.username ||
                    user?.role === "app-admin") && (
                    <div className="flex items-center">
                        <Separator orientation="vertical" className="w-[2px]" />
                        <EditButton
                            name="edit"
                            className="mr-1 ml-2 px-2"
                            onClick={() => editHandler(licenseConclusion.id)}
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
                        <DeleteLicenseConclusion
                            data={licenseConclusion}
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

export default LicenseConclusion;
