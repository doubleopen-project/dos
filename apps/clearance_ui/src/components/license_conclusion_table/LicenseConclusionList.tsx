// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/license_conclusion_table/columns";
import { DataTable } from "@/components/license_conclusion_table/DataTable";

type LicenseConclusionListProps = {
    user: ZodiosResponseByPath<typeof userAPI, "get", "/user">;
};

const LicenseConclusionList = ({ user }: LicenseConclusionListProps) => {
    const { data, isLoading, error } = userHooks.useGet(
        "/license-conclusions",
        {
            withCredentials: true,
        },
    );
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading license conclusions...
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
                <DataTable
                    columns={tableColumns}
                    data={data.licenseConclusions.filter(
                        (lc) => lc.bulkConclusionId === null,
                    )}
                />
            )}
        </div>
    );
};

export default LicenseConclusionList;