import React, { useState } from 'react'
import type { GetPackagesResType } from 'validation-helpers';

interface PackageListProps {
    data: GetPackagesResType;
}

const PackageList = ({data}: PackageListProps) => {
  return (
    <div>
        <ul className='flex flex-col gap-4'>
            {data.packages.map(({ purl, updatedAt }) => (
                <li key={purl} className='flex flex-row'>
                    <div className='w-1/6'>{updatedAt.toLocaleString()}</div>
                    <div className='w-5/6 hover:text-blue-400'><a href={`/packages/${encodeURIComponent(purl)}`}>{purl}</a></div>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default PackageList;