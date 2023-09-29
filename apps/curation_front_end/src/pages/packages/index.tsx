// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import PackageList from '@/components/PackageList';
import { zodiosHooks } from '../../hooks/zodiosHooks';

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
            <div className="flex-none p-4 m-1 rounded-md bg-white shadow">
                <h1>Packages with scan results</h1>
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
