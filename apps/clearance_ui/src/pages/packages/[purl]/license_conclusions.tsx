// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useRouter } from "next/router";
import ClearanceToolbar from "@/components/ClearanceToolbar";
import LicenseConclusionWrapper from "@/components/main_ui/package_license_conclusions/LicenseConclusionWrapper";

const LicenseConclusions = () => {
    const router = useRouter();
    const purl = router.query.purl;

    if (!purl) {
        return <div>Loading...</div>;
    }
    if (typeof purl !== "string") {
        return <div>Invalid purl</div>;
    }

    return (
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
            <LicenseConclusionWrapper purl={purl} />
        </div>
    );
};

export default LicenseConclusions;
