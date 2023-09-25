// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from 'react'
import Link from 'next/link'
import { GrInspect, GrCatalog } from 'react-icons/gr'
import { AiOutlineHome } from 'react-icons/ai'

interface SidebarProps {
    children: React.ReactNode
}

const Sidebar = ({ children }: SidebarProps) => {
    const toolbarSettings = "fixed w-20 h-screen p-4 bg-black border-r-[1px] flex flex-col justify-between";
    const iconSettings = "bg-gray-600 text-white my-4 p-3 hover:bg-gray-400 rounded-lg inline-block";
    const negCorrection = "brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(175deg)";
    return (
        <div className='flex'>
            <div className={toolbarSettings}>
                <div className='flex flex-col items-center'>
                    <Link href='/'>
                        <div className={iconSettings} title='Home'>
                            <AiOutlineHome size={20} />
                        </div>
                    </Link>
                    <Link href='/packages'>
                        <div className={iconSettings} title='Package Library'>
                            <GrCatalog size={20} style={{filter: negCorrection}} />
                        </div>
                    </Link>
                    <Link href='/curation'>
                        <div className={iconSettings} title='Package Curations'>
                            <GrInspect size={20} style={{filter: negCorrection}} />
                        </div>
                    </Link>
                    
                </div>
            </div>
            <main className='ml-20 w-full'>{children}</main>
        </div>
    )
}

export default Sidebar;