// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { parseSPDX } from "spdx-validation";
import { z } from "zod";
import {
    bcPatternGlobSchema,
    pePatternGlobSchema,
} from "../../param_schemas/pattern_schemas";
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
                // Disable eslint rule for unused variable as the error needs to be caught, but not used.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
    })
    .partial();

export const PutUserRes = z.object({
    message: z.string(),
});

//-------- GET clearance groups for user ---------

export const GetUserClearanceGroupsRes = z.object({
    writer: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        }),
    ),
    reader: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        }),
    ),
});

//------------------ GET license conclusion -------------------
export const QueryParamSortLCBy = z
    .enum([
        "contextPurl",
        "username",
        "detectedLicenseExpressionSPDX",
        "concludedLicenseExpressionSPDX",
        "comment",
        "local",
        "createdAt",
        "updatedAt",
    ])
    .optional();

export const GetLicenseConclusionsRes = z.object({
    licenseConclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            local: z.boolean(),
            curator: z.object({ username: z.string() }),
            bulkConclusionId: z.nullable(z.number()),
            fileSha256: z.string(),
            contextPurl: z.string(),
        }),
    ),
});

//--------- GET affected files for license conclusion ----------

export const GetAffectedFilesForLicenseConclusionRes = z.object({
    affectedFiles: z.object({
        inContextPurl: z.array(
            z.object({
                path: z.string(),
                package: z.object({
                    purl: z.string(),
                }),
            }),
        ),
        additionalMatches: z.array(
            z.object({
                path: z.string(),
                package: z.object({
                    purl: z.string(),
                }),
            }),
        ),
        inQueryPurl: z.array(
            z.object({
                path: z.string(),
                package: z.object({
                    purl: z.string(),
                }),
            }),
        ),
    }),
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
            curator: z.object({ username: z.string() }),
            bulkConclusionId: z.nullable(z.number()),
        }),
    ),
});

//-------------- POST license conclusion --------------

export const PostLicenseConclusionReq = z.object({
    concludedLicenseExpressionSPDX: concludedLicenseExpressionSPDX,
    clearanceGroupId: z.number(),
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

//------------------ GET bulk conclusions -------------------
export const QueryParamSortBCBy = z
    .enum([
        "pkg",
        "username",
        "pattern",
        "detectedLicenseExpressionSPDX",
        "concludedLicenseExpressionSPDX",
        "comment",
        "local",
        "createdAt",
        "updatedAt",
    ])
    .optional();

export const GetBulkConclusionsRes = z.object({
    bulkConclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.nullable(z.string()),
            concludedLicenseExpressionSPDX: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            comment: z.nullable(z.string()),
            local: z.boolean(),
            package: z.object({
                purl: z.string(),
            }),
            curator: z.object({
                username: z.string(),
            }),
        }),
    ),
});

//-------------- GET bulk conclusion affected files --------------
export const GetAffectedFilesForBulkConclusionRes = z.object({
    affectedFiles: z.object({
        inContextPurl: z.array(z.string()),
        additionalMatches: z.array(
            z.object({
                path: z.string(),
                purl: z.string(),
            }),
        ),
        inQueryPurl: z.array(z.string()),
    }),
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
    pattern: bcPatternGlobSchema,
    concludedLicenseExpressionSPDX: concludedLicenseExpressionSPDX,
    clearanceGroupId: z.number(),
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
        pattern: bcPatternGlobSchema,
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
            package: z.object({
                purl: z.string(),
            }),
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
            curator: z.object({
                username: z.string(),
            }),
        }),
    ),
});

//------------------ GET path exclusions -------------------
export const QueryParamSortPEBy = z
    .enum([
        "pkg",
        "pattern",
        "reason",
        "comment",
        "username",
        "createdAt",
        "updatedAt",
    ])
    .optional();

export const GetPathExclusionsRes = z.object({
    pathExclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.string(),
            reason: z.string(),
            comment: z.nullable(z.string()),
            curator: z.object({
                username: z.string(),
            }),
            package: z.object({
                purl: z.string(),
            }),
        }),
    ),
});

