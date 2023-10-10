// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import type { FileTreeType } from "validation-helpers";
import type { TreeNode } from "../types";
import { sortTree } from "./sortTree";

export const convertJsonToTree = (filetrees: FileTreeType[]): TreeNode[] => {
  let id = 1; // Initialize a unique ID counter
  const root: TreeNode[] = []; // Initialize an empty root
  const map: { [key: string]: TreeNode } = {}; // Maintain a mapping from directory name to TreeNode object

  for (const fileTree of filetrees) {
    const pathParts = fileTree.path.split("/");
    let currentNode: TreeNode[] = root;
    let fullPath = "";

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLastPart = i === pathParts.length - 1;

      fullPath += (i > 0 ? "/" : "") + part;

      if (!map[fullPath]) {
        const newNode: TreeNode = {
          id: id.toString(),
          name: part,
          path: isLastPart ? fileTree.path : undefined,
          fileSha256: isLastPart ? fileTree.fileSha256 : undefined,
          hasLicenseFindings: false,
          file: {
            licenseFindings: isLastPart ? fileTree.file.licenseFindings : [],
          },
        };

        // If this is a leaf node and there are any license findings, mark the node
        if (isLastPart && fileTree.file.licenseFindings.length > 0) {
          newNode.hasLicenseFindings = true;
        }

        id++;

        if (!isLastPart) {
          newNode.children = [];
        }

        map[fullPath] = newNode;
        currentNode.push(newNode);
      } else if (isLastPart) {
        // Merge licenseFindings for existing nodes
        map[fullPath].file?.licenseFindings?.push(
          ...fileTree.file.licenseFindings,
        );
        if (fileTree.file.licenseFindings.length > 0) {
          map[fullPath].hasLicenseFindings = true;
        }
      }

      // Propagate the hasLicenseFindings flag to ancestor directories
      if (fileTree.file.licenseFindings.length > 0) {
        let ancestorPath = "";
        for (let j = 0; j <= i; j++) {
          ancestorPath += (j > 0 ? "/" : "") + pathParts[j];
          if (map[ancestorPath]) {
            map[ancestorPath].hasLicenseFindings = true;
          }
        }
      }

      if (!isLastPart) {
        currentNode = map[fullPath].children!;
      }
    }
  }

  return sortTree(root);
};
