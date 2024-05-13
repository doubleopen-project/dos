// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { ZodiosBodyByAlias, ZodiosResponseByAlias } from "@zodios/core";
import { Check, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DeleteBulkConclusion from "@/components/common/delete_item/DeleteBulkConclusion";
import EditButton from "@/components/common/edit_item/EditButton";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { isValidConcludedExpression } from "@/helpers/isValidConcludedExpression";

type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusions"
>["bulkConclusions"][number];

type BulkConclusionUpdateData = ZodiosBodyByAlias<
    typeof userAPI,
    "PutBulkConclusion"
>;

const ActionCell = ({ row, table }: CellContext<BulkConclusion, unknown>) => {
    // Get user role, to decide what rights the user has for this view
    const user = useUser();
    const session = useSession();
    const bcKey = userHooks.getKeyByAlias("GetBulkConclusions");
    const queryClient = useQueryClient();
    const meta = table.options.meta;

    const { mutate: UpdateBulkConclusion, isLoading } =
        userHooks.usePutBulkConclusion(
            {
                headers: {
                    Authorization: `Bearer ${session.data?.accessToken}`,
                },
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
                            [parseInt(row.id)]: false,
                        };
                    });
                    meta?.updateOriginalData(row.index);
                    queryClient.invalidateQueries(bcKey);
                    toast({
                        title: "Bulk conclusion updated",
                        description: "Bulk conclusion updated successfully",
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
            const body: BulkConclusionUpdateData = {
                pattern: row.getValue("pattern"),
                concludedLicenseExpressionSPDX: row.getValue(
                    "concludedLicenseExpressionSPDX",
                ),
                comment: row.getValue("comment"),
                local: row.getValue("local"),
            };

            UpdateBulkConclusion(body);
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
            <Button
                onClick={handleSave}
                name="save"
                variant="outline"
                className="mr-1 px-2"
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Check size={16} className="text-green-400" />
                )}
            </Button>
            <Button
                onClick={handleCancel}
                name="cancel"
                variant="outline"
                className="mr-1 px-2"
            >
                <X size={16} className="text-[#ff3366]" />
            </Button>
        </div>
    ) : (
        <>
            {user &&
                (user.role === "ADMIN" ||
                    user.username === row.original.user.username) && (
                    <div className="flex items-center">
                        {isLoading ? (
                            <Loader2 size={20} className="mx-2 animate-spin" />
                        ) : (
                            <EditButton
                                onClick={handleEdit}
                                name="edit"
                                className="mr-1 px-2"
                            />
                        )}
                        <DeleteBulkConclusion id={row.original.id} />
                    </div>
                )}
        </>
    );
};

export default ActionCell;
