// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { Check, X } from "lucide-react";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import DeletePathExclusion from "@/components/common/delete_item/DeletePathExclusion";
import EditButton from "@/components/common/edit_item/EditButton";

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusions"
>["pathExclusions"][0];

const ActionCell = ({ row, table }: CellContext<PathExclusion, unknown>) => {
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

    const handleSave = () => {};

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
                        <DeletePathExclusion data={row.original} />
                    </div>
                )}
        </>
    );
};

export default ActionCell;
