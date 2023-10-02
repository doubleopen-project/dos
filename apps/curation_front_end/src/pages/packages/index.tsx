// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import PackageList from '@/components/PackageList';
import { zodiosHooks } from '../../hooks/zodiosHooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PackageLibrary() {

    const { data, isLoading, error } = zodiosHooks.useGet('/packages');
    if (isLoading) {
        return (
            <div>
                Loading package list...
            </div>)
    }
    if (error) return <div>{error.message}</div>;
    if (!data) return <div>No data</div>;

    const packages = data.packages.map((pkg) => ({
        ...pkg,
        updatedAt: new Date(pkg.updatedAt)
    }));

    return (
        <div className='flex flex-col p-2 bg-gray-200 h-screen'>
            <div className="flex-none m-1 rounded-md bg-white shadow">
                <Card>
                    <CardHeader>
                        <CardTitle>Package Library</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            <span>Packages in the library:  </span>
                            <span className="text-xl">{packages.length}</span>
                            <br />
                            <br />
                        </p>
                        <p className='text-sm'>This is a list of all packages that are currently in the Package Library.</p>
                        <p className='text-sm'>You can search for packages by name.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex-none p-4 m-1 rounded-md bg-white shadow">
                <input className='bg-gray-200 p-2 rounded-lg w-full'
                    type='text'
                    placeholder='Search packages by name'
                />
            </div>
            <div className='flex-1 p-4 m-1 border bg-white shadow rounded-lg overflow-auto'>
                <PackageList data={{ packages }} />
            </div>
        </div>
    )
}
