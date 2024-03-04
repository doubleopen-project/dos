// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import {
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
    useQueryState,
} from "nuqs";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/clearance_library/bulk_conclusions/columns";
import { DataTable } from "@/components/clearance_library/bulk_conclusions/DataTable";

type BulkConclusionListProps = {
    user: ZodiosResponseByPath<typeof userAPI, "get", "/user">;
};

const BulkConclusionList = ({ user }: BulkConclusionListProps) => {
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
            "detectedLicenseExpressionSPDX",
            "concludedLicenseExpressionSPDX",
            "comment",
            "local",
            "updatedAt",
            "username",
        ]).withDefault("updatedAt"),
    );
    const [sortOrder, setSortOrder] = useQueryState(
        "sortOrder",
        parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
    );

    const bcCntQuery = userHooks.useGetBulkConclusionsCount(
        {
            withCredentials: true,
            queries: {
                purl: searchPurl !== null ? searchPurl : undefined,
            },
        },
        { enabled: !!user },
    );

    const { data, isLoading, error } = userHooks.useGetBulkConclusions(
        {
            withCredentials: true,
            queries: {
                pageIndex: pageIndex - 1,
                pageSize,
                sortBy: sortBy !== null ? sortBy : undefined,
                sortOrder: sortOrder !== null ? sortOrder : undefined,
                purl: searchPurl !== null ? searchPurl : undefined,
            },
        },
        { enabled: !!user && !!pageSize && !!pageIndex },
    );
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading bulk conclusions...
            </div>
        );
    }
    if (error) return <div>{error.message}</div>;
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
            {user && (
                <DataTable
                    columns={tableColumns}
                    data={data.bulkConclusions}
                    pageCount={
                        bcCntQuery.data?.count
                            ? Math.ceil(bcCntQuery.data.count / pageSize)
                            : 0
                    }
                />
            )}
        </div>
    );
};

export default BulkConclusionList;
