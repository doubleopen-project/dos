// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useRouter } from "next/router";
import ClearanceToolbar from "@/components/ClearanceToolbar";

const PackageBulkConclusions = () => {
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
            <div className="flex-1 border p-2">
                Bulk conclusions of the package: {purl}
            </div>
        </div>
    );
};

export default PackageBulkConclusions;
