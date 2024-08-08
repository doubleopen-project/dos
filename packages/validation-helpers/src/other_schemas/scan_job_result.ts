// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const ScannerJobResultSchema = z.object({
    headers: z.array(
        z.object({
            tool_name: z.string(),
            tool_version: z.string(),
            options: z.object({
                "--copyright": z.boolean(),
                "--info": z.boolean(),
                "--json": z.string().optional(),
                "--json-pp": z.string().optional(),
                "--license": z.boolean(),
                "--license-references": z.boolean().optional(),
                "--package": z.boolean().optional(),
                "--processes": z.string().optional(),
                "--quiet": z.boolean().optional(),
                "--strip-root": z.boolean().optional(),
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
    license_references: z.array(
        z.object({
            key: z.string(),
            spdx_license_key: z.string(),
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
                            spdx_license_expression: z.nullable(z.string()),
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

export type ScannerJobResultType = z.infer<typeof ScannerJobResultSchema>;
