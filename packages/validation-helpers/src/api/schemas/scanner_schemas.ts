// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";
import { ScannerJobResultSchema } from "../../schemas/scanner_agent_schemas";

//---------------- POST scan-results ----------------

export const PostScanResultsReq = z.object({
  purl: z.string({
    required_error: "Purl is required",
  }),
  options: z
    .object({
      fetchConcluded: z.boolean().optional(),
    })
    .optional(),
});

export const PostScanResultsRes = z.object({
  state: z.object({
    status: z.string(),
    id: z.nullable(z.string()),
  }),
  results: z.union([
    z.null(),
    z.object({
      licenses: z.array(
        z.object({
          license: z.string(),
          location: z.object({
            path: z.string(),
            start_line: z.number().optional(),
            end_line: z.number().optional(),
          }),
          score: z.number().optional(),
        }),
      ),
      copyrights: z.array(
        z.object({
          statement: z.string(),
          location: z.object({
            path: z.string(),
            start_line: z.number(),
            end_line: z.number(),
          }),
        }),
      ),
      issues: z.array(
        z.object({
          timestamp: z.date(),
          source: z.string(),
          message: z.string(),
          severity: z.string(),
        }),
      ),
    }),
  ]),
});

//---------------- POST upload-url ----------------

export const PostUploadUrlReq = z.object({
  key: z
    .string({
      required_error: "Key is required",
    })
    .trim()
    .min(1, "Key cannot be empty"),
});

export const PostUploadUrlRes = z.object({
  success: z.boolean(),
  presignedUrl: z.string().optional(),
  message: z.string().optional(),
});

//---------------- POST job ----------------

export const PostJobReq = z.object({
  zipFileKey: z
    .string({
      required_error: "Zip file key is required",
    })
    .trim()
    .min(1, "Zip file key cannot be empty"),
  purl: z
    .string({
      required_error: "Purl is required",
    })
    .trim()
    .min(1, "Purl cannot be empty"),
});

export const PostJobRes = z.object({
  scannerJobId: z.string(),
});

//---------------- GET job-state ----------------

export const GetJobStateReq = z.string({
  required_error: "Scan job ID is required",
});

export const GetJobStateRes = z.object({
  state: z.object({
    status: z.string(),
    message: z.string(),
  }),
});

//---------------- PUT job-state ----------------

export const PutJobStateReq = z.object({
  state: z
    .string({
      required_error: "State is required",
    })
    .trim()
    .min(1, "State cannot be empty"),
});

export const PutJobStateReqPathParams = z.string({
  required_error: "Scan job ID is required",
});

export const PutJobStateRes = z.object({
  message: z.string(),
});

//---------------- POST job-results ----------------

export const PostJobResultsReq = z.object({
  id: z
    .string({
      required_error: "Id is required",
    })
    .trim()
    .min(1, "Id cannot be empty"),
  result: ScannerJobResultSchema,
});

export const PostJobResultsRes = z.object({
  message: z.string(),
});
