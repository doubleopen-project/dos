// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

export const ScannerRootRequestSchema = z.object({});

export const ScannerRootResponseSchema = z.object({
    message: z.string()
});

export const ScannerJobRequestBodySchema = z.object({
    directory: z.string({
        required_error: "Directory is required"
    })
    .trim()
    .min(1, "Directory cannot be empty"),
    opts: z.object({
        jobId: z.string({
            required_error: "Job ID is required"
        })
    })
})

export const ScannerJobResponseBodySchema = z.object({
    id: z.string(),
    data: z.object({
        directory: z.string(),
    })
})

export const ScannerJoblistRequestSchema = z.object({});

export const ScannerJoblistResponseBodySchema = z.array(
    z.object({
        id: z.string(),
        state: z.string(),
        data: z.object({
            directory: z.string(),
        }),
        finishedOn: z.number().optional()
    })
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
        "--json": z.string(),
        "--license": z.boolean(),
        "--package": z.boolean()
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
          python_version: z.string()
        }),
        spdx_license_list_version: z.string(),
        files_count: z.number()
      })
    })
  ),
  dependencies: z.array(
    z.object({
      purl: z.string(),
      extracted_requirement: z.nullable(z.string()),
      scope: z.string(),
      is_runtime: z.boolean(),
      is_optional: z.boolean(),
      is_resolved: z.boolean(),
      resolved_package: z.union([
        z.object({}),
        z.object({
          type: z.string(),
          namespace: z.string(),
          name: z.string(),
          version: z.nullable(z.string()),
          qualifiers: z.object({}),
          subpath: z.nullable(z.string()),
          primary_language: z.string(),
          description: z.nullable(z.string()),
          release_date: z.nullable(z.string()),
          parties: z.array(z.unknown()),
          keywords: z.array(z.unknown()),
          homepage_url: z.nullable(z.string()),
          download_url: z.nullable(z.string()),
          size: z.nullable(z.number()),
          sha1: z.nullable(z.string()),
          md5: z.nullable(z.string()),
          sha256: z.nullable(z.string()),
          sha512: z.nullable(z.string()),
          bug_tracking_url: z.nullable(z.string()),
          code_view_url: z.nullable(z.string()),
          vcs_url: z.nullable(z.string()),
          copyright: z.nullable(z.string()),
          license_expression: z.nullable(z.string()),
          declared_license: z.nullable(z.string()),
          notice_text: z.nullable(z.string()),
          source_packages: z.array(z.unknown()),
          file_references: z.array(
            z.array(
              z.object({
                path: z.string(),
                size: z.number(),
                sha1: z.nullable(z.string()),
                md5: z.nullable(z.string()),
                sha256: z.nullable(z.string()),
                sha512: z.nullable(z.string()),
                extra_data: z.object({})
              })
            )
          ),
          extra_data: z.object({}),
          dependencies: z.array(
            z.object({
              purl: z.string(),
              extracted_requirement: z.nullable(z.string()),
              scope: z.string(),
              is_runtime: z.boolean(),
              is_optional: z.boolean(),
              is_resolved: z.boolean(),
              resolved_package: z.object({}),
              extra_data: z.object({})
            })
          ),
          repository_homepage_url: z.string(),
          repository_download_url: z.nullable(z.string()),
          api_data_url: z.string(),
          datasource_id: z.string(),
          purl: z.string()
        })
      ]),
      extra_data: z.object({}),
      dependency_uid: z.string(),
      for_package_uid: z.string(),
      datafile_path: z.string(),
      datasource_id: z.string()
    })

  ),
  packages: z.array(
    z.object({
      type: z.string(),
      namespace: z.nullable(z.string()),
      name: z.string(),
      version: z.string(),
      qualifiers: z.object({}),
      subpath: z.nullable(z.string()),
      primary_language: z.string(),
      description: z.nullable(z.string()),
      release_date: z.nullable(z.string()),
      parties: z.array(z.unknown()),
      keywords: z.array(z.unknown()),
      homepage_url: z.nullable(z.string()),
      download_url: z.string(),
      size: z.nullable(z.number()),
      sha1: z.nullable(z.string()),
      md5: z.nullable(z.string()),
      sha256: z.nullable(z.string()),
      sha512: z.nullable(z.string()),
      bug_tracking_url: z.nullable(z.string()),
      code_view_url: z.nullable(z.string()),
      vcs_url: z.nullable(z.string()),
      copyright: z.nullable(z.string()),
      license_expression: z.nullable(z.string()),
      declared_license: z.array(z.string()),
      notice_text: z.nullable(z.string()),
      source_packages: z.array(z.unknown()),
      extra_data: z.object({}),
      repository_homepage_url: z.string(),
      repository_download_url: z.string(),
      api_data_url: z.string(),
      package_uid: z.string(),
      datafile_paths: z.array(z.string()),
      datasource_ids: z.array(z.string()),
      purl: z.string()
    })
  ),
  files: z.array(
    z.object({
      path: z.string(),
      type: z.string(),
      name: z.string(),
      base_name: z.string(),
      extension: z.string(),
      size: z.number(),
      date: z.nullable(z.string()),
      sha1: z.nullable(z.string()),
      md5: z.nullable(z.string()),
      sha256: z.nullable(z.string()),
      mime_type: z.nullable(z.string()),
      file_type: z.nullable(z.string()),
      programming_language: z.nullable(z.string()),
      is_binary: z.boolean(),
      is_text: z.boolean(),
      is_archive: z.boolean(),
      is_media: z.boolean(),
      is_source: z.boolean(),
      is_script: z.boolean(),
      licenses: z.array(
        z.object({
          key: z.string(),
          score: z.number(),
          name: z.string(),
          short_name: z.string(),
          category: z.string(),
          is_exception: z.boolean(),
          is_unknown: z.boolean(),
          owner: z.string(),
          homepage_url: z.nullable(z.string()),
          text_url: z.string(),
          reference_url: z.string(),
          scancode_text_url: z.string(),
          scancode_data_url: z.string(),
          spdx_license_key: z.string(),
          spdx_url: z.string(),
          start_line: z.number(),
          end_line: z.number(),
          matched_rule: z.object({
            identifier: z.string(),
            license_expression: z.string(),
            licenses: z.array(z.string()),
            referenced_filenames: z.array(z.unknown()),
            is_license_text: z.boolean(),
            is_license_notice: z.boolean(),
            is_license_reference: z.boolean(),
            is_license_tag: z.boolean(),
            is_license_intro: z.boolean(),
            has_unknown: z.boolean(),
            matcher: z.string(),
            rule_length: z.number(),
            matched_length: z.number(),
            match_coverage: z.number(),
            rule_relevance: z.number()
          })
        })
      ),
      license_expressions: z.array(z.unknown()),
      percentage_of_license_text: z.number(),
      copyrights: z.array(
        z.object({
          copyright: z.string(),
          start_line: z.number(),
          end_line: z.number()
        })
      ),
      holders: z.array(
        z.object({
          holder: z.string(),
          start_line: z.number(),
          end_line: z.number()
        })
      ),
      authors: z.array(
        z.object({
          author: z.string(),
          start_line: z.number(),
          end_line: z.number()
        })
      ),
      package_data: z.array(
        z.object({
          type: z.string(),
          namespace: z.nullable(z.string()),
          name: z.nullable(z.string()),
          version: z.nullable(z.string()),
          qualifiers: z.object({}),
          subpath: z.nullable(z.string()),
          primary_language: z.string(),
          description: z.nullable(z.string()),
          release_date: z.nullable(z.string()),
          parties: z.array(z.unknown()),
          keywords: z.array(z.unknown()),
          homepage_url: z.nullable(z.string()),
          download_url: z.nullable(z.string()),
          size: z.nullable(z.number()),
          sha1: z.nullable(z.string()),
          md5: z.nullable(z.string()),
          sha256: z.nullable(z.string()),
          sha512: z.nullable(z.string()),
          bug_tracking_url: z.nullable(z.string()),
          code_view_url: z.nullable(z.string()),
          vcs_url: z.nullable(z.string()),
          copyright: z.nullable(z.string()),
          license_expression: z.nullable(z.string()),
          declared_license: z.nullable(z.array(z.string())),
          notice_text: z.nullable(z.string()),
          source_packages: z.array(z.unknown()),
          file_references: z.array(z.unknown()),
          extra_data: z.object({}),
          dependencies: z.array(
            z.object({
              purl: z.string(),
              extracted_requirement: z.nullable(z.string()),
              scope: z.string(),
              is_runtime: z.boolean(),
              is_optional: z.boolean(),
              is_resolved: z.boolean(),
              resolved_package: z.object({}),
              extra_data: z.object({})
            })
          ),
          repository_homepage_url: z.nullable(z.string()),
          repository_download_url: z.nullable(z.string()),
          api_data_url: z.nullable(z.string()),
          datasource_id: z.string(),
          purl: z.nullable(z.string())
        })
      ),
      for_packages: z.array(z.unknown()),
      files_count: z.number(),
      dirs_count: z.number(),
      size_count: z.number(),
      scan_errors: z.array(z.unknown())
    })
  )
})

export const ScannerJobInfoRequestSchema = z.string({
    required_error: "Job ID is required"
})

export const ScannerJobInfoResponseBodySchema = z.object({
  id: z.string(),
  state: z.string().optional(),
  data: z.object({
      directory: z.string(),
  }).optional(),
  finishedOn: z.number().optional(),
  result: ScannerJobResultSchema.optional()
})

export const ErrorSchema = z.object({
  error: z.string()
})