// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ClearanceToolbar from "@/components/main_ui/ClearanceToolbar";
import PathExclusionWrapper from "@/components/main_ui/package_path_exclusions/PathExclusionWrapper";

const PathExclusions = () => {
    const router = useRouter();
    const purl = router.query.purl;
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

    if (!purl || session.status === "loading") {
        return <div>Loading...</div>;
    }
    if (typeof purl !== "string") {
        return <div>Invalid purl</div>;
    }

    return (
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
            <PathExclusionWrapper purl={purl} />
        </div>
    );
};

export default PathExclusions;
