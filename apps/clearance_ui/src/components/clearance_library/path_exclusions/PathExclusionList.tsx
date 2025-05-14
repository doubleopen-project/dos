// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import {
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
    useQueryState,
} from "nuqs";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/clearance_library/path_exclusions/columns";
import { DataTable } from "@/components/clearance_library/path_exclusions/DataTable";
import { getErrorMessage } from "@/helpers/getErrorMessage";

const PathExclusionList = () => {
    const [pageSize] = useQueryState(
        "pageSize",
        parseAsInteger.withDefault(10),
    );
    const [pageIndex, setPageIndex] = useQueryState(
        "pageIndex",
        parseAsInteger.withDefault(1),
    );
    const [searchPurl] = useQueryState("searchPurl", parseAsString);

    const [sortBy, setSortBy] = useQueryState(
        "sortBy",
        parseAsStringEnum([
            "pkg",
            "pattern",
            "reason",
            "comment",
            "updatedAt",
            "username",
        ]).withDefault("updatedAt"),
    );
    const [sortOrder, setSortOrder] = useQueryState(
        "sortOrder",
        parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
    );

    const peCntQuery = userHooks.useGetPathExclusionsCount({
        queries: {
            purl: searchPurl !== null ? searchPurl : undefined,
        },
    });

    const { data, isLoading, error } = userHooks.useGetPathExclusions(
        {
            queries: {
                pageIndex: pageIndex - 1,
                pageSize,
                sortBy: sortBy !== null ? sortBy : undefined,
                sortOrder: sortOrder !== null ? sortOrder : undefined,
                purl: searchPurl !== null ? searchPurl : undefined,
            },
        },
        { enabled: !!pageSize && !!pageIndex },
    );
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center align-middle">
                Loading path exclusions...
            </div>
        );
    }
    if (error)
        return (
            <div className="flex h-full items-center justify-center font-semibold text-red-500">
                Error: {getErrorMessage(error)}
            </div>
        );
    if (!data) return <div>No data</div>;

    const tableColumns = columns(
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
        setPageIndex,
    );

    return (
        <div className="container mx-auto">
            <DataTable
                columns={tableColumns}
                data={data.pathExclusions}
                pageCount={
                    peCntQuery.data?.count
                        ? Math.ceil(peCntQuery.data.count / pageSize)
                        : 0
                }
            />
        </div>
    );
};

export default PathExclusionList;
