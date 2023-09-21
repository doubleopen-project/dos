// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { convertJsonToTree } from '@/helpers/convertJsonToTree';
import { Tree, NodeRendererProps } from 'react-arborist';
import {
    BsFileText as FileText,
    BsFolder as FolderClosed,
    BsFolder2Open as FolderOpen
} from 'react-icons/bs';
import type { PostFileTreeResType } from 'validation-helpers'

const PackageTree = ({ data }:{ data:PostFileTreeResType}) => {
    
    // Convert the JSON
    const convertedData = convertJsonToTree(data.files);

    const [searchText, setSearchText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    let tree: any;

    const handleExpand = () => {
        if (!isExpanded) {
            tree.openAll();
            setIsExpanded(true);
        } else {
            tree.closeAll();
            setIsExpanded(false);
        }
    };

    return (
        <div className='w-full md:col-span-1 relative lg:h-[90vh] h-[70vh] m-auto p-4 border rounded-lg bg-gray-900 overflow-y-auto'>
            <div className='flex items-center text-sm'>
                <input
                    type='text'
                    placeholder='Search'
                    className='bg-gray-700 text-white p-2 rounded-lg w-full'
                    value={searchText}
                    onChange={handleSearch}
                />
                <button 
                    className='bg-gray-600 text-white text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'
                    onClick={handleExpand}
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>

            <Tree
                data={convertedData}
                openByDefault={false}
                searchTerm={searchText}
                searchMatch={(node, term) => 
                    node.data.name.toLowerCase().includes(term.toLowerCase())
                }
                width={600}
                height={1000}
                indent={24}
                rowHeight={20}
                paddingTop={30}
                paddingBottom={10}
                padding={25 /* sets both */}
                ref={(ref) => (tree = ref)}
            >
                {Node}
            </Tree>
            
        </div>
    )
}

function Node({ node, style }: NodeRendererProps<any>) {
    return (
        <div
            className="flex items-center cursor-pointer"
            style={style}
            onClick={() => node.toggle()}
        >
            <span className="flex items-center">
                {node.isLeaf ? <FileText /> : node.isClosed ? <FolderClosed /> : <FolderOpen />}
            </span>
            <span className="ml-2 font-mono text-xs">
                {node.data.name}
            </span>
        </div>
    );
}

export default PackageTree;