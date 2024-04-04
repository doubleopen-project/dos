// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import DeleteBulkConclusion from "@/components/common/delete_item/DeleteBulkConclusion";
import EditButton from "@/components/common/edit_item/EditButton";

type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusions"
>["bulkConclusions"][0];

const ActionCell = ({ row }: CellContext<BulkConclusion, unknown>) => {
    // Get user role, to decide what rights the user has for this view
    const user = useUser();
    return user ? (
        <>
            {(user.role === "ADMIN" ||
                user.username === row.original.user.username) && (
                <div className="flex items-center">
                    <EditButton
                        onClick={() => {}}
                        name="edit"
                        className="mr-1 px-2"
                    />
                    <DeleteBulkConclusion id={row.original.id} />
                </div>
            )}
        </>
    ) : null;
};

export default ActionCell;
