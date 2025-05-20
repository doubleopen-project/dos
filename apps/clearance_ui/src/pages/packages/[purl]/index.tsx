// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useMainUiStore from "@/store/mainui.store";
import useSettingsStore from "@/store/settings.store";

const MainUI = dynamic(() => import("@/components/main_ui/MainUI"), {
    ssr: false,
});

export default function Package() {
    const mainWidths = useSettingsStore((state) => state.mainWidths);
    const clearanceHeights = useSettingsStore(
        (state) => state.clearanceHeights,
    );
    const router = useRouter();
    const { purl } = router.query;

    const setPurl = useMainUiStore((state) => state.setPurl);
    const setPath = useMainUiStore((state) => state.setPath);
    setPurl(purl as string);
    setPath("");

    const user = useUser({
        required: true,
    });

    return (
        <div className="h-full">
            {user && purl ? (
                <MainUI
                    purl={purl.toString().replace(/\/@/g, "/%40")}
                    path={undefined}
                    defaultMainWidths={mainWidths}
                    defaultClearanceHeights={clearanceHeights}
                />
            ) : (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
        </div>
    );
}
