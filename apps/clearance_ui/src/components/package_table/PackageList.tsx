// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
import { columns } from "@/components/package_table/columns";
import { DataTable } from "@/components/package_table/DataTable";

type PackageListProps = {
    data: ZodiosResponseByPath<typeof userAPI, "get", "/packages">;
};

const PackageList = ({ data }: PackageListProps) => {
    // Get user from useUser hook, to decide what DB rights the user has for Package Library
    // and conditionally show the delete button (only for admins)
    const user = useUser();
    if (!user) return null;
    const tableColumns = columns(user.role);

    return (
        <div className="container mx-auto">
            <DataTable columns={tableColumns} data={data.packages} />
        </div>
    );
};

export default PackageList;
