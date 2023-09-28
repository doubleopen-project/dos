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
import { updateHasLicenseFindings } from "@/helpers/updateHasLicenseFindings";

const PackageTree = ({data: initialData}:{data:TreeNode[]}) => {

    // TODO: fix useEffect to resize the tree

    const [fileSearchText, setFileSearchText] = useState('');
    const [licenseSearchText, setLicenseSearchText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [treeHeight, setTreeHeight] = useState(0);
    const [treeData, setTreeData] = useState<TreeNode[]>(initialData); // TODO: use data from props
    const treeRef = useRef<HTMLDivElement>(null);

    const handleFileSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileSearchText(event.target.value);
    };

    const handleLicenseSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLicenseSearchText(event.target.value);
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
    
    // Update `hasLicenseFindings` whenever `licenseSearchText` changes
    useEffect(() => {
        const updatedTreeData = JSON.parse(JSON.stringify(treeData));  // Create a deep copy
        updateHasLicenseFindings(updatedTreeData, licenseSearchText);
        setTreeData(updatedTreeData);  // Set the updated tree data to trigger a re-render
    }, [licenseSearchText]);

    return (
        <div className="flex flex-col h-full">
            
            <div className="p-2 mb-2 rounded-md bg-white shadow flex items-center text-sm">
                <input className='bg-gray-200 p-2 rounded-lg w-full' 
                    type='text' 
                    placeholder='Filter' 
                    value={fileSearchText}
                    onChange={handleFileSearch} 
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
                    data={treeData}
                    openByDefault={false}
                    searchTerm={fileSearchText}
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
                    value={licenseSearchText}
                    onChange={handleLicenseSearch} 
                />
                <button className='bg-violet-300 text-xs hover:bg-gray-400 p-2 rounded-lg ml-2'>
                    {"V"}
                </button>
            </div>
        </div>
    )
}

function Node({ node, style }: NodeRendererProps<any>) {
    const { isLeaf, isClosed, data } = node;
    const { hasLicenseFindings, name } = data;
    const boldStyle = {strokeWidth: 0.5};
    let icon;
    
    if (isLeaf) {
        icon = hasLicenseFindings ? <FileText color="red" style={boldStyle} /> : <FileText />;
    } else if (isClosed) {
        icon = hasLicenseFindings ? <FolderClosed color="red" style={boldStyle} /> : <FolderClosed />;
    } else {
        icon = hasLicenseFindings ? <FolderOpen color="red" style={boldStyle} /> : <FolderOpen />;
    }
    
    return (
        <div
            className="flex items-center cursor-pointer"
            style={style}
            onClick={() => node.toggle()}
        >
            <span className="flex items-center">
                {icon}
            </span>
            <span className="ml-1 font-mono text-xs">
                {name}
            </span>
        </div>
    );
}

export default PackageTree;