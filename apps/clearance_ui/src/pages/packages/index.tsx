// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { adminHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import PackageList from "@/components/package_library/PackageList";
import { getErrorMessage } from "@/helpers/getErrorMessage";

export default function PackageLibrary() {
    const user = useUser({
        required: true,
    });

    const {
        data: pkgCntData,
        isLoading: pkgCntLoading,
        error: pkgCntError,
    } = adminHooks.useGetPackagesCount(undefined, {
        enabled: !!user,
    });

    return (
        <RequireAdmin>
            <div className="flex h-full flex-col p-2">
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
                                        Error: {getErrorMessage(pkgCntError)}
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
                                currently in the Package Library. You can search
                                for packages by name. Clicking a package name
                                will take you to the curation UI.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="m-1 flex-1 overflow-auto rounded-lg border py-1 shadow-sm">
                    {pkgCntData && <PackageList pkgCnt={pkgCntData.count} />}
                </div>
            </div>
        </RequireAdmin>
    );
}
