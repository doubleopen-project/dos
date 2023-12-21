// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";

const CurationUI = dynamic(() => import("@/components/CurationUI"), {
    ssr: false,
});

export default function PackageAndFile() {
    const router = useRouter();
    const { purl, path } = router.query;
    const {
        data: user,
        error,
        isLoading,
    } = userHooks.useGetUser(
        {
            withCredentials: true,
        },
        { retry: false, enabled: !!purl && !!path },
    );
    let errMsg;

    if (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            if (purl && path) {
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
        <div className="h-screen">
            {user && purl && path && (
                <CurationUI
                    purl={purl.toString().replace(/\/@/g, "/%40")}
                    path={path.toString()}
                />
            )}
            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-16 h-16 mr-2 animate-spin" />
                </div>
            )}
            {errMsg && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-red-500">{errMsg}</p>
                </div>
            )}
        </div>
    );
}
