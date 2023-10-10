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
    concludedLicenseExpressionSPDX: z.string(),
    detectedLicenseExpressionSPDX: z.string(),
    comment: z.string(),
})
.partial()
.refine(
    ({ concludedLicenseExpressionSPDX, detectedLicenseExpressionSPDX, comment }) => 
        concludedLicenseExpressionSPDX !== undefined || detectedLicenseExpressionSPDX !== undefined || comment !== undefined,
        { message: 'At least one field is required' }
)

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