// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Header from '@/components/Header';
import PackageTree from '@/components/PackageTree';
import CodeInspector from '@/components/CodeInspector';

export default function PackageLibrary() {
    return (
        <main className='bg-gradient-to-br from-black to-gray-900 text-white min-h-screen'>
            <Header />
            <h1>Welcome to Package Library</h1>
        </main>
    )
}
