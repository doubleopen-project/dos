// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { parseAsString, useQueryState } from "nuqs";
import { useUser } from "@/hooks/useUser";
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
    const user = useUser({
        required: true,
    });

    return (
        <div className="flex h-full flex-col p-2">
            {user ? (
                <>
                    <div className="m-1 flex-none rounded-md shadow-sm">
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

                    <div className="mx-1 flex-1 overflow-auto rounded-lg border shadow-sm">
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
                            <TabsList className="mt-2 ml-8 p-2">
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
                                {user && <LicenseConclusionList />}
                            </TabsContent>
                            <TabsContent value="bulk_conclusions">
                                {user && <BulkConclusionList />}
                            </TabsContent>
                            <TabsContent value="path_exclusions">
                                {user && <PathExclusionList />}
                            </TabsContent>
                        </Tabs>
                    </div>
                </>
            ) : (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
        </div>
    );
}
