// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackageList from "@/components/package_table/PackageList";

export default function PackageLibrary() {
    const router = useRouter();
    const {
        data: user,
        error: userError,
        isLoading: userIsLoading,
    } = userHooks.useGetUser(
        {
            withCredentials: true,
        },
        { retry: false },
    );
    let errMsg;

    if (userError) {
        if (
            axios.isAxiosError(userError) &&
            userError.response?.status === 403
        ) {
            router.push({
                pathname: "/login",
                query: { redirectToPath: router.asPath },
            });
        } else {
            errMsg = userError.message;
        }
    }

    const {
        data: pkgCntData,
        isLoading: pkgCntLoading,
        error: pkgCntError,
    } = userHooks.useGetPackagesCount(
        {
            withCredentials: true,
        },
        { enabled: !!user },
    );

    return (
        <div className="flex h-full flex-col p-2">
            {user && (
                <>
                    <div className="m-1 flex-none rounded-md shadow">
                        <Card>
                            <CardHeader>
                                <CardTitle>Package Library</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    <span>Packages in the library: </span>
                                    {pkgCntLoading && (
                                        <span>
                                            <Loader2 className="mr-2 inline-block h-4 w-4 animate-spin" />
                                        </span>
                                    )}
                                    {pkgCntError && (
                                        <span className="bg-destructive text-bold rounded-md p-1">
                                            {pkgCntError.message}
                                        </span>
                                    )}
                                    {pkgCntData && (
                                        <span className="text-xl">
                                            {pkgCntData.count}
                                        </span>
                                    )}
                                </p>
                                <br />
                                <br />
                                <p className="text-sm">
                                    This is a list of all packages that are
                                    currently in the Package Library. You can
                                    search for packages by name. Clicking a
                                    package name will take you to the curation
                                    UI.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="m-1 flex-1 overflow-auto rounded-lg border py-1 shadow">
                        {pkgCntData && (
                            <PackageList pkgCnt={pkgCntData.count} />
                        )}
                    </div>
                </>
            )}
            {userIsLoading && (
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
