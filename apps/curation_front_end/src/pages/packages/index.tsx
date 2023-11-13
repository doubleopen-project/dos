// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import PackageList from "@/components/package_table/PackageList";
import { userHooks } from "@/hooks/zodiosHooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PackageLibrary() {
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
                        <CardTitle>Package Library</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            <span>Packages in the library: </span>
                            <span className="text-xl">{packages.length}</span>
                            <br />
                            <br />
                        </p>
                        <p className="text-sm">
                            This is a list of all packages that are currently in
                            the Package Library. You can search for packages by
                            name. Clicking a package name will take you to the
                            curation UI.
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
