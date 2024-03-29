// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DeleteLicenseConclusion from "@/components/common/delete_item/DeleteLicenseConclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import PurlDetails from "@/components/common/PurlDetails";
import AffectedPath from "@/components/main_ui/package_license_conclusions/AffectedPath";

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
                            {licenseConclusion.user.username}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
                            Concluded:
                        </div>
                        <div className="rounded-sm bg-green-400 dark:text-black">
                            {licenseConclusion.concludedLicenseExpressionSPDX}
                        </div>
                    </div>
                    <div className="flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
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
                        {licenseConclusion.affectedPaths.inQueryPurl.map(
                            (p, index) => (
                                <AffectedPath
                                    key={index}
                                    purl={purl}
                                    path={p.path}
                                />
                            ),
                        )}
                    </div>
                    <div className="text-muted-foreground flex text-xs">
                        <div className="mr-2 flex whitespace-nowrap font-semibold">
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
                {(user?.username === licenseConclusion.user.username ||
                    user?.role === "ADMIN") && (
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
