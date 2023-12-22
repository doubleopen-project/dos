// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BulkConclusionList from "@/components/bulk_conclusion_table/BulkConclusionList";
import LicenseConclusionList from "@/components/license_conclusion_table/LicenseConclusionList";
import PathExclusionList from "@/components/path_exclusion_table/PathExclusionList";

export default function ClearanceLibrary() {
    const router = useRouter();
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
        <div className="flex h-screen flex-col p-2">
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
                        <Tabs defaultValue="license_conclusions">
                            <TabsList className="ml-8 mt-2 p-2">
                                <TabsTrigger value="license_conclusions">
                                    License Conclusions
                                </TabsTrigger>
                                <TabsTrigger value="bulk_curations">
                                    Bulk Conclusions
                                </TabsTrigger>
                                <TabsTrigger value="path_exclusions">
                                    Path Exclusions
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="license_conclusions">
                                {user && <LicenseConclusionList user={user} />}
                            </TabsContent>
                            <TabsContent value="bulk_curations">
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
