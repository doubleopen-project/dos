// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/path_exclusion_table/columns";
import { DataTable } from "@/components/path_exclusion_table/DataTable";

type PathExclusionListProps = {
    user: ZodiosResponseByPath<typeof userAPI, "get", "/user">;
};

const PathExclusionList = ({ user }: PathExclusionListProps) => {
    const { data, isLoading, error } = userHooks.useGet("/path-exclusion", {
        withCredentials: true,
    });
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full align-middle">
                Loading path exclusions...
            </div>
        );
    }
    if (error) return <div>{error.message}</div>;
    if (!data) return <div>No data</div>;

    // Get user role, to decide what rights the user has for this view
    const tableColumns = columns(user);

    return (
        <div className="container mx-auto">
            {user && (
                <DataTable columns={tableColumns} data={data.pathExclusions} />
            )}
        </div>
    );
};

export default PathExclusionList;
