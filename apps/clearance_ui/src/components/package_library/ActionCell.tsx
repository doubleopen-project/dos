// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { adminAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import DeletePackage from "@/components/common/delete_item/DeletePackage";
import { hasPermission } from "@/helpers/hasPermission";

type Package = ZodiosResponseByAlias<
    typeof adminAPI,
    "GetPackages"
>["packages"][0];

const ActionCell = ({ row }: CellContext<Package, unknown>) => {
    // Get user from useUser hook, to decide what DB rights the user has for Package Library
    // and conditionally show the delete button (only for admins)
    const user = useUser();
    return user ? (
        <>
            {user.permissions &&
                hasPermission(user.permissions, "PackageData", "DELETE") && (
                    <>
                        <DeletePackage data={row.original} />
                    </>
                )}
        </>
    ) : null;
};

export default ActionCell;
