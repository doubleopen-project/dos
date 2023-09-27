// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";
import Header from '@/components/Header';
import PackageTree from '@/components/PackageTree';
import CodeInspector from '@/components/CodeInspector';
import { zodiosHooks } from '../../hooks/zodiosHooks'

export default function Package() {
    const router = useRouter();
    let { purl } = router.query;

    // If purl has /@ in a row, the characters should be changed to /%40
    // This is because in the purl spec, @ is used to separate the package name and the version

    purl = purl?.toString().replace(/\/@/g, '/%40');

    const { data, isLoading, error } = zodiosHooks.useImmutableQuery('/filetree', { purl: purl as string });
    if (isLoading) {
        return (
        <div>
            Loading...{purl}
        </div>)
    }
    if (error) return <div>{error.message}</div>;
    if (!data) return <div>No data</div>;
    return (
        <div className='bg-gray-200 min-h-screen'>
            <div className='grid grid-cols-12 md:grid-cols-3 gap-2 p-4 mt-3'>
                <div className='col-span-6 md:col-span-1'>
                    <PackageTree data={data} />
                </div>
                <div className='col-span-6 md:col-span-2'>
                    <CodeInspector />
                </div>
            </div>
        </div>
    )
}