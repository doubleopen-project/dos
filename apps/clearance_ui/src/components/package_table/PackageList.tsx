// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/package_table/columns";
import { DataTable } from "@/components/package_table/DataTable";

const PackageList = () => {
    // Get user from useUser hook, to decide what DB rights the user has for Package Library
    // and conditionally show the delete button (only for admins)
    const user = useUser();
    if (!user) return null;
    const tableColumns = columns(user.role);

    const { data, isLoading, error } = userHooks.useGetPackages(
        {
            withCredentials: true,
        },
        { enabled: !!user },
    );

    return (
        <>
            {isLoading && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-32 w-32 animate-spin" />
                </div>
            )}
            {error && (
                <div className="flex h-full items-center justify-center">
                    <p>{error.message}</p>
                </div>
            )}
            {data && (
                <div className="container mx-auto h-full">
                    <DataTable columns={tableColumns} data={data.packages} />
                </div>
            )}
        </>
    );
};

export default PackageList;
