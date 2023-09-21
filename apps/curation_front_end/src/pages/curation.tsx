// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Header from '@/components/Header';
import PackageTree from '@/components/PackageTree';
import CodeInspector from '@/components/CodeInspector';

export default function Curation() {
    return (
        <main className='bg-gradient-to-br from-black to-gray-900 text-white min-h-screen'>

            <Header />
            <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
                <PackageTree />
                <CodeInspector />
            </div>
        </main>
    )
}
