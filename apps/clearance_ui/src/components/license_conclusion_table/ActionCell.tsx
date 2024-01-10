// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { parseSPDX } from "common-helpers";
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
import DeleteLicenseConclusion from "@/components/delete_item/DeleteLicenseConclusion";
import EditLCButton from "@/components/edit_item/EditLCButton";

type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

const isValidConcludedExpression = (expression: string) => {
    try {
        parseSPDX(expression);
        return true;
    } catch (error) {
        return false;
    }
};

const ActionCell = ({
    row,
    table,
}: CellContext<LicenseConclusion, unknown>) => {
    const user = useUser();
    const lcKey = userHooks.getKeyByAlias("GetLicenseConclusions");
    const queryClient = useQueryClient();
    const { mutate: UpdateLicenseConclusion, isLoading } =
        userHooks.usePutLicenseConclusion(
            {
                withCredentials: true,
                params: {
                    id: row.original.id,
                },
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(lcKey);
                    toast({
                        title: "License conclusion updated",
                        description: "License conclusion updated successfully",
                    });
                },
                onError: (error) => {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.message,
                    });
                },
            },
        );

    const meta = table.options.meta;

    const setEditedRows = (e: React.MouseEvent<HTMLButtonElement>) => {
        const elName = e.currentTarget.name;
        if (e.currentTarget.name !== "save") {
            meta?.setEditedRows(() => {
                const old = meta.editedRows;
                return {
                    ...old,
                    [parseInt(row.id)]: !old[parseInt(row.id)],
                };
            });
        }

        if (elName !== "edit") {
            meta?.revertData(row.index, e.currentTarget.name === "cancel");
            if (e.currentTarget.name === "save") {
                if (
                    isValidConcludedExpression(
                        row.getValue("concludedLicenseExpressionSPDX"),
                    )
                ) {
                    meta?.setEditedRows(() => {
                        const old = meta.editedRows;
                        return {
                            ...old,
                            [parseInt(row.id)]: !old[parseInt(row.id)],
                        };
                    });
                    UpdateLicenseConclusion({
                        concludedLicenseExpressionSPDX: row.getValue(
                            "concludedLicenseExpressionSPDX",
                        ),
                        comment: row.getValue("comment"),
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Invalid concluded license expression",
                    });
                }
            }
        }
    };

    return meta?.editedRows[parseInt(row.id)] ? (
        <div className="flex">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={setEditedRows}
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
                            onClick={setEditedRows}
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
            {user &&
                (user.username === row.original.user.username ||
                    user.role === "ADMIN") && (
                    <div className="flex items-center">
                        {isLoading ? (
                            <Loader2 size={20} className="mx-2 animate-spin" />
                        ) : (
                            <EditLCButton onClick={setEditedRows} name="edit" />
                        )}
                        <DeleteLicenseConclusion data={row.original} />
                    </div>
                )}
        </>
    );
};

export default ActionCell;
