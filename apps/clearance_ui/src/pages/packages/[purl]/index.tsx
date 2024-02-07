// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { Loader2 } from "lucide-react";
import {
    parseAsBoolean,
    parseAsString,
    useQueryState,
} from "next-usequerystate";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import useMainUiStore from "@/store/mainui.store";
import useSettingsStore from "@/store/settings.store";

const MainUI = dynamic(() => import("@/components/MainUI"), {
    ssr: false,
});

export default function Package() {
    const [licenseFilter] = useQueryState(
        "licenseFilter",
        parseAsString.withDefault(""),
    );
    const [filtering] = useQueryState(
        "filtering",
        parseAsBoolean.withDefault(false),
    );
    const mainWidths = useSettingsStore((state) => state.mainWidths);
    const clearanceHeights = useSettingsStore(
        (state) => state.clearanceHeights,
    );
    const router = useRouter();
    const { purl } = router.query;

    const setPurl = useMainUiStore((state) => state.setPurl);
    const setPath = useMainUiStore((state) => state.setPath);
    const setLicenseFilter = useMainUiStore((state) => state.setLicenseFilter);
    const setFiltering = useMainUiStore((state) => state.setFiltering);
    setPurl(purl as string);
    setPath("");
    setLicenseFilter(licenseFilter);
    setFiltering(filtering);

    const {
        data: user,
        error,
        isLoading,
    } = userHooks.useGetUser(
        {
            withCredentials: true,
        },
        { retry: false, enabled: !!purl },
    );
    let errMsg;

    if (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            if (purl) {
                router.push({
                    pathname: "/login",
                    query: { redirectToPath: router.asPath },
                });
            }
        } else {
            errMsg = error.message;
        }
    }

    // If purl has /@ in a row, the characters should be changed to /%40
    // This is because in the purl spec, @ is used to separate the package name and the version

    return (
        <div className="h-full">
            {user && purl && (
                <MainUI
                    purl={purl.toString().replace(/\/@/g, "/%40")}
                    path={undefined}
                    defaultMainWidths={mainWidths}
                    defaultClearanceHeights={clearanceHeights}
                />
            )}
            {isLoading && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
            {errMsg && (
                <div className="flex h-full items-center justify-center">
                    <p className="text-red-500">{errMsg}</p>
                </div>
            )}
        </div>
    );
}
