// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import DeletePackage from "@/components/common/delete_item/DeletePackage";

type Package = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPackages"
>["packages"][0];

const ActionCell = ({ row }: CellContext<Package, unknown>) => {
    // Get user from useUser hook, to decide what DB rights the user has for Package Library
    // and conditionally show the delete button (only for admins)
    const user = useUser();
    return user ? (
        <>
            {user.role === "ADMIN" && (
                <>
                    <DeletePackage data={row.original} />
                </>
            )}
        </>
    ) : null;
};

export default ActionCell;
