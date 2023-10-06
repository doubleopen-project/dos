// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

//------------------ POST filetree -------------------
export const PostFileTreeReq = z.object({
    purl: z.string({
        required_error: 'Purl is required'
    })
})

export const FileTree = z.object({
    path: z.string(),
    packageId: z.number(),
    fileSha256: z.string(),
    file: z.object({
        licenseFindings: z.array(z.object({
            licenseExpressionSPDX: z.string(),
        })),
    }),
})

export type FileTreeType = z.infer<typeof FileTree>

export const PostFileTreeRes = z.object({
    filetrees: z.array(FileTree)
})

export type PostFileTreeResType = z.infer<typeof PostFileTreeRes>

//------------------ GET packages -------------------
export const GetPackagesRes = z.object({
    packages: z.array(z.object({
        purl: z.string(),
        updatedAt: z.coerce.date(),
    }))
})

export type GetPackagesResType = z.infer<typeof GetPackagesRes>

//------------------- POST file -------------------

export const PostFileReq = z.object({
    purl: z.string({
        required_error: 'Purl is required'
    }),
    path: z.string({
        required_error: 'Path is required'
    })
})

export const PostFileRes = z.object({
    downloadUrl: z.string(),
    licenseFindings: z.array(z.object({
        id: z.number(),
        updatedAt: z.coerce.date(),
        licenseExpressionSPDX: z.string(),
        licenseFindingMatches: z.array(z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            licenseExpression: z.nullable(z.string()),
            startLine: z.number(),
            endLine: z.number(),
            score: z.number(),
        })),
    })),
    copyrightFindings: z.array(z.object({
        id: z.number(),
        updatedAt: z.coerce.date(),
        copyright: z.string(),
        startLine: z.number(),
        endLine: z.number(),
    })),
})