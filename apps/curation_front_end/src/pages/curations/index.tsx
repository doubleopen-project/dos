// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackageList from "@/components/package_table/PackageList";

export default function CurationsLibrary() {
    const { data, isLoading, error } = userHooks.useGet("/packages", {
        withCredentials: true,
    });
    if (isLoading) {
        return <div>Loading package list...</div>;
    }
    if (error) return <div>{error.message}</div>;
    if (!data) return <div>No data</div>;
    const packages = data.packages;

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
            <div className="flex-1 py-1 m-1 overflow-auto border rounded-lg shadow">
                <PackageList data={{ packages }} />
            </div>
        </div>
    );
}
