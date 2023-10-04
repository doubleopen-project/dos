import React, { useState } from 'react'
import PackageTree from '@/components/PackageTree';
import CodeInspector from '@/components/CodeInspector';

export default function CurationUI() {
    
    return (
        <div className='flex flex-col md:flex-row h-screen'>

            {/* 1st column (4/12): Show and filter package */}
            <div className="w-full md:w-4/12 flex flex-col m-4 mr-2 p-2 rounded-md bg-white shadow">
                <PackageTree purl={""} />
            </div>

            {/* 2nd column (8/12): No file opened yet */}
            <div className="w-full md:w-8/12 flex flex-col m-4 ml-2 p-2 rounded-md bg-white shadow">
                <CodeInspector contents="This is test data" />
            </div>
        </div>
    )
}
