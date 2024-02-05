// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useRouter } from "next/router";
import ClearanceToolbar from "@/components/ClearanceToolbar";

const PackageLicenseConclusions = () => {
    const router = useRouter();
    const purl = router.query.purl as string;
    return (
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
            <div className="flex-1 border p-2">
                License conclusions of the package: {purl}
            </div>
        </div>
    );
};

export default PackageLicenseConclusions;
