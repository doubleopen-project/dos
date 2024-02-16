// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import LicenseConclusion from "@/components/main_ui/package_license_conclusions/LicenseConclusion";
//import LicenseConclusionEditForm from "@/components/main_ui/package_license_conclusions/LicenseConclusionEditForm";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type Props = {
    purl: string;
};

const LicenseConclusionWrapper = ({ purl }: Props) => {
    const pathPurl = toPathPurl(purl);
    const { data, isLoading, error } = userHooks.useGetLicenseConclusions(
        {
            withCredentials: true,
            params: { purl: pathPurl, hasBulkConclusionId: false },
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
                    {data.licenseConclusions.map((lc) =>
                        lc.id === editing ? (
                            <span>Edit form</span>
                        ) : (
                            //<LicenseConclusionEditForm
                            //    key={`edit-lc-${bc.id}`}
                            //    pathPurl={pathPurl}
                            //    licenseConclusion={lc}
                            //    editHandler={editHandler}
                            ///>
                            <LicenseConclusion
                                key={`lc-${lc.id}`}
                                licenseConclusion={lc}
                                path="xxx"
                                userName={userName}
                                userRole={userRole}
                                editHandler={editHandler}
                            />
                        ),
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
