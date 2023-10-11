// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const GetUserRes = z.object({
    username: z.string(),
});

//-------------- POST license conclusion --------------

export const PostLicenseConclusionReq = z.object({
    concludedLicenseExpressionSPDX: z.string({
        required_error: "Concluded license expression is required",
    }),
    detectedLicenseExpressionSPDX: z.string({
        required_error: "Detected license expression is required",
    }),
    comment: z.string({
        required_error: "Comment is required",
    }),
    contextPurl: z.string({
        required_error: "Context purl is required",
    }),
    fileSha256: z.string({
        required_error: "File SHA256 is required",
    }),
});

export const PostLicenseConclusionRes = z.object({
    licenseConclusionId: z.number(),
    message: z.string(),
});

//--------------- PUT license conclusion ---------------
export const PutLicenseConclusionReq = z
    .object({
        concludedLicenseExpressionSPDX: z.string(),
        detectedLicenseExpressionSPDX: z.string(),
        comment: z.string(),
        contextPurl: z.string(),
    })
    .partial()
    .refine(
        ({
            concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX,
            comment,
            contextPurl,
        }) =>
            concludedLicenseExpressionSPDX !== undefined ||
            detectedLicenseExpressionSPDX !== undefined ||
            comment !== undefined ||
            contextPurl !== undefined,
        { message: "At least one field is required" },
    );

export const PutLicenseConclusionReqPathParams = z.string({
    required_error: "Id is required",
});

export const PutLicenseConclusionRes = z.object({
    message: z.string(),
});

//------------- DELETE license conclusion -------------
export const DeleteLicenseConclusionReqPathParams = z.string({
    required_error: "Id is required",
});

export const DeleteLicenseConclusionRes = z.object({
    message: z.string(),
});

//------------------ POST filetree -------------------
export const PostFileTreeReq = z.object({
    purl: z.string({
        required_error: "Purl is required",
    }),
});

export const FileTree = z.object({
    path: z.string(),
    packageId: z.number(),
    fileSha256: z.string(),
    file: z.object({
        licenseFindings: z.array(
            z.object({
                licenseExpressionSPDX: z.string(),
            }),
        ),
        licenseConclusions: z.array(
            z.object({
                concludedLicenseExpressionSPDX: z.string(),
            }),
        ),
    }),
});

export type FileTreeType = z.infer<typeof FileTree>;

export const PostFileTreeRes = z.object({
    filetrees: z.array(FileTree),
});

export type PostFileTreeResType = z.infer<typeof PostFileTreeRes>;

//------------------ GET packages -------------------
export const GetPackagesRes = z.object({
    packages: z.array(
        z.object({
            purl: z.string(),
            updatedAt: z.coerce.date(),
        }),
    ),
});

export type GetPackagesResType = z.infer<typeof GetPackagesRes>;

//------------------- POST file -------------------

export const PostFileReq = z.object({
    purl: z.string({
        required_error: "Purl is required",
    }),
    path: z.string({
        required_error: "Path is required",
    }),
});

export const PostFileRes = z.object({
    downloadUrl: z.string(),
    licenseFindings: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            licenseExpressionSPDX: z.string(),
            licenseFindingMatches: z.array(
                z.object({
                    id: z.number(),
                    updatedAt: z.coerce.date(),
                    licenseExpression: z.nullable(z.string()),
                    startLine: z.number(),
                    endLine: z.number(),
                    score: z.number(),
                }),
            ),
        }),
    ),
    copyrightFindings: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            copyright: z.string(),
            startLine: z.number(),
            endLine: z.number(),
        }),
    ),
    licenseConclusions: z.array(
        z.object({
            id: z.number(),
            createdAt: z.coerce.date(),
            updatedAt: z.coerce.date(),
            detectedLicenseExpressionSPDX: z.string(),
            concludedLicenseExpressionSPDX: z.string(),
            comment: z.string(),
            contextPurl: z.string(),
            user: z.object({
                username: z.string(),
            }),
        }),
    ),
});
