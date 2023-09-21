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

const data = {
    "files": [
        {
            "path": ".npmignore",
            "fileSha256": "c294862216027baf6ec05e9fbef5350fcf95789b5aacbd4afc587222e5410d94"
        },
        {
            "path": ".travis.yml",
            "fileSha256": "4856acb9b5f25d183baf1a3b2b4c569b513115748ecf0f064443a9d123d6e044"
        },
        {
            "path": "bin/download-node-tests.js",
            "fileSha256": "74a493722b5fce5ddad7b74c2f714922fbd8dfc73102906378849890faa38d42"
        },
        {
            "path": "perf/bracket-notation.js",
            "fileSha256": "8955fa3e0ca9c0d5d2ff31ec720ec9ae632395c817e0836ead7b4014d79d61e4"
        },
        {
            "path": "perf/concat.js",
            "fileSha256": "9d9c7e3333d4de15e608fc91b63431208bbc41fefdd5ae956ea6caeb9bdb920c"
        },
        {
            "path": "perf/copy-big.js",
            "fileSha256": "e7e1580e9347fd86ae6260e27389e48c3b3738f6b331a0cf55468ef0e3b14bd8"
        },
        {
            "path": "perf/writeUtf8.js",
            "fileSha256": "c9a2ca030f471ae25739fe2f08b2c3e6ae63c684aea03683de5422e288e39b59"
        },
        {
            "path": "test/_polyfill.js",
            "fileSha256": "2d9001b8a96ad53e13e0d38406bd8a7c6bbd432dd705bb6993ed00620874b3a8"
        },
        {
            "path": "test/base64.js",
            "fileSha256": "0b9cf24547d72d6e2c52be885b26cd95b79cd2ed65d894854e3b31cc199b8edc"
        },
        {
            "path": "test/static.js",
            "fileSha256": "4659b1a29b898bf6b8bc018c76bb51ccd6f0643e6c33c38fb2315fd7bb407e0b"
        },
        {
            "path": "test/to-string.js",
            "fileSha256": "ef7520e03a197b0ff4fb9e614c9eb0afca9ccb4c0d3d7564c04c582d3258f58a"
        },
        {
            "path": "test/write.js",
            "fileSha256": "1815c81eeb22a13c64091d24751d4234ddd397b2f7762ec667b4924bb0ec5aab"
        },
        {
            "path": "test/write_infinity.js",
            "fileSha256": "7afe0281328032b7f3fb46d772d2aa47fed9240e499d98b2c36c6e72084b64a2"
        },
        {
            "path": "test/node/test-buffer-alloc.js",
            "fileSha256": "4cf9e79dd125acb25bf48628984ea7ce60a8c31f813046052fb74cc8bc439e68"
        },
        {
            "path": "test/node/test-buffer-inspect.js",
            "fileSha256": "89ee65f509c1c9f56bdaad5f7544fd1b427a90b46da5f70bd23dec06148afe15"
        },
        {
            "path": "test/node/test-buffer-zero-fill-reset.js",
            "fileSha256": "461b9fac069dcaece188cf0c1d3d93eb6454695b410a50cf7af34a4863207169"
        },
        {
            "path": "test/node/test-buffer.js",
            "fileSha256": "c7f5d157d8de6737b84feceb8f1e3285d18b2cbc8114717bc012ad78761b5af3"
        }
    ]
};

// Convert the JSON
const convertedData = convertJsonToTree(data.files);

const PackageTree = () => {

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