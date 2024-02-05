// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import isGlob from "is-glob";
import { parseSPDX } from "spdx-validation";
import { z } from "zod";
import { getPasswordSchema, getUsernameSchema } from "./common_schemas";

const concludedLicenseExpressionSPDX = z
    .string({
        required_error: "Concluded license expression is required",
    })
    .trim()
    .min(1, "Concluded license expression (SPDX) cannot be empty")
    .refine(
        (concludedLicenseExpressionSPDX) => {
            try {
                parseSPDX(concludedLicenseExpressionSPDX);
                return true;
            } catch (e) {
                return false;
            }
        },

        { message: "Invalid SPDX expression" },
    )
    .or(z.enum(["NONE", "NOASSERTION"]));

//------------------ GET user -------------------

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
            local: z.boolean(),
            user: z.object({ username: z.string() }),
            bulkConclusionId: z.nullable(z.number()),
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

//-------------- GET license conclusions for file --------------

export const GetLicenseConclusionsForFileRes = z.object({
    licenseConclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            local: z.boolean(),
            contextPurl: z.string(),
            user: z.object({ username: z.string() }),
            bulkConclusionId: z.nullable(z.number()),
        }),
    ),
});

//-------------- POST license conclusion --------------

export const PostLicenseConclusionReq = z.object({
    concludedLicenseExpressionSPDX: concludedLicenseExpressionSPDX,
    detectedLicenseExpressionSPDX: z.nullable(z.string()).optional(),
    comment: z.string().optional(),
    local: z.boolean().optional(),
});

export const PostLicenseConclusionRes = z.object({
    licenseConclusionId: z.number(),
    message: z.string(),
});

//--------------- PUT license conclusion ---------------
export const PutLicenseConclusionReq = z
    .object({
        concludedLicenseExpressionSPDX: concludedLicenseExpressionSPDX,
        detectedLicenseExpressionSPDX: z.string(),
        comment: z.nullable(z.string()),
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

//------------------ GET all bulk conclusions -------------------
export const GetBulkConclusionsRes = z.object({
    bulkConclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.nullable(z.string()),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            contextPurl: z.string(),
            local: z.boolean(),
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

//-------------- GET bulk conclusion --------------
export const GetBulkConclusionRes = z.object({
    pattern: z.nullable(z.string()),
    concludedLicenseExpressionSPDX: z.string(),
    detectedLicenseExpressionSPDX: z.nullable(z.string()),
    comment: z.nullable(z.string()),
    local: z.boolean(),
    filePaths: z.array(z.string()),
    licenseConclusions: z.array(
        z.object({
            id: z.number(),
        }),
    ),
});

//-------------- POST bulk conclusion --------------

export const PostBulkConclusionReq = z.object({
    pattern: z
        .string({
            required_error: "Pattern is required",
        })
        .trim()
        .min(1, "Pattern cannot be empty")
        .refine((pattern) => isGlob(pattern), {
            message: "Pattern is not a valid glob pattern",
        }),
    concludedLicenseExpressionSPDX: concludedLicenseExpressionSPDX,
    detectedLicenseExpressionSPDX: z.nullable(z.string()).optional(),
    comment: z.string().optional(),
    local: z.boolean().optional(),
});

export const PostBulkConclusionRes = z.object({
    bulkConclusionId: z.number(),
    matchedPathsCount: z.number(),
    addedLicenseConclusionsCount: z.number(),
    affectedFilesInPackageCount: z.number(),
    affectedFilesAcrossAllPackagesCount: z.number(),
    message: z.string(),
});

//--------------- PUT bulk conclusion ---------------
export const PutBulkConclusionReq = z
    .object({
        pattern: z.string(),
        concludedLicenseExpressionSPDX: concludedLicenseExpressionSPDX,
        detectedLicenseExpressionSPDX: z.string(),
        comment: z.nullable(z.string()),
        local: z.boolean(),
    })
    .partial();

export const PutBulkConclusionRes = z.object({
    message: z.string(),
});

//------------- DELETE bulk conclusion -------------

export const DeleteBulkConclusionRes = z.object({
    message: z.string(),
});

//-------------- GET bulk conclusions by purl --------------

export const GetBulkConclusionsByPurlRes = z.object({
    bulkConclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            local: z.boolean(),
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

//------------------ GET path exclusions count -------------------
export const QueryParamFilterPEBy = z
    .enum(["pattern", "reason", "comment", "purl"])
    .optional();

// -------------------------------------------------
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

//--------------- PUT path exclusion ---------------
export const PutPathExclusionReq = z
    .object({
        pattern: z.string().min(1, "Pattern cannot be empty"),
        reason: z.string().refine((reason) => validReasons.includes(reason), {
            message:
                "Reason is invalid. Accepted values are: " +
                validReasons.join(", "),
        }),
        comment: z.string(),
    })
    .partial();

export const PutPathExclusionRes = z.object({
    message: z.string(),
});

//------------------ POST path exclusion --------------

export const PostPathExclusionReq = z.object({
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
export const QueryParamSortPkgBy = z
    .enum([
        "purl",
        "name",
        "version",
        "type",
        "namespace",
        "createdAt",
        "updatedAt",
    ])
    .optional();

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

//------------------ GET packages count -------------------
export const QueryParamFilterPkgBy = z
    .enum(["name", "namespace", "type", "purl"])
    .optional();

//------------------ PUT token -------------------

export const PutTokenRes = z.object({
    token: z.string(),
});

//------------------ GET file -------------------
export const GetFileRes = z.object({
    sha256: z.string(),
    downloadUrl: z.string(),
});

//------------------ GET license-findings -------------------

export const GetLicenseFindingsForFileRes = z.object({
    licenseFindings: z.array(
        z.object({
            id: z.number(),
            createdAt: z.coerce.date(),
            updatedAt: z.coerce.date(),
            licenseExpressionSPDX: z.string(),
            scanner: z.string(),
            scannerConfig: z.string(),
            licenseFindingMatches: z.array(
                z.object({
                    id: z.number(),
                    createdAt: z.coerce.date(),
                    updatedAt: z.coerce.date(),
                    licenseExpression: z.nullable(z.string()),
                    startLine: z.number(),
                    endLine: z.number(),
                    score: z.number(),
                }),
            ),
        }),
    ),
});
