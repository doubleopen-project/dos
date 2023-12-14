// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/bulk_curation_table/columns";
import { DataTable } from "@/components/bulk_curation_table/DataTable";

type BulkCurationListProps = {
    user: ZodiosResponseByPath<typeof userAPI, "get", "/user">;
};

const BulkCurationList = ({ user }: BulkCurationListProps) => {
    const { data, isLoading, error } = userHooks.useGet("/bulk-curations", {
        withCredentials: true,
    });
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                Loading bulk curations...
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
                <DataTable columns={tableColumns} data={data.bulkCurations} />
            )}
        </div>
    );
};

export default BulkCurationList;
