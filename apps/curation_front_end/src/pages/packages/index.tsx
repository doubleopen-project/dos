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

    const { data, isLoading, error } = userHooks.useGet(
        "/packages",
        {
            withCredentials: true,
        },
        { enabled: !!user },
    );
    const packages = data?.packages;

    return (
        <div className="flex flex-col h-screen p-2">
            {user && (
                <>
                    <div className="flex-none m-1 rounded-md shadow">
                        <Card>
                            <CardHeader>
                                <CardTitle>Package Library</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    <span>Packages in the library: </span>
                                    {isLoading && (
                                        <span>
                                            <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                                        </span>
                                    )}
                                    {packages && (
                                        <span className="text-xl">
                                            {packages.length}
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
                    <div className="flex-1 py-1 m-1 overflow-auto border rounded-lg shadow">
                        {isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-32 h-32 mr-2 animate-spin" />
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-center h-full">
                                <p>{error.message}</p>
                            </div>
                        )}
                        {packages && <PackageList data={{ packages }} />}
                    </div>
                </>
            )}
            {userIsLoading && (
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
