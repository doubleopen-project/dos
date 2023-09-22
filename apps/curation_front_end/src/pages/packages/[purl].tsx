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
        <main className='bg-gradient-to-br from-black to-gray-900 text-white min-h-screen'>
            <Header />
            <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
                <PackageTree data={data} />
                <CodeInspector />
            </div>
        </main>
    )
}