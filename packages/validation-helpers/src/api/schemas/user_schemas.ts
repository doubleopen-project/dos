// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

export const GetUserRes = z.object({
    username: z.string(),
});

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