// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { Loader2 } from "lucide-react";
import { parseAsString, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BulkConclusionList from "@/components/clearance_library/bulk_conclusions/BulkConclusionList";
import LicenseConclusionList from "@/components/clearance_library/license_conclusions/LicenseConclusionList";
import PathExclusionList from "@/components/clearance_library/path_exclusions/PathExclusionList";

export default function ClearanceLibrary() {
    const router = useRouter();
    const [tab, setTab] = useQueryState(
        "tab",
        parseAsString.withDefault("license_conclusions"),
    );
    const {
        data: user,
        error,
        isLoading,
    } = userHooks.useGetUser(
        {
            withCredentials: true,
        },
        { retry: false },
    );
    let errMsg;

    if (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            router.push({
                pathname: "/login",
                query: { redirectToPath: router.asPath },
            });
        } else {
            errMsg = error.message;
        }
    }

    return (
        <div className="flex h-full flex-col p-2">
            {user && (
                <>
                    <div className="m-1 flex-none rounded-md shadow">
                        <Card>
                            <CardHeader>
                                <CardTitle>Clearance Library</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    This page shows all clearances (license
                                    conclusions, path exclusions) that have been
                                    created for packages in the Package Library.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mx-1 flex-1 overflow-auto rounded-lg border shadow">
                        <Tabs
                            defaultValue={tab}
                            onValueChange={(value) => {
                                setTab(value);
                                router.push({
                                    pathname: router.pathname,
                                    query: { tab: value },
                                });
                            }}
                        >
                            <TabsList className="ml-8 mt-2 p-2">
                                <TabsTrigger
                                    value="license_conclusions"
                                    data-testid="clearance-lib-lic-conclusions"
                                >
                                    License Conclusions
                                </TabsTrigger>
                                <TabsTrigger
                                    value="bulk_conclusions"
                                    data-testid="clearance-lib-bulk-conclusions"
                                >
                                    Bulk Conclusions
                                </TabsTrigger>
                                <TabsTrigger
                                    value="path_exclusions"
                                    data-testid="clearance-lib-path-exclusions"
                                >
                                    Path Exclusions
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="license_conclusions">
                                {user && <LicenseConclusionList user={user} />}
                            </TabsContent>
                            <TabsContent value="bulk_conclusions">
                                {user && <BulkConclusionList user={user} />}
                            </TabsContent>
                            <TabsContent value="path_exclusions">
                                {user && <PathExclusionList user={user} />}
                            </TabsContent>
                        </Tabs>
                    </div>
                </>
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
