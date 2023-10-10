// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const ScannerRootRequestSchema = z.object({});

export const ScannerRootResponseSchema = z.object({
  message: z.string(),
});

export const ScannerJobRequestBodySchema = z.object({
  jobId: z.string({
    required_error: "Job ID is required",
  }),
  options: z.object({
    timeout: z.string().optional(),
  }),
  files: z.array(
    z.object({
      hash: z.string({
        required_error: "File hash is required",
      }),
      path: z.string({
        required_error: "File path is required",
      }),
    }),
  ),
});

export const ScannerJobResponseBodySchema = z.object({
  id: z.string(),
});

export const ResultStateRequestSchema = z.string({
  required_error: "Job ID is required",
});

export const ResultStateRequestBodySchema = z.object({
  state: z.string({
    required_error: "Job state is required",
  }),
});

export const ResultStateResponseBodySchema = z.object({
  message: z.string(),
});

export const ScannerJoblistRequestSchema = z.object({});

export const ScannerJoblistResponseBodySchema = z.array(
  z.object({
    id: z.string(),
    state: z.string(),
    finishedOn: z.number().optional(),
  }),
);

export const ScannerJobResultSchema = z.object({
  headers: z.array(
    z.object({
      tool_name: z.string(),
      tool_version: z.string(),
      options: z.object({
        input: z.array(z.string()),
        "--copyright": z.boolean(),
        "--info": z.boolean(),
        "--json": z.string().optional(),
        "--json-pp": z.string().optional(),
        "--license": z.boolean(),
        "--package": z.boolean().optional(),
      }),
      notice: z.string(),
      start_timestamp: z.string(),
      end_timestamp: z.string(),
      output_format_version: z.string(),
      duration: z.number(),
      message: z.nullable(z.string()),
      errors: z.array(z.unknown()),
      warnings: z.array(z.unknown()),
      extra_data: z.object({
        system_environment: z.object({
          operating_system: z.string(),
          cpu_architecture: z.string(),
          platform: z.string(),
          platform_version: z.string(),
          python_version: z.string(),
        }),
        spdx_license_list_version: z.string(),
        files_count: z.number(),
      }),
    }),
  ),
  files: z.array(
    z.object({
      path: z.string(),
      type: z.string(),
      sha256: z.nullable(z.string()),
      detected_license_expression: z.nullable(z.string()),
      detected_license_expression_spdx: z.nullable(z.string()),
      license_detections: z.array(
        z.object({
          license_expression: z.string(),
          matches: z.array(
            z.object({
              score: z.number(),
              start_line: z.number(),
              end_line: z.number(),
              license_expression: z.string(),
            }),
          ),
        }),
      ),
      copyrights: z.array(
        z.object({
          copyright: z.string(),
          start_line: z.number(),
          end_line: z.number(),
        }),
      ),
      scan_errors: z.array(z.string()),
    }),
  ),
});

export const ScannerJobInfoRequestSchema = z.string({
  required_error: "Job ID is required",
});

export const ScannerJobInfoResponseBodySchema = z.object({
  id: z.string(),
  state: z.string().optional(),
  data: z
    .object({
      directory: z.string(),
    })
    .optional(),
  finishedOn: z.number().optional(),
  result: ScannerJobResultSchema.optional(),
});

export const ErrorSchema = z.object({
  error: z.string(),
});
