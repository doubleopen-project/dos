// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Loader2 } from "lucide-react";
import {
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
    useQueryState,
} from "nuqs";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/package_library/columns";
import { DataTable } from "@/components/package_library/DataTable";

const PackageList = ({ pkgCnt }: { pkgCnt: number }) => {
    const [pageSize] = useQueryState(
        "pageSize",
        parseAsInteger.withDefault(10),
    );
    const [pageIndex, setPageIndex] = useQueryState(
        "pageIndex",
        parseAsInteger.withDefault(1),
    );
    const [name] = useQueryState("name", parseAsString);

    const [sortBy, setSortBy] = useQueryState(
        "sortBy",
        parseAsStringEnum([
            "purl",
            "name",
            "version",
            "updatedAt",
            "type",
            "namespace",
        ]).withDefault("updatedAt"),
    );
    const [sortOrder, setSortOrder] = useQueryState(
        "sortOrder",
        parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
    );

    const user = useUser();
    if (!user) return null;

    const tableColumns = columns(
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
        setPageIndex,
    );

    const { data, isLoading, error } = userHooks.useGetPackages(
        {
            withCredentials: true,
            queries: {
                pageIndex: pageIndex - 1,
                pageSize,
                sortBy: sortBy !== null ? sortBy : undefined,
                sortOrder: sortOrder !== null ? sortOrder : undefined,
                name: name !== null ? name : undefined,
            },
        },
        { enabled: !!user && !!pageSize && !!pageIndex },
    );

    const pkgCntQuery = userHooks.useGetPackagesCount(
        {
            withCredentials: true,
            queries: { name: name !== null ? name : undefined },
        },
        { enabled: !!user },
    );

    return (
        <>
            {isLoading && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
            {error && (
                <div className="flex h-full items-center justify-center">
                    <p>{error.message}</p>
                </div>
            )}
            {data && (
                <div className="container mx-auto h-full">
                    {pkgCntQuery.error && (
                        <div className="flex items-center justify-center">
                            <p>{pkgCntQuery.error.message}</p>
                        </div>
                    )}

                    <DataTable
                        columns={tableColumns}
                        data={data.packages}
                        pageCount={
                            pkgCntQuery.data?.count
                                ? Math.ceil(pkgCntQuery.data.count / pageSize)
                                : Math.ceil(pkgCnt / pageSize)
                        }
                    />
                </div>
            )}
        </>
    );
};

export default PackageList;
