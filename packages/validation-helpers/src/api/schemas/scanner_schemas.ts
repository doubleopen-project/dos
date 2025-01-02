// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";
import { ScannerJobResultSchema } from "../../other_schemas/scan_job_result";
import { purlSchema } from "./common_schemas";

//---------------- GET health ----------------

export const GetHealthRes = z.object({
    message: z.string(),
});

//---------------- POST scan-results ----------------

export const PostScanResultsReq = z.union([
    z.object({
        purls: z
            .array(purlSchema(true))
            .min(1, "At least one purl is required"),
        options: z
            .object({
                fetchConcluded: z.boolean().optional(),
            })
            .optional(),
    }),
    z.object({
        packages: z
            .array(
                z.object({
                    purl: purlSchema(true),
                    declaredLicenseExpressionSPDX: z.nullable(z.string()),
                }),
            )
            .min(1, "At least one package is required"),
        options: z
            .object({
                fetchConcluded: z.boolean().optional(),
            })
            .optional(),
    }),
]);

export const PostScanResultsRes = z.object({
    purls: z.array(purlSchema(false)).min(1, "At least one purl is required"),
    state: z.object({
        status: z.enum(["no-results", "pending", "ready"]),
        jobId: z.nullable(z.string()),
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

//---------------- POST package-configuration ----------------

export const PostPackageConfigurationReq = z.object({
    purl: z.string({
        required_error: "Purl is required",
    }),
});

export const PostPackageConfigurationRes = z.object({
    licenseConclusions: z.array(
        z.object({
            path: z.string(),
            detectedLicenseExpressionSPDX: z.nullable(z.string()),
            concludedLicenseExpressionSPDX: z.string(),
            comment: z.nullable(z.string()),
        }),
    ),
    pathExclusions: z.array(
        z.object({
            pattern: z.string(),
            reason: z.string(),
            comment: z.nullable(z.string()),
        }),
    ),
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

export const PostJobReq = z.union([
    z.object({
        zipFileKey: z
            .string({
                required_error: "Zip file key is required",
            })
            .trim()
            .min(1, "Zip file key cannot be empty"),
        purls: z
            .array(purlSchema(true))
            .min(1, "At least one purl is required"),
    }),
    z.object({
        zipFileKey: z
            .string({
                required_error: "Zip file key is required",
            })
            .trim()
            .min(1, "Zip file key cannot be empty"),
        packages: z
            .array(
                z.object({
                    purl: purlSchema(true),
                    declaredLicenseExpressionSPDX: z.nullable(z.string()),
                }),
            )
            .min(1, "At least one package is required"),
    }),
]);

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

//--------------- GET work-queue/jobs ----------------

export const GetWorkQueueJobsRes = z.array(
    z.object({
        id: z.string(),
        state: z.string(),
        finishedOn: z.coerce.date().optional(),
    }),
);

export const QueryParamWorkQueueJobsStatus = z
    .string()
    .transform((value) => value.split(","))
    .pipe(
        z.array(
            z.enum([
                "completed",
                "waiting",
                "active",
                "delayed",
                "failed",
                "paused",
            ]),
        ),
    )
    .optional();

//---------------- GET work-queue/jobs/:id ----------------

export const GetWorkQueueJobDetailsRes = z.object({
    id: z.string().uuid(),
    state: z.string(),
    data: z
        .object({
            jobId: z.string().uuid(),
            options: z
                .object({
                    timeout: z.number().optional(),
                })
                .optional(),
            files: z.array(
                z.object({
                    hash: z.string(),
                    path: z.string(),
                }),
            ),
        })
        .optional(),
    finishedOn: z.coerce.date().optional(),
    result: ScannerJobResultSchema.optional(),
});
