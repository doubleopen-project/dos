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
} from "next-usequerystate";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { columns } from "@/components/clearance_library/path_exclusions/columns";
import { DataTable } from "@/components/clearance_library/path_exclusions/DataTable";

type PathExclusionListProps = {
    user: ZodiosResponseByPath<typeof userAPI, "get", "/user">;
};

const PathExclusionList = ({ user }: PathExclusionListProps) => {
    const [pageSize] = useQueryState(
        "pageSize",
        parseAsInteger.withDefault(10),
    );
    const [pageIndex, setPageIndex] = useQueryState(
        "pageIndex",
        parseAsInteger.withDefault(1),
    );
    const [purl] = useQueryState("purl", parseAsString);

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

    const peCntQuery = userHooks.useGetPathExclusionsCount(
        {
            withCredentials: true,
            queries: {
                purl: purl !== null ? purl : undefined,
            },
        },
        { enabled: !!user },
    );

    const { data, isLoading, error } = userHooks.useGetPathExclusions(
        {
            withCredentials: true,
            queries: {
                pageIndex: pageIndex - 1,
                pageSize,
                sortBy: sortBy !== null ? sortBy : undefined,
                sortOrder: sortOrder !== null ? sortOrder : undefined,
                purl: purl !== null ? purl : undefined,
            },
        },
        { enabled: !!user && !!pageSize && !!pageIndex },
    );
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center align-middle">
                Loading path exclusions...
            </div>
        );
    }
    if (error) return <div>{error.message}</div>;
    if (!data) return <div>No data</div>;

    // Get user role, to decide what rights the user has for this view
    const tableColumns = columns(
        user,
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
                    data={data.pathExclusions}
                    pageCount={
                        peCntQuery.data?.count
                            ? Math.ceil(peCntQuery.data.count / pageSize)
                            : 0
                    }
                />
            )}
        </div>
    );
};

export default PathExclusionList;