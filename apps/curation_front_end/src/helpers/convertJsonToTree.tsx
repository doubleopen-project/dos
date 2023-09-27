// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

type FileObject = {
    path: string;
    fileSha256: string;
};
  
type TreeNode = {
    id: string;
    name: string;
    children?: TreeNode[];
};

export const convertJsonToTree = (files: FileObject[]): TreeNode[] => {
    let id = 1; // Initialize a unique ID counter
    const root: TreeNode[] = []; // Initialize an empty root
    const map: { [key: string]: TreeNode } = {}; // Maintain a mapping from directory name to TreeNode object
  
    for (const file of files) {
        const pathParts = file.path.split('/');
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
    return root;
}; 
