// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import DeleteBulkConclusion from "@/components/common/delete_item/DeleteBulkConclusion";

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
                <DeleteBulkConclusion id={row.original.id} />
            )}
        </>
    ) : null;
};

export default ActionCell;
