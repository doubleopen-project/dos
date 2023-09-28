// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useRef, useEffect } from 'react';
import { Tree, NodeRendererProps } from 'react-arborist';
import {
    BsFileText as FileText,
    BsFolder as FolderClosed,
    BsFolder2Open as FolderOpen
} from 'react-icons/bs';
import type { TreeNode } from "@/types/index";

const PackageTree = ({data}:{data:TreeNode[]}) => {

    // TODO: fix useEffect to resize the tree

    const [searchText, setSearchText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [treeHeight, setTreeHeight] = useState(0);
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

    const handleResize = () => {
        if (treeRef.current) {
            const { offsetHeight } = treeRef.current;
            setTreeHeight(offsetHeight);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);
    
    return (
        <div className="flex flex-col h-full">
            
            <div className="p-2 mb-2 rounded-md bg-white shadow flex items-center text-sm">
                <input className='bg-gray-200 p-2 rounded-lg w-full' 
                    type='text' 
                    placeholder='Filter' 
                    value={searchText}
                    onChange={handleSearch} 
                />
                <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'
                    onClick={handleExpand}
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
                <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                    {"<-"}
                </button>
                <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                    {"->"}
                </button>
            </div>

            <div className="flex-1 pl-1 overflow-auto bg-gray-100"  ref={treeRef}>
                <Tree
                    data={data}
                    openByDefault={false}
                    searchTerm={searchText}
                    searchMatch={(node, term) => 
                        node.data.name.toLowerCase().includes(term.toLowerCase())
                    }
                    width="100%"
                    height={treeHeight}
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

            <div className="p-2 mt-2 rounded-md bg-white shadow flex items-center text-sm">
                <input className='bg-gray-200 p-2 rounded-lg w-full' 
                    type='text' 
                    placeholder='Filter with a detected license' 
                />
                <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                    {"V"}
                </button>
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
                {
                    node.isLeaf ? node.data.hasLicenseFindings ? <FileText color="red" /> : <FileText /> : 
                    node.isClosed ? node.data.hasLicenseFindings ? <FolderClosed color="red" /> : <FolderClosed /> : 
                    node.data.hasLicenseFindings ? <FolderOpen color="red" /> : <FolderOpen />
                }
            </span>
            <span className="ml-1 font-mono text-xs">
                {node.data.name}
            </span>
        </div>
    );
}

export default PackageTree;