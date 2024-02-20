// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import LicenseConclusion from "@/components/main_ui/package_license_conclusions/LicenseConclusion";
import LicenseConclusionEditForm from "@/components/main_ui/package_license_conclusions/LicenseConclusionEditForm";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type Props = {
    purl: string;
};

const LicenseConclusionWrapper = ({ purl }: Props) => {
    const pathPurl = toPathPurl(purl);
    const { data, isLoading, error } = userHooks.useGetLicenseConclusions(
        {
            withCredentials: true,
            queries: { purl, hasBulkConclusionId: false },
        },
        { enabled: !!pathPurl },
    );
    const [editing, setEditing] = useState(-1);

    // Get user from useUser hook, to decide what DB rights the user has for curations
    let user = undefined;
    user = useUser();
    const userName = user ? user.username : "Guest";
    const userRole = user ? user.role : "";

    const editHandler = (id: number) => {
        setEditing(id);
    };

    // Filter the data (license conclusions) into two sublists,
    // one for LCs in this package and one for LCs in other packages
    const lcForThisPackage = data?.licenseConclusions.filter(
        (lc) => lc.contextPurl === purl,
    );
    const lcForOtherContext = data?.licenseConclusions.filter(
        (lc) => lc.contextPurl !== purl,
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
            {data && data.licenseConclusions.length > 0 ? (
                <div className="w-full flex-1 overflow-y-auto border">
                    {lcForThisPackage && lcForThisPackage.length > 0 && (
                        <>
                            <Card className="bg-muted m-2">
                                <CardHeader>
                                    <CardTitle>
                                        License Conclusions created for this
                                        package
                                    </CardTitle>
                                    <CardDescription>
                                        This is a list of the{" "}
                                        {lcForThisPackage?.length} license
                                        conclusions that are created originally
                                        for this package and version.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            {lcForThisPackage.map((lc) =>
                                lc.id === editing ? (
                                    <LicenseConclusionEditForm
                                        key={`edit-lc-${lc.id}`}
                                        licenseConclusion={lc}
                                        editHandler={editHandler}
                                    />
                                ) : (
                                    <LicenseConclusion
                                        key={`lc-${lc.id}`}
                                        purl={purl}
                                        licenseConclusion={lc}
                                        userName={userName}
                                        userRole={userRole}
                                        editHandler={editHandler}
                                    />
                                ),
                            )}
                        </>
                    )}
                    {lcForOtherContext && lcForOtherContext.length > 0 && (
                        <>
                            <Card className="bg-muted m-2">
                                <CardHeader>
                                    <CardTitle>
                                        License Conclusions created for other
                                        packages
                                    </CardTitle>
                                    <CardDescription>
                                        There are additionally a total of{" "}
                                        {lcForOtherContext?.length} license
                                        conclusions that are created for other
                                        packages and/or other versions of this
                                        package. These license conclusions are
                                        relevant for this package and thus shown
                                        here, because the SHA256 (ie. contents)
                                        of the files match.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            {lcForOtherContext.map((lc) =>
                                lc.id === editing ? (
                                    <LicenseConclusionEditForm
                                        key={`edit-lc-${lc.id}`}
                                        licenseConclusion={lc}
                                        editHandler={editHandler}
                                    />
                                ) : (
                                    <LicenseConclusion
                                        key={`lc-${lc.id}`}
                                        purl={purl}
                                        licenseConclusion={lc}
                                        userName={userName}
                                        userRole={userRole}
                                        editHandler={editHandler}
                                    />
                                ),
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="flex h-full items-center justify-center border">
                    No license conclusions created for this package
                </div>
            )}
        </>
    );
};

export default LicenseConclusionWrapper;
