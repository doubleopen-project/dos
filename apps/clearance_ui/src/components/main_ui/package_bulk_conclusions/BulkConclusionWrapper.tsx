// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { userHooks } from "@/hooks/zodiosHooks";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import BulkConclusion from "@/components/main_ui/package_bulk_conclusions/BulkConclusion";
import BulkConclusionEditForm from "@/components/main_ui/package_bulk_conclusions/BulkConclusionEditForm";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type Props = {
    purl: string;
};

const BulkConclusionWrapper = ({ purl }: Props) => {
    const session = useSession();
    const pathPurl = toPathPurl(purl);
    const { data, isLoading, error } = userHooks.useGetBulkConclusionsByPurl(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
            params: { purl: pathPurl },
        },
        { enabled: !!pathPurl },
    );
    const [editing, setEditing] = useState(-1);

    const editHandler = (id: number) => {
        setEditing(id);
    };

    // Filter the data (bulk conclusions) into two sublists,
    // one for BCs in this package and one for BCs in other packages
    const bcForThisPackage = data?.bulkConclusions.filter(
        (bc) => bc.package.purl === purl,
    );
    const bcForOtherContext = data?.bulkConclusions.filter(
        (bc) => bc.package.purl !== purl,
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
                    <div>Error: {error.message}</div>
                </div>
            )}
            {data && data.bulkConclusions.length > 0 ? (
                <div className="w-full flex-1 overflow-y-auto border">
                    {bcForThisPackage && bcForThisPackage.length > 0 && (
                        <>
                            <Card className="bg-muted m-2">
                                <CardHeader>
                                    <CardTitle>
                                        Bulk Conclusions created for this
                                        package
                                    </CardTitle>
                                    <CardDescription>
                                        This is a list of the{" "}
                                        {bcForThisPackage?.length} bulk
                                        conclusions that are created originally
                                        for this package and version.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            {bcForThisPackage.map((bc) =>
                                bc.id === editing ? (
                                    <BulkConclusionEditForm
                                        key={`edit-bc-${bc.id}`}
                                        pathPurl={pathPurl}
                                        bulkConclusion={bc}
                                        editHandler={editHandler}
                                    />
                                ) : (
                                    <BulkConclusion
                                        key={`bc-${bc.id}`}
                                        purl={purl}
                                        bulkConclusion={bc}
                                        editHandler={editHandler}
                                    />
                                ),
                            )}
                        </>
                    )}
                    {bcForOtherContext && bcForOtherContext.length > 0 && (
                        <>
                            <Card className="bg-muted m-2">
                                <CardHeader>
                                    <CardTitle>
                                        Bulk Conclusions created for other
                                        packages
                                    </CardTitle>
                                    <CardDescription>
                                        There are additionally a total of{" "}
                                        {bcForOtherContext?.length} bulk
                                        conclusions that are created for other
                                        packages and/or other versions of this
                                        package. These bulk conclusions are
                                        relevant for this package and thus shown
                                        here, because the SHA256 (ie. contents)
                                        of the files match.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            {bcForOtherContext.map((bc) =>
                                bc.id === editing ? (
                                    <BulkConclusionEditForm
                                        key={`edit-bc-${bc.id}`}
                                        pathPurl={pathPurl}
                                        bulkConclusion={bc}
                                        editHandler={editHandler}
                                    />
                                ) : (
                                    <BulkConclusion
                                        key={`bc-${bc.id}`}
                                        purl={purl}
                                        bulkConclusion={bc}
                                        editHandler={editHandler}
                                    />
                                ),
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="flex h-full items-center justify-center border">
                    No bulk conclusions created for this package
                </div>
            )}
        </>
    );
};

export default BulkConclusionWrapper;
