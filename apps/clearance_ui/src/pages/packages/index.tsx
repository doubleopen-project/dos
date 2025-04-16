// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackageList from "@/components/package_library/PackageList";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { hasPermission } from "@/helpers/hasPermission";

export default function PackageLibrary() {
    const session = useSession({
        required: true,
    });
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (
            user &&
            user.permissions &&
            !hasPermission(user.permissions, "PackageLibraryData", "GET")
        ) {
            router.push("/403");
        }
    }, [user, router]);

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
            {hasPermission(
                user?.permissions || [],
                "PackageLibraryData",
                "GET",
            ) && (
                <>
                    <div className="m-1 flex-none rounded-md shadow-sm">
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
                                        <span className="rounded-md p-1 font-semibold text-red-500">
                                            Error:{" "}
                                            {getErrorMessage(pkgCntError)}
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
                    <div className="m-1 flex-1 overflow-auto rounded-lg border py-1 shadow-sm">
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
