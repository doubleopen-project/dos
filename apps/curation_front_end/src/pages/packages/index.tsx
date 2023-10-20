// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import PackageList from "@/components/PackageList";
import { userHooks } from "../../hooks/zodiosHooks";
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

    const packages = data.packages.map((pkg) => ({
        ...pkg,
        updatedAt: new Date(pkg.updatedAt),
    }));

    return (
        <div className="flex flex-col p-2 h-screen">
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
                            the Package Library.
                        </p>
                        <p className="text-sm">
                            You can search for packages by name.
                        </p>
                        <p className="text-sm">
                            Clicking a package will take you to the curation UI.
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex-1 p-4 m-1 border shadow rounded-lg overflow-auto">
                <PackageList data={{ packages }} />
            </div>
        </div>
    );
}
