// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useRef, useEffect } from 'react';
import { convertJsonToTree } from '@/helpers/convertJsonToTree';
import { Tree, NodeRendererProps } from 'react-arborist';
import {
    BsFileText as FileText,
    BsFolder as FolderClosed,
    BsFolder2Open as FolderOpen
} from 'react-icons/bs';
import type { PostFileTreeResType } from 'validation-helpers'

const PackageTree = ({data}:{data:PostFileTreeResType}) => {
    
    // Convert the JSON
    const convertedData = convertJsonToTree(data.files);

    const [searchText, setSearchText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const treeRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleResize = () => {
            if (treeRef.current) {
                const { offsetWidth, offsetHeight } = treeRef.current;
                treeRef.current.style.width = `${offsetWidth}px`;
                const innerScrollContainer = treeRef.current.querySelector('.ReactVirtualized__Grid__innerScrollContainer') as HTMLElement;
                if (innerScrollContainer) {
                    innerScrollContainer.style.height = `${offsetHeight}px`;
                }
            }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='w-full relative lg:h-[90vh] h-[70vh] overflow-y-auto m-auto p-4 border rounded-lg bg-white' ref={treeRef}>

            <div className='flex items-center text-sm'>
                <input
                    type='text'
                    placeholder='Search'
                    className='bg-gray-200 p-2 rounded-lg w-full'
                    value={searchText}
                    onChange={handleSearch}
                />
                <button 
                    className='bg-gray-200 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'
                    onClick={handleExpand}
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>

            <div className='flex h-full'>
                <Tree
                    data={convertedData}
                    openByDefault={false}
                    searchTerm={searchText}
                    searchMatch={(node, term) => 
                        node.data.name.toLowerCase().includes(term.toLowerCase())
                    }
                    width={treeRef.current?.offsetWidth || 0}
                    height={treeRef.current?.offsetHeight || 0}
                    indent={12}
                    rowHeight={20}
                    paddingTop={30}
                    paddingBottom={10}
                    padding={25}
                    ref={(t) => (tree = t)}
                >
                    {Node}
                </Tree>
            </div>

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