// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { BsThreeDots } from "react-icons/bs";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ClearanceGroupTooltipIcon from "@/components/common/clearance_groups/ClearanceGroupTooltipIcon";
import DeleteLicenseConclusion from "@/components/common/delete_item/DeleteLicenseConclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import PurlDetails from "@/components/common/PurlDetails";
import { hasPermission } from "@/helpers/hasPermission";
import { stringToColourRGBA } from "@/helpers/stringToColour";
import { cn } from "@/lib/utils";

type License = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusionsForFileInPackage"
>["licenseConclusions"][0];

type LicenseConclusionItemProps = {
    license: License;
    onEditItem: (id: number, contextPurl: string) => void;
};

const LicenseConclusionItem = ({
    license,
    onEditItem,
}: LicenseConclusionItemProps) => {
    const user = useUser();
    const [showContent, setShowContent] = useState(false);
    const [divWidth, setDivWidth] = useState(0);

    const licenseCreator = license.curator.username;
    const licenseCreatorColor = stringToColourRGBA(
        licenseCreator + "green",
        0.5,
    );

    useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            setDivWidth(event[0].contentBoxSize[0].inlineSize);
        });
        const contentDiv = document.getElementById("container");
        if (contentDiv) resizeObserver.observe(contentDiv);
    });

    return (
        <div id="container">
            <div
                className={cn(
                    divWidth < 200 ? "flex-col" : undefined,
                    "mb-1 flex justify-between",
                )}
            >
                <div
                    className={cn(
                        divWidth < 200 ? "flex-col" : undefined,
                        "flex",
                    )}
                >
                    <div className="flex gap-1">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Avatar className="inline-block h-5 w-5">
                                        <AvatarFallback
                                            className="h-5 w-5 bg-gray-100 text-[.625rem]"
                                            style={{
                                                backgroundColor:
                                                    licenseCreatorColor,
                                            }}
                                        >
                                            {license.curator.username
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {license.curator.username}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {license.clearanceGroups.map((cg) => (
                            <ClearanceGroupTooltipIcon
                                key={cg.clearanceGroup.id}
                                clearanceGroup={cg.clearanceGroup}
                            />
                        ))}
                        <span className="mt-0.5 h-5 font-bold text-gray-700">
                            {
                                new Date(license.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                            }
                            {": "}
                        </span>
                    </div>
                    <span className="mt-0.5 ml-1">
                        {license.concludedLicenseExpressionSPDX}{" "}
                    </span>
                </div>
                <Button
                    aria-label="license conclusion details"
                    variant={"outline"}
                    className={cn(
                        divWidth < 200 ? "mt-1" : undefined,
                        "ml-1 h-5 w-6 px-1",
                    )}
                    onClick={() => setShowContent(!showContent)}
                >
                    <BsThreeDots />
                </Button>
            </div>
            <div
                className={cn(
                    showContent
                        ? "mt-2 mb-4 ml-4 flex h-max scale-y-100 flex-col items-start"
                        : "h-0 scale-y-0",
                    "overflow-auto transition-all duration-300 ease-in-out",
                )}
            >
                <div>
                    <div className="mb-2">
                        {license.comment && (
                            <>
                                <span className="mr-1 font-bold text-gray-600">
                                    Comment:
                                </span>
                                <span className="italic">
                                    {license.comment}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="mb-1 text-xs">
                        <span className="mr-1 font-bold text-gray-600">
                            Context PURL:
                        </span>
                        <span className="">
                            <PurlDetails
                                purl={license.contextPurl}
                                hideBorder={true}
                                hideCopyToClipboard={true}
                            />
                        </span>
                    </div>
                    <span>
                        {license.bulkConclusionId && (
                            <Badge className="bg-blue-400 px-1 font-bold text-black hover:bg-blue-400">
                                BULK
                            </Badge>
                        )}
                        {license.local && (
                            <Badge
                                className={cn(
                                    license.bulkConclusionId
                                        ? "ml-1"
                                        : undefined,
                                    "bg-red-400 px-1 font-bold text-black hover:bg-red-400",
                                )}
                            >
                                LOCAL
                            </Badge>
                        )}
                    </span>
                </div>
                <div>
                    {(user?.username === license.curator.username ||
                        user?.role === "app-admin") && (
                        <div className="mt-2 flex">
                            {license.bulkConclusionId && (
                                <EditButton
                                    name="edit-bulk"
                                    className="mr-1 h-9 w-8 px-2"
                                    onClick={() => {
                                        if (license.bulkConclusionId)
                                            onEditItem(
                                                license.bulkConclusionId,
                                                license.contextPurl,
                                            );
                                    }}
                                    disabled={
                                        user.permissions === null ||
                                        !hasPermission(
                                            user.permissions,
                                            "ClearanceItems",
                                            "PUT",
                                        )
                                    }
                                    disabledTooltipMsg="Not permitted"
                                    tooltipAlign="start"
                                />
                            )}
                            {!license.bulkConclusionId && (
                                <EditButton
                                    name="edit"
                                    className="mr-1 hidden h-9 w-8 px-2"
                                    onClick={() =>
                                        console.log("Edit license conclusion")
                                    }
                                    disabled={
                                        user.permissions === null ||
                                        !hasPermission(
                                            user.permissions,
                                            "ClearanceItems",
                                            "PUT",
                                        )
                                    }
                                    disabledTooltipMsg="Not permitted."
                                    tooltipAlign="start"
                                />
                            )}
                            <DeleteLicenseConclusion
                                data={license}
                                className="h-9 w-8 px-2"
                                variant="destructive"
                                disabled={
                                    user.permissions === null ||
                                    !hasPermission(
                                        user.permissions,
                                        "ClearanceItems",
                                        "DELETE",
                                    )
                                }
                                disabledTooltipMsg="Not permitted"
                                tooltipAlign="start"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LicenseConclusionItem;
