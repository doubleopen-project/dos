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
import { extractUniqueLicenses } from "@/helpers/extractUniqueLicenses";
import { filterTreeDataByLicense } from "@/helpers/filterTreeDataByLicense";
import { parseAsString, useQueryState } from 'next-usequerystate';

type PackageTreeProps = {
    data: TreeNode[];
}

const PackageTree = ({data}: PackageTreeProps) => {

    // TODO: fix useEffect to resize the tree

    const [treeFilter, setTreeFilter] = useState('');
    const [licenseFilter, setLicenseFilter] = useQueryState('licenseFilter', parseAsString.withDefault(''));
    const [isExpanded, setIsExpanded] = useState(false);
    const [treeHeight, setTreeHeight] = useState(0);
    const [treeData, setTreeData] = useState<TreeNode[]>(data);
    const [originalTreeData, setOriginalTreeData] = useState<TreeNode[]>(data);
    const treeRef = useRef<HTMLDivElement>(null);

    const handleTreeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTreeFilter(event.target.value);
    };

    const handleLicenseFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLicenseFilter(event.target.value);
        if (event.target.value === '') {
            setLicenseFilter(null);
        }
    };

    let tree: any;
    //console.log(extractUniqueLicenses(treeData));

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
    
    // Update tree data when the license search text is changed
    useEffect(() => {
        if (licenseFilter) {
            let updatedTreeData = JSON.parse(JSON.stringify(treeData));  // Create a deep copy
            updateHasLicenseFindings(updatedTreeData, licenseFilter);  // Update hasLicenseFindings flag
            
            // Filter the tree based on the licenseSearchText
            updatedTreeData = filterTreeDataByLicense(updatedTreeData, licenseFilter);
            
            setTreeData(updatedTreeData);  // Set the updated and/or filtered tree data to trigger a re-render
        } else {
            // Reset to original tree data if licenseFilter is empty
            setTreeData(originalTreeData);
        }
    }, [licenseFilter, originalTreeData]);    

    // Return the whole original tree data when the license search text is empty
    useEffect(() => {
        setOriginalTreeData(data);
    }, []);

    return (
        <div className="flex flex-col h-full">
            
            <div className="p-2 mb-2 rounded-md bg-white shadow flex items-center text-sm">
                <input className='bg-gray-200 p-2 rounded-lg w-full' 
                    type='text' 
                    placeholder='Filter' 
                    value={treeFilter}
                    onChange={handleTreeFilter} 
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
                    searchTerm={treeFilter}
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
                    value={licenseFilter}
                    onChange={handleLicenseFilter}
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
    const { hasLicenseFindings, name, fileSha256 } = data;
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
            onClick={() => {
                if (isLeaf) {
                    console.log("Name =", name, " SHA256 =", fileSha256);
                } else { 
                    node.toggle()
                }
            }}>
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