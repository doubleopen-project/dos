// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BulkCurationList from "@/components/bulk_curation_table/BulkCurationList";
import LicenseConclusionList from "@/components/license_conclusion_table/LicenseConclusionList";
import PathExclusionList from "@/components/path_exclusion_table/PathExclusionList";

export default function CurationsLibrary() {
    const user = useUser({});

    return (
        <div className="flex flex-col h-screen p-2">
            <div className="flex-none m-1 rounded-md shadow">
                <Card>
                    <CardHeader>
                        <CardTitle>Curations Library</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            This page shows all curations that have been created
                            for packages in the Package Library.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex-1 mx-1 overflow-auto border rounded-lg shadow">
                <Tabs defaultValue="license_conclusions">
                    <TabsList className="p-2 ml-8 mt-2">
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
        </div>
    );
}
