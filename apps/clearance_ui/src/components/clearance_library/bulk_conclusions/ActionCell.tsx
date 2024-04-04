// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { Check, X } from "lucide-react";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import DeleteBulkConclusion from "@/components/common/delete_item/DeleteBulkConclusion";
import EditButton from "@/components/common/edit_item/EditButton";

type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusions"
>["bulkConclusions"][number];

const ActionCell = ({ row, table }: CellContext<BulkConclusion, unknown>) => {
    // Get user role, to decide what rights the user has for this view
    const user = useUser();

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
        console.log("save");
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
                <Check size={16} className="text-green-400" />
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
                        <EditButton
                            onClick={handleEdit}
                            name="edit"
                            className="mr-1 px-2"
                        />
                        <DeleteBulkConclusion id={row.original.id} />
                    </div>
                )}
        </>
    );
};

export default ActionCell;
