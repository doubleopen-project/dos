import React, { useState } from 'react'
import { data } from '@/testData/packages';

const PackageList = () => {
  return (
    <div>
        <ul>
            {data.packages.map(({ purl, updatedAt }) => (
                <li key={purl}>
                    <div>{updatedAt}</div>
                    <div><a href={`/packages/${purl}`}>{purl}</a></div>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default PackageList;