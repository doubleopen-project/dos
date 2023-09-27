// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Header from '@/components/Header';
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
        <div className='bg-gray-200 min-h-screen'>
            <div className='w-full col-span-1 relative mx-4 p-4'>
                <h1>Packages with scan results</h1>
            </div>
            <div className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] mx-4 p-4 border rounded-lg overflow-scroll'>
                <PackageList data={{packages}}/>
            </div>
        </div>
    )
}
