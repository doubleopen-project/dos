// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from 'react'
import PackageTree from '@/components/PackageTree';
import CodeInspector from '@/components/CodeInspector';

type CurationUIProps = {
    purl: string | undefined;
    path: string | undefined;
    sha256: string | undefined;
}

const CurationUI = ({ purl, path, sha256 }: CurationUIProps) => {
    return (
        <div className='flex flex-col md:flex-row h-screen'>

            {/* 1st column (4/12): Show and filter package */}
            <div className="w-full md:w-4/12 flex flex-col m-2 mr-1 p-2 rounded-md bg-white shadow">
                <PackageTree purl={purl} />
            </div>

            {/* 2nd column (8/12): No file opened yet */}
            <div className="w-full md:w-8/12 flex flex-col m-2 ml-1 p-2 rounded-md bg-white shadow">
                <CodeInspector path={path} sha256={sha256} />
            </div>
        </div>
    )
}

export default CurationUI;
