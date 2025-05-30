// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { Check, Loader2, X } from "lucide-react";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import DeleteLicenseConclusion from "@/components/common/delete_item/DeleteLicenseConclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { hasPermission } from "@/helpers/hasPermission";
import { isValidConcludedExpression } from "@/helpers/isValidConcludedExpression";

type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

const ActionCell = ({
    row,
    table,
}: CellContext<LicenseConclusion, unknown>) => {
    // Get user role, to decide what rights the user has for this view
    const user = useUser();
    const lcKey = userHooks.getKeyByAlias("GetLicenseConclusions");
    const queryClient = useQueryClient();
    const { mutate: UpdateLicenseConclusion, isLoading } =
        userHooks.usePutLicenseConclusion(
            {
                params: {
                    id: row.original.id,
                },
            },
            {
                onSuccess: () => {
                    meta?.setSelectedRowsForEditing(() => {
                        const old = meta.selectedRowsForEditing;
                        return {
                            ...old,
                            [parseInt(row.id)]: !old[parseInt(row.id)],
                        };
                    });
                    meta?.updateOriginalData(row.index);
                    queryClient.invalidateQueries(lcKey);
                    toast({
                        title: "License conclusion updated",
                        description: "License conclusion updated successfully",
                    });
                },
                onError: (error) => {
                    const msg = getErrorMessage(error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: msg,
                    });
                },
            },
        );

    const meta = table.options.meta;

    const handleCancel = () => {
        meta?.revertData(row.index);
        meta?.setSelectedRowsForEditing(() => {
            const old = meta.selectedRowsForEditing;
            return {
                ...old,
                [parseInt(row.id)]: false,
            };
        });
    };

    const handleSave = () => {
        const isValidObj = isValidConcludedExpression(
            row.getValue("concludedLicenseExpressionSPDX"),
        );
        if (isValidObj.isValid) {
            UpdateLicenseConclusion({
                concludedLicenseExpressionSPDX: row.getValue(
                    "concludedLicenseExpressionSPDX",
                ),
                comment: row.getValue("comment"),
            });
        } else {
            let description = "Invalid concluded license expression";
            if (isValidObj.errWord !== null) {
                description += ": syntax error in '" + isValidObj.errWord + "'";
            }
            toast({
                variant: "destructive",
                title: "Error",
                description: description,
            });
        }
    };

    const handleEdit = () => {
        meta?.setSelectedRowsForEditing(() => {
            const old = meta.selectedRowsForEditing;
            return {
                ...old,
                [parseInt(row.id)]: true,
            };
        });
    };

    return meta?.selectedRowsForEditing[parseInt(row.id)] ? (
        <div className="flex">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleSave}
                            name="save"
                            variant="outline"
                            className="mr-1 px-2"
                            aria-label="save"
                        >
                            <Check size={16} className="text-green-400" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleCancel}
                            name="cancel"
                            variant="outline"
                            className="mr-1 px-2"
                            aria-label="cancel"
                        >
                            <X size={16} className="text-[#ff3366]" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancel</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    ) : (
        <>
            {(user?.username === row.original.user.username ||
                user?.role === "app-admin") && (
                <div className="flex items-center">
                    {isLoading ? (
                        <Loader2 size={20} className="mx-2 animate-spin" />
                    ) : (
                        <EditButton
                            onClick={handleEdit}
                            name="edit"
                            className="mr-1 px-2"
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
                    )}
                    <DeleteLicenseConclusion
                        data={row.original}
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
        </>
    );
};

export default ActionCell;