// -------------------------------------------------
export const validReasons = [
    {
        name: "BUILD_TOOL_OF",
        description:
            "The path only contains tools used for building source code which are not included in distributed build artifacts.",
    },
    {
        name: "DATA_FILE_OF",
        description:
            "The path only contains data files such as fonts or images which are not included in distributed build artifacts.",
    },
    {
        name: "DOCUMENTATION_OF",
        description:
            "The path only contains documentation which is not included in distributed build artifacts.",
    },
    {
        name: "EXAMPLE_OF",
        description:
            "The path only contains source code examples which are not included in distributed build artifacts.",
    },
    {
        name: "OPTIONAL_COMPONENT_OF",
        description:
            "The path only contains optional components for the code that is built which are not included in distributed build artifacts.",
    },
    {
        name: "OTHER",
        description:
            "Any reason which cannot be represented by any other choice.",
    },
    {
        name: "PROVIDED_BY",
        description:
            "The path only contains packages or sources for packages that have to be provided by the user of distributed build artifacts.",
    },
    {
        name: "TEST_OF",
        description:
            "The path only contains files used for testing source code which are not included in distributed build artifacts.",
    },
    {
        name: "TEST_TOOL_OF",
        description:
            "The path only contains tools used for testing source code which are not included in distributed build artifacts.",
    },
];

//-------- GET path exclusion affected files --------
export const GetAffectedFilesForPathExclusionRes = z.object({
    affectedFiles: z.array(z.string()),
});

//--------------- PUT path exclusion ---------------
export const PutPathExclusionReq = z
    .object({
        pattern: pePatternGlobSchema,
        reason: z
            .string()
            .refine(
                (reason) =>
                    validReasons.some(
                        (validReason) => validReason.name === reason,
                    ),
                {
                    message:
                        "Reason is invalid. Accepted values are: " +
                        validReasons
                            .map((validReason) => validReason.name)
                            .join(", "),
                },
            ),
        comment: z.nullable(z.string()),
    })
    .partial();

export const PutPathExclusionRes = z.object({
    message: z.string(),
});

//------------------ POST path exclusion --------------

export const PostPathExclusionReq = z.object({
    pattern: pePatternGlobSchema,
    reason: z
        .string({
            required_error: "Reason is required",
        })
        .trim()
        .min(1, "Reason cannot be empty")
        .refine(
            (reason) =>
                validReasons.some((validReason) => validReason.name === reason),
            {
                message:
                    "Reason is invalid. Accepted values are: " +
                    validReasons
                        .map((validReason) => validReason.name)
                        .join(", "),
            },
        ),
    clearanceGroupId: z.number(),
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

//------------------ GET path-exclusions -------------------

export const GetPathExclusionsForPkgRes = z.object({
    pathExclusions: z.array(
        z.object({
            id: z.number(),
            updatedAt: z.coerce.date(),
            pattern: z.string(),
            reason: z.string(),
            comment: z.nullable(z.string()),
            curator: z.object({
                username: z.string(),
            }),
        }),
    ),
});

//------------------ GET filetrees -------------------

export const GetFileTreeRes = z.object({
    filetrees: z.array(
        z.object({
            path: z.string(),
            packageId: z.number(),
            fileSha256: z.string(),
        }),
    ),
});

//------------------ GET package -------------------
export const GetPackageRes = z.object({
    declaredLicenseSPDX: z.nullable(z.string()),
});

//------------------ GET file -------------------
export const GetFileRes = z.object({
    sha256: z.string(),
    downloadUrl: z.string(),
    scanner: z.string(),
});

//------------------ GET license-findings for package -------------------
export const GetLicenseFindingsForPackageRes = z.object({
    licenseFindings: z.array(
        z.object({
            licenseExpressionSPDX: z.string(),
            fileSha256: z.string(),
        }),
    ),
});

//------------------ GET license-findings for file -------------------

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
