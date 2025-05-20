// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import ClearanceToolbar from "@/components/main_ui/ClearanceToolbar";
import BulkConclusionWrapper from "@/components/main_ui/package_bulk_conclusions/BulkConclusionWrapper";

const BulkConclusions = () => {
    const router = useRouter();
    const purl = router.query.purl;
    const user = useUser();

    const session = useSession({
        required: true,
    });

    useEffect(() => {
        if (session.data?.error === "SessionNotActiveError") {
            signOut();
        } else if (session.data?.error !== undefined) {
            signIn("keycloak");
        }
    }, [session.data?.error]);

    if (!purl || !user) {
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
