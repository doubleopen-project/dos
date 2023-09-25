// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Header from '@/components/Header';
import { data } from '@/testData/packages';
import PackageList from '@/components/PackageList';

const packages = data.packages.map((pkg) => ({
    ...pkg,
    updatedAt: new Date(pkg.updatedAt)
}));

export default function PackageLibrary() {
    return (
        <main className='bg-gray-200 text-black min-h-screen'>
            <Header />
            <div className='w-full col-span-1 relative m-auto p-4'>
                <h1>Packages with scan results</h1>
            </div>
            <div className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] mx-4 p-4 border rounded-lg overflow-scroll'>
                <PackageList data={{packages}}/>
            </div>
        </main>
    )
}
