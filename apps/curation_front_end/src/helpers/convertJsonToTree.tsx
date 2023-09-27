// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import type { FileTreeType } from 'validation-helpers';
import type { TreeNode } from '../types';
import { sortTree } from './sortTree';

export const convertJsonToTree = (filetrees: FileTreeType[]): TreeNode[] => {
    let id = 1; // Initialize a unique ID counter
    const root: TreeNode[] = []; // Initialize an empty root
    const map: { [key: string]: TreeNode } = {}; // Maintain a mapping from directory name to TreeNode object
  
    for (const fileTree of filetrees) {
        const pathParts = fileTree.path.split('/');
        let currentNode: TreeNode[] = root;
        let fullPath = '';
    
        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            const isLastPart = i === pathParts.length - 1;
    
            fullPath += (i > 0 ? '/' : '') + part;

            if (!map[fullPath]) {
            const newNode: TreeNode = { id: id.toString(), name: part };
            id++;
            if (!isLastPart) {
                newNode.children = [];
            }
            map[fullPath] = newNode;
            currentNode.push(newNode);
            }
    
            if (!isLastPart) {
            currentNode = map[fullPath].children!;
            }
        }    
    }
    
    return sortTree(root);
}; 
