// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackageList from "@/components/package_library/PackageList";

export default function PackageLibrary() {
    const session = useSession({
        required: true,
    });

    const {
        data: pkgCntData,
        isLoading: pkgCntLoading,
        error: pkgCntError,
    } = userHooks.useGetPackagesCount(
        {
            headers: {
                Authorization: `Bearer ${session?.data?.accessToken}`,
            },
        },
        {
            enabled: session.status === "authenticated",
        },
    );

    useEffect(() => {
        if (session.data?.error === "SessionNotActiveError") {
            signOut();
        } else if (session.data?.error !== undefined) {
            signIn("keycloak");
        }
    }, [session.data?.error]);

    return (
        <div className="flex h-full flex-col p-2">
            {session.status === "authenticated" && (
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
            {session.status === "loading" && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
        </div>
    );
}
