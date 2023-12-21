// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BulkCurationList from "@/components/bulk_curation_table/BulkCurationList";
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
        <div className="flex flex-col h-screen p-2">
            {user && (
                <>
                    <div className="flex-none m-1 rounded-md shadow">
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

                    <div className="flex-1 mx-1 overflow-auto border rounded-lg shadow">
                        <Tabs defaultValue="license_conclusions">
                            <TabsList className="p-2 mt-2 ml-8">
                                <TabsTrigger value="license_conclusions">
                                    License Conclusions
                                </TabsTrigger>
                                <TabsTrigger value="bulk_curations">
                                    Bulk Curations
                                </TabsTrigger>
                                <TabsTrigger value="path_exclusions">
                                    Path Exclusions
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="license_conclusions">
                                {user && <LicenseConclusionList user={user} />}
                            </TabsContent>
                            <TabsContent value="bulk_curations">
                                {user && <BulkCurationList user={user} />}
                            </TabsContent>
                            <TabsContent value="path_exclusions">
                                {user && <PathExclusionList user={user} />}
                            </TabsContent>
                        </Tabs>
                    </div>
                </>
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
