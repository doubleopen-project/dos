// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/bulk_conclusion_table/columns";
import { DataTable } from "@/components/bulk_conclusion_table/DataTable";

type BulkConclusionListProps = {
    user: ZodiosResponseByPath<typeof userAPI, "get", "/user">;
};

const BulkConclusionList = ({ user }: BulkConclusionListProps) => {
    const { data, isLoading, error } = userHooks.useGetBulkConclusions({
        withCredentials: true,
    });
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading bulk conclusions...
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
                <DataTable columns={tableColumns} data={data.bulkConclusions} />
            )}
        </div>
    );
};

export default BulkConclusionList;
