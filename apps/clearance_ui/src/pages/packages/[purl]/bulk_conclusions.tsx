// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useRouter } from "next/router";
import ClearanceToolbar from "@/components/ClearanceToolbar";
import BulkConclusionWrapper from "@/components/main_ui/package_bulk_conclusions/BulkConclusionWrapper";

const BulkConclusions = () => {
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
            <BulkConclusionWrapper purl={purl} />
        </div>
    );
};

export default BulkConclusions;
