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
import { columns } from "@/components/clearance_library/license_conclusions/columns";
import { DataTable } from "@/components/clearance_library/license_conclusions/DataTable";
import { getErrorMessage } from "@/helpers/getErrorMessage";

const LicenseConclusionList = () => {
    const [pageSize] = useQueryState(
        "pageSize",
        parseAsInteger.withDefault(10),
    );
    const [pageIndex, setPageIndex] = useQueryState(
        "pageIndex",
        parseAsInteger.withDefault(1),
    );
    const [contextPurl] = useQueryState("contextPurl", parseAsString);

    const [sortBy, setSortBy] = useQueryState(
        "sortBy",
        parseAsStringEnum([
            "contextPurl",
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

    const lcCntQuery = userHooks.useGetLicenseConclusionsCount({
        queries: {
            contextPurl: contextPurl !== null ? contextPurl : undefined,
            /*
             * The initial idea of these queries was to fetch the license conclusions that are
             * not part of a bulk conclusion (and their count) by setting the bulkConclusionId to
             * null, but for some reason a parameter with null value is completely dropped from the
             * query, and in the lack of a better solution, a workaround with the parameter
             * hasBulkConclusion is used here.
             */
            //bulkConclusionId: null,
            hasBulkConclusionId: false,
        },
    });

    const { data, isLoading, error } = userHooks.useGetLicenseConclusions(
        {
            queries: {
                pageIndex: pageIndex - 1,
                pageSize,
                sortBy: sortBy !== null ? sortBy : undefined,
                sortOrder: sortOrder !== null ? sortOrder : undefined,
                contextPurl: contextPurl !== null ? contextPurl : undefined,
                //bulkConclusionId: null,
                hasBulkConclusionId: false,
            },
        },
        { enabled: !!pageSize && !!pageIndex },
    );
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading license conclusions...
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
                data={data.licenseConclusions}
                pageCount={
                    lcCntQuery.data?.count
                        ? Math.ceil(lcCntQuery.data.count / pageSize)
                        : 0
                }
            />
        </div>
    );
};

export default LicenseConclusionList;
