// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';
import { ScannerJobResultSchema } from './scanner_agent_schemas';

//---------------- POST scan-results ----------------

export const PostScanResultsReq = z.object({
    purl: z.string({
        required_error: 'Purl is required'
    }),
    options: z.object({
        fetchConcluded: z.boolean().optional(),
    }).optional(),
})

export const PostScanResultsRes = z.object({
    state: z.object({
        status: z.string(),
        id: z.nullable(z.string()),
    }),
    results: z.union([
        z.null(),
        z.object({
            licenses: z.array(z.object({
                license: z.string(),
                location: z.object({
                    path: z.string(),
                    start_line: z.number(),
                    end_line: z.number(),
                }),
                score: z.number(),
            })),
            copyrights: z.array(z.object({
                statement: z.string(),
                location: z.object({
                    path: z.string(),
                    start_line: z.number(),
                    end_line: z.number(),
                }),
            })),
            issues: z.array(z.object({
                timestamp: z.date(),
                source: z.string(),
                message: z.string(),
                severity: z.string(),
            })),
        })
    ]),
})

//---------------- DELETE scan-results ----------------

export const DeleteScanResultsReq = z.object({
    purl: z.string({
        required_error: 'Purl is required'
    })
})

export const DeleteScanResultsRes = z.object({
    message: z.string()
})

//---------------- POST upload-url ----------------

export const PostUploadUrlReq = z.object({
    key: z.string({
        required_error: 'Key is required'
    })
        .trim()
        .min(1, 'Key cannot be empty'),
})

export const PostUploadUrlRes = z.object({
    success: z.boolean(),
    presignedUrl: z.string().optional(),
    message: z.string().optional()
})

//---------------- POST job ----------------

export const PostJobReq = z.object({
    zipFileKey: z.string({
        required_error: 'Zip file key is required'
    })
        .trim()
        .min(1, 'Zip file key cannot be empty'),
    purl: z.string({
        required_error: 'Purl is required'
    })
        .trim()
        .min(1, 'Purl cannot be empty'),
})

export const PostJobRes = z.object({
    scannerJobId: z.string()
})

//---------------- GET job-state ----------------

export const GetJobStateReq = z.string({
    required_error: "Scan job ID is required"
})

export const GetJobStateRes = z.object({
    state: z.object({
        status: z.string(),
        message: z.string(),
    })
})

//---------------- PUT job-state ----------------

export const PutJobStateReq = z.object({
    state: z.
        string({
            required_error: 'State is required'
        })
        .trim()
        .min(1, 'State cannot be empty')
})

export const PutJobStateReqPathParams = z.string({
    required_error: "Scan job ID is required"
})

export const PutJobStateRes = z.object({
    message: z.string()
})

//---------------- POST job-results ----------------

export const PostJobResultsReq = z.object({
    id: z.
        string({
            required_error: 'Id is required'
        })
        .trim()
        .min(1, 'Id cannot be empty'),
    result: ScannerJobResultSchema
})

export const PostJobResultsRes = z.object({
    message: z.string()
})


//-------------------- POST user --------------------

export const PostUserReq = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    }),
    role: z.enum(['ADMIN', 'USER']).optional(),
    subscription: z.enum(['SILVER', 'GOLD']).optional(),
    token: z.string().optional(),
})

export const PostUserRes = z.object({
    message: z.string()
})

//------------------- DELETE user -------------------

export const DeleteUserReq = z.object({
    id: z.number({
        required_error: 'Id is required'
    })
})

export const DeleteUserRes = z.object({
    message: z.string()
})

//-------------- POST license conclusion --------------

export const PostLicenseConclusionReq = z.object({
    concludedLicenseExpressionSPDX: z.string({
        required_error: 'Concluded license expression is required'
    }),
    detectedLicenseExpressionSPDX: z.string({
        required_error: 'Detected license expression is required'
    }),
    comment: z.string({
        required_error: 'Comment is required'
    }),
    reason: z.string({
        required_error: 'Reason is required'
    }),
    startLine: z.number({
        required_error: 'Start line is required'
    }),
    endLine: z.number({
        required_error: 'End line is required'
    }),
    fileSha256: z.string({
        required_error: 'File SHA256 is required'
    }),
})

export const PostLicenseConclusionRes = z.object({
    licenseConclusionId: z.number(),
    message: z.string()
})

//--------------- PUT license conclusion ---------------
export const PutLicenseConclusionReq = z.object({
    concludedLicenseExpressionSPDX: z.string().optional(),
    detectedLicenseExpressionSPDX: z.string().optional(),
    comment: z.string().optional(),
    reason: z.string().optional(),
    startLine: z.number().optional(),
    endLine: z.number().optional()
})

export const PutLicenseConclusionReqPathParams = z.string({
    required_error: 'Id is required'
})


export const PutLicenseConclusionRes = z.object({
    message: z.string()
})

//------------- DELETE license conclusion -------------
export const DeleteLicenseConclusionReqPathParams = z.string({
    required_error: 'Id is required'
})

export const DeleteLicenseConclusionRes = z.object({
    message: z.string()
})

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

//------------------ POST login/password -------------------

export const PostLoginPasswordReq = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    })
})

export const PostLoginPasswordRes = z.object({})

//------------------- POST logout --------------------

export const PostLogoutRes = z.object({
    message: z.string()
})
//------------------ POST register -------------------

export const PostRegisterReq = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    }),
    role: z.enum(['ADMIN', 'USER']).optional(),
    subscription: z.enum(['SILVER', 'GOLD']).optional(),
})

export const PostRegisterRes = z.object({
    message: z.string()
})

//------------------- GET file -------------------

export const GetFileReqSha256Param = z.string({
    required_error: 'Sha256 is required'
})

export const GetFileRes = z.object({
    downloadUrl: z.string(),
    licenseFindings: z.array(z.object({
        licenseExpressionSPDX: z.string(),
        licenseFindingMatches: z.array(z.object({
            licenseExpression: z.nullable(z.string()),
            startLine: z.number(),
            endLine: z.number(),
            score: z.number(),
        })),
    })),
    copyrightFindings: z.array(z.object({
        copyright: z.string(),
        startLine: z.number(),
        endLine: z.number(),
    })),
})

//------------------- Error schema -------------------

export const ErrorSchema = z.object({
    message: z.string()
})