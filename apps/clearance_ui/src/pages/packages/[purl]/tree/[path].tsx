// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useMainUiStore from "@/store/mainui.store";
import useSettingsStore from "@/store/settings.store";

const MainUI = dynamic(() => import("@/components/main_ui/MainUI"), {
    ssr: false,
});

export default function PackageAndFile() {
    const mainWidths = useSettingsStore((state) => state.mainWidths);
    const clearanceHeights = useSettingsStore(
        (state) => state.clearanceHeights,
    );
    const router = useRouter();
    const { purl, path } = router.query;
    const setPurl = useMainUiStore((state) => state.setPurl);
    const setPath = useMainUiStore((state) => state.setPath);
    const user = useUser();
    const session = useSession({
        required: true,
    });

    useEffect(() => {
        if (
            !purl ||
            !path ||
            typeof purl !== "string" ||
            typeof path !== "string"
        ) {
            return;
        }
        setPurl(purl);
        setPath(path);
    }, [purl, path]);

    useEffect(() => {
        if (session.data?.error === "SessionNotActiveError") {
            signOut();
        } else if (session.data?.error !== undefined) {
            signIn("keycloak");
        }
    }, [session.data?.error]);

    return (
        <div className="h-full">
            {user && purl && path && (
                <MainUI
                    purl={purl.toString().replace(/\/@/g, "/%40")}
                    path={path.toString()}
                    defaultMainWidths={mainWidths}
                    defaultClearanceHeights={clearanceHeights}
                />
            )}
            {session.status === "loading" && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
        </div>
    );
}
