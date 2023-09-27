// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { TreeNode } from '../types';

const handleFolders = (folders: TreeNode[]) => {
    for (const folder of folders) {
        if (folder.children) folder.children = sortTree(folder.children);
    }
}

export const sortTree = (array: TreeNode[]) => {
    const dotFolders = array.filter((item) => item.children && item.children.length > 0 && item.name.startsWith('.'));
    const capitalFolders = array.filter((item) => item.children && item.children.length > 0 && !item.name.startsWith('.') && item.name[0] === item.name[0].toUpperCase());
    const folders = array.filter((item) => item.children && item.children.length > 0 && item.name[0] !== item.name[0].toUpperCase() && !item.name.startsWith('.'));

    const dotFiles = array.filter((item) => (!item.children || item.children.length === 0) && item.name.startsWith('.'));
    const capitalFiles = array.filter((item) => (!item.children || item.children.length === 0) && !item.name.startsWith('.') && item.name[0] === item.name[0].toUpperCase());
    const files = array.filter((item) => (!item.children || item.children.length === 0) && item.name[0] !== item.name[0].toUpperCase() && !item.name.startsWith('.'));

    folders.sort((a, b) => a.name.localeCompare(b.name));
    capitalFolders.sort((a, b) => a.name.localeCompare(b.name));
    dotFolders.sort((a, b) => a.name.localeCompare(b.name));

    dotFiles.sort((a, b) => a.name.localeCompare(b.name));
    capitalFiles.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    handleFolders(folders);
    handleFolders(capitalFolders);
    handleFolders(dotFolders);
    
    return [...dotFolders, ...capitalFolders, ...folders, ...dotFiles, ...capitalFiles, ...files];
}