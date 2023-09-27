// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";
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
        <div className='bg-gray-200 h-screen'>
            <div className='flex flex-col md:flex-row w-full'>

                {/* 1st column (5/12): Show and filter package */}
                <div className="w-full md:w-5/12 h-screen flex flex-col">

                    {/* Filter and navigate within packet */}
                    <div className="p-2 m-2 rounded-md bg-white shadow flex items-center text-sm">
                        <input className='bg-gray-200 p-2 rounded-lg w-full' type='text' placeholder='Filter' />
                        <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                            Expand
                        </button>
                        <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                            {"<-"}
                        </button>
                        <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                            {"->"}
                        </button>
                    </div>
                    
                    {/* FileTree */}
                    <div className='flex-1 rounded-md bg-white shadow overflow-y-auto p-2 m-2'>
                        <PackageTree data={data} />
                    </div>

                    {/* Filter with specific licenses */}
                    <div className="p-2 m-2 rounded-md bg-white shadow flex items-center text-sm">
                        <input className='bg-gray-200 p-2 rounded-lg w-full' type='text' placeholder='Filter with a detected license' />
                        <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                            {"V"}
                        </button>
                    </div>

                </div>

                {/* 2nd column (7/12): Show file, do curation */}
                <div className="w-full md:w-7/12 h-screen flex flex-col">

                    {/* Filter and navigate within file */}
                    <div className="p-2 m-2 rounded-md bg-white shadow flex items-center text-sm">
                        <input className='bg-gray-200 p-2 rounded-lg w-full' type='text' placeholder='Filter' />
                        <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                            {"<-"}
                        </button>
                        <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                            {"->"}
                        </button>
                    </div>
                        
                    {/* Code window */}
                    <div className='flex-1 rounded-md bg-white shadow overflow-hidden p-2 m-2'>
                        <CodeInspector />
                    </div>

                    {/* Detected license, curation */}
                    <div className="p-2 m-2 rounded-md bg-white shadow flex-row text-sm">
                        <p className="p-2">
                            DETECTED LICENSE FOR THIS FILE
                        </p>
                        <div className="p-2 m-2 rounded-md bg-white shadow flex items-center text-sm">
                            <input className='bg-gray-200 p-2 rounded-lg w-full' type='text' placeholder='CONCLUDED LICENSE' />
                            <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2' >
                                Add curation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}