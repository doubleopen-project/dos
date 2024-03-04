// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import DeletePathExclusion from "@/components/common/delete_item/DeletePathExclusion";

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusions"
>["pathExclusions"][0];

const ActionCell = ({ row }: CellContext<PathExclusion, unknown>) => {
    // Get user role, to decide what rights the user has for this view
    const user = useUser();
    return user ? (
        <>
            {(user.role === "ADMIN" ||
                user.username === row.original.user.username) && (
                <DeletePathExclusion data={row.original} />
            )}
        </>
    ) : null;
};

export default ActionCell;
