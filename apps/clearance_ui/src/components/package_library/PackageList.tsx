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
import { adminHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/package_library/columns";
import { DataTable } from "@/components/package_library/DataTable";
import { getErrorMessage } from "@/helpers/getErrorMessage";

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

    const tableColumns = columns(
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
        setPageIndex,
    );

    const { data, isLoading, error } = adminHooks.useGetPackages(
        {
            queries: {
                pageIndex: pageIndex - 1,
                pageSize,
                sortBy: sortBy !== null ? sortBy : undefined,
                sortOrder: sortOrder !== null ? sortOrder : undefined,
                name: name !== null ? name : undefined,
            },
        },
        { enabled: !!pageSize && !!pageIndex },
    );

    const pkgCntQuery = adminHooks.useGetPackagesCount({
        queries: { name: name !== null ? name : undefined },
    });

    return (
        <>
            {isLoading && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
            {error && (
                <div className="flex h-full items-center justify-center font-semibold text-red-500">
                    Error: {getErrorMessage(error)}
                </div>
            )}
            {data && (
                <div className="container mx-auto h-full">
                    {pkgCntQuery.error && (
                        <div className="flex items-center justify-center font-semibold text-red-500">
                            Error: {getErrorMessage(pkgCntQuery.error)}
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
