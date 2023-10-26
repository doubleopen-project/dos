// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";
import { passwordStrength } from "check-password-strength";

export const GetUserRes = z.object({
    username: z.string(),
    role: z.string(),
});

//------------------ PUT user -------------------

export const PutUserReq = z
    .object({
        username: z
            .string()
            .trim()
            .min(1, "Username cannot be empty")
            .max(20, "Username cannot be longer than 20 characters")
            .refine((username) => !username.includes(" "), {
                message: "Username cannot contain spaces",
            })
            .refine((username) => username.match(/^[a-z0-9]+$/i), {
                message:
                    "Username must be alphanumeric ie. contain only letters and numbers",
            })
            .refine(
                (username) =>
                    username.toLowerCase() !== "admin" &&
                    username.toLowerCase() !== "root",
                {
                    message: "The chosen username is not allowed",
                },
            ),
        password: z
            .string()
            .trim()
            .min(8, "Password has to be at least 8 characters long")
            .refine((password) => passwordStrength(password).id > 1, {
                message: "Password is too weak",
            }),
    })
    .partial();

export const PutUserRes = z.object({
    message: z.string(),
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

export const PutLicenseConclusionRes = z.object({
    message: z.string(),
});

//------------- DELETE license conclusion -------------

export const DeleteLicenseConclusionRes = z.object({
    message: z.string(),
});

//------------------ POST path exclusion --------------

export const PostPathExclusionReq = z.object({
    purl: z.string({
        required_error: "Purl is required",
    }),
    pattern: z.string({
        required_error: "Pattern is required",
    }),
    reason: z.string({
        required_error: "Reason is required",
    }),
    comment: z.nullable(z.string()).optional(),
});

export const PostPathExclusionRes = z.object({
    pathExclusionId: z.number(),
    message: z.string(),
});

//------------- DELETE path exclusion -------------

export const DeletePathExclusionRes = z.object({
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
            name: z.string(),
            version: z.string(),
            type: z.string(),
            namespace: z.nullable(z.string()),
            qualifiers: z.nullable(z.string()),
            subpath: z.nullable(z.string()),
        }),
    ),
});

//------------------- POST file -------------------

export const PostFileReq = z
    .object({
        purl: z.string(),
        path: z.string(),
        sha256: z.string(),
    })
    .partial()
    .refine(
        ({ purl, path, sha256 }) =>
            (purl !== undefined && path !== undefined) || sha256 !== undefined,
        { message: "Either purl and path or sha256 is required" },
    );

export const PostFileRes = z.object({
    sha256: z.string(),
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

//------------------ PUT token -------------------

export const PutTokenRes = z.object({
    token: z.string(),
});

//------------------ General path params -------------------

export const PathParamIdInteger = z.number({
    required_error: "Id is required",
});
