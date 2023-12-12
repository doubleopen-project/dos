// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import isGlob from "is-glob";
import { z } from "zod";
import {
    getPasswordSchema,
    getUsernameSchema,
    purlSchema,
} from "./common_schemas";

export const GetUserRes = z.object({
    username: z.string(),
    role: z.string(),
});

//------------------ PUT user -------------------

export const PutUserReq = z
    .object({
        username: getUsernameSchema(false),
        password: getPasswordSchema(false),
    })
    .partial();

export const PutUserRes = z.object({
    message: z.string(),
});

//------------------ GET license conclusion -------------------
export const GetLicenseConclusionsRes = z.object({
    licenseConclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            user: z.object({ username: z.string() }),
            bulkCurationId: z.nullable(z.number()),
            sha256: z.string(),
            contextPurl: z.string(),
            affectedPaths: z.object({
                inContextPurl: z.array(
                    z.object({
                        path: z.string(),
                    }),
                ),
                additionalMatches: z.array(
                    z.object({
                        path: z.string(),
                        purl: z.string(),
                    }),
                ),
            }),
        }),
    ),
});

//-------------- POST license conclusion --------------

export const PostLicenseConclusionReq = z.object({
    concludedLicenseExpressionSPDX: z
        .string({
            required_error: "Concluded license expression is required",
        })
        .trim()
        .min(1, "Concluded license expression (SPDX) cannot be empty"),
    detectedLicenseExpressionSPDX: z.nullable(z.string()).optional(),
    comment: z.string().optional(),
    local: z.boolean().optional(),
    contextPurl: z
        .string({
            required_error: "Context purl is required",
        })
        .trim()
        .min(1, "Context purl cannot be empty"),
    fileSha256: z
        .string({
            required_error: "File SHA256 is required",
        })
        .trim()
        .min(1, "File SHA256 cannot be empty"),
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
        local: z.boolean(),
    })
    .partial()
    .refine(
        ({
            concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX,
            comment,
            local,
        }) =>
            concludedLicenseExpressionSPDX !== undefined ||
            detectedLicenseExpressionSPDX !== undefined ||
            comment !== undefined ||
            local !== undefined,
        { message: "At least one field is required" },
    );

export const PutLicenseConclusionRes = z.object({
    message: z.string(),
});

//------------- DELETE license conclusion -------------

export const DeleteLicenseConclusionRes = z.object({
    message: z.string(),
});

//------------------ GET all bulk curations -------------------
export const GetBulkCurationsRes = z.object({
    bulkCurations: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.nullable(z.string()),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            contextPurl: z.string(),
            licenseConclusions: z.array(
                z.object({
                    id: z.number(),
                    sha256: z.string(),
                    affectedPaths: z.object({
                        inContextPurl: z.array(z.string()),
                        additionalMatches: z.array(
                            z.object({
                                path: z.string(),
                                purl: z.string(),
                            }),
                        ),
                    }),
                }),
            ),
            user: z.object({
                username: z.string(),
            }),
        }),
    ),
});

//-------------- GET bulk curation --------------
export const GetBulkCurationRes = z.object({
    pattern: z.nullable(z.string()),
    concludedLicenseExpressionSPDX: z.string(),
    detectedLicenseExpressionSPDX: z.nullable(z.string()),
    comment: z.nullable(z.string()),
    filePaths: z.array(z.string()),
    licenseConclusions: z.array(
        z.object({
            id: z.number(),
        }),
    ),
});

//-------------- POST bulk curation --------------

export const PostBulkCurationReq = z.object({
    pattern: z
        .string({
            required_error: "Pattern is required",
        })
        .trim()
        .min(1, "Pattern cannot be empty")
        .refine((pattern) => isGlob(pattern), {
            message: "Pattern is not a valid glob pattern",
        }),
    concludedLicenseExpressionSPDX: z
        .string({
            required_error: "Concluded license expression is required",
        })
        .trim()
        .min(1, "Concluded license expression (SPDX) cannot be empty"),
    detectedLicenseExpressionSPDX: z.nullable(z.string()).optional(),
    comment: z.string().optional(),
    local: z.boolean().optional(),
    purl: z
        .string({
            required_error: "Purl is required",
        })
        .trim()
        .min(1, "Purl cannot be empty"),
});

export const PostBulkCurationRes = z.object({
    bulkCurationId: z.number(),
    matchedPathsCount: z.number(),
    addedLicenseConclusionsCount: z.number(),
    affectedFilesInPackageCount: z.number(),
    affectedFilesAcrossAllPackagesCount: z.number(),
    message: z.string(),
});

//--------------- PUT bulk curation ---------------
export const PutBulkCurationReq = z
    .object({
        pattern: z.string(),
        concludedLicenseExpressionSPDX: z.string(),
        detectedLicenseExpressionSPDX: z.string(),
        comment: z.string(),
    })
    .partial();

export const PutBulkCurationRes = z.object({
    message: z.string(),
});

//------------- DELETE bulk curation -------------

export const DeleteBulkCurationRes = z.object({
    message: z.string(),
});

//-------------- POST bulk curations --------------

export const PostBulkCurationsReq = z.object({
    purl: purlSchema,
});

export const PostBulkCurationsRes = z.object({
    bulkCurations: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            licenseConclusions: z.array(
                z.object({
                    id: z.number(),
                    file: z.object({
                        sha256: z.string(),
                        filetrees: z.array(
                            z.object({
                                path: z.string(),
                            }),
                        ),
                    }),
                }),
            ),
            user: z.object({
                username: z.string(),
            }),
        }),
    ),
});

//------------------ GET path exclusions -------------------
export const GetPathExclusionsRes = z.object({
    pathExclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.string(),
            reason: z.string(),
            comment: z.nullable(z.string()),
            user: z.object({
                username: z.string(),
            }),
            purl: z.string(),
            affectedPaths: z.array(z.string()),
        }),
    ),
});

//------------------ POST path exclusion --------------
export const validReasons = [
    "BUILD_TOOL_OF",
    "DATA_FILE_OF",
    "DOCUMENTATION_OF",
    "EXAMPLE_OF",
    "OPTIONAL_COMPONENT_OF",
    "OTHER",
    "PROVIDED_BY",
    "TEST_OF",
    "TEST_TOOL_OF",
];

export const PostPathExclusionReq = z.object({
    purl: z
        .string({
            required_error: "Purl is required",
        })
        .trim()
        .min(1, "Purl cannot be empty"),
    pattern: z
        .string({
            required_error: "Pattern is required",
        })
        .trim()
        .min(1, "Pattern cannot be empty"),
    reason: z
        .string({
            required_error: "Reason is required",
        })
        .trim()
        .min(1, "Reason cannot be empty")
        .refine((reason) => validReasons.includes(reason), {
            message:
                "Reason is invalid. Accepted values are: " +
                validReasons.join(", "),
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

//------------------ POST path-exclusions -------------------

export const PostPathExclusionsReq = z.object({
    purl: purlSchema,
});

export const PostPathExclusionsRes = z.object({
    pathExclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.string(),
            reason: z.string(),
            comment: z.nullable(z.string()),
            user: z.object({
                username: z.string(),
            }),
        }),
    ),
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
            version: z.nullable(z.string()),
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
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            concludedLicenseExpressionSPDX: z.string(),
            comment: z.nullable(z.string()),
            contextPurl: z.string(),
            user: z.object({
                username: z.string(),
            }),
            bulkCurationId: z.nullable(z.number()),
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
