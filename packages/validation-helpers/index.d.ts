// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT
export { ScannerJobResultSchema } from './schemas/scanner_agent_schemas';
import * as zod from 'zod';
import { z } from 'zod';

declare const ScannerJobResultSchema: z.ZodObject<{
    headers: z.ZodArray<z.ZodObject<{
        tool_name: z.ZodString;
        tool_version: z.ZodString;
        options: z.ZodObject<{
            input: z.ZodArray<z.ZodString, "many">;
            "--copyright": z.ZodBoolean;
            "--info": z.ZodBoolean;
            "--json": z.ZodOptional<z.ZodString>;
            "--json-pp": z.ZodOptional<z.ZodString>;
            "--license": z.ZodBoolean;
            "--package": z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--package": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
        }, {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--package": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
        }>;
        notice: z.ZodString;
        start_timestamp: z.ZodString;
        end_timestamp: z.ZodString;
        output_format_version: z.ZodString;
        duration: z.ZodNumber;
        message: z.ZodNullable<z.ZodString>;
        errors: z.ZodArray<z.ZodUnknown, "many">;
        warnings: z.ZodArray<z.ZodUnknown, "many">;
        extra_data: z.ZodObject<{
            system_environment: z.ZodObject<{
                operating_system: z.ZodString;
                cpu_architecture: z.ZodString;
                platform: z.ZodString;
                platform_version: z.ZodString;
                python_version: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            }, {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            }>;
            spdx_license_list_version: z.ZodString;
            files_count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            system_environment: {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            };
            spdx_license_list_version: string;
            files_count: number;
        }, {
            system_environment: {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            };
            spdx_license_list_version: string;
            files_count: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        message: string | null;
        options: {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--package": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
        };
        tool_name: string;
        tool_version: string;
        notice: string;
        start_timestamp: string;
        end_timestamp: string;
        output_format_version: string;
        duration: number;
        errors: unknown[];
        warnings: unknown[];
        extra_data: {
            system_environment: {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            };
            spdx_license_list_version: string;
            files_count: number;
        };
    }, {
        message: string | null;
        options: {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--package": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
        };
        tool_name: string;
        tool_version: string;
        notice: string;
        start_timestamp: string;
        end_timestamp: string;
        output_format_version: string;
        duration: number;
        errors: unknown[];
        warnings: unknown[];
        extra_data: {
            system_environment: {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            };
            spdx_license_list_version: string;
            files_count: number;
        };
    }>, "many">;
    dependencies: z.ZodArray<z.ZodObject<{
        purl: z.ZodString;
        extracted_requirement: z.ZodNullable<z.ZodString>;
        scope: z.ZodString;
        is_runtime: z.ZodBoolean;
        is_optional: z.ZodBoolean;
        is_resolved: z.ZodBoolean;
        resolved_package: z.ZodUnion<[z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
            type: z.ZodString;
            namespace: z.ZodString;
            name: z.ZodString;
            version: z.ZodNullable<z.ZodString>;
            qualifiers: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            subpath: z.ZodNullable<z.ZodString>;
            primary_language: z.ZodString;
            description: z.ZodNullable<z.ZodString>;
            release_date: z.ZodNullable<z.ZodString>;
            parties: z.ZodArray<z.ZodUnknown, "many">;
            keywords: z.ZodArray<z.ZodUnknown, "many">;
            homepage_url: z.ZodNullable<z.ZodString>;
            download_url: z.ZodNullable<z.ZodString>;
            size: z.ZodNullable<z.ZodNumber>;
            sha1: z.ZodNullable<z.ZodString>;
            md5: z.ZodNullable<z.ZodString>;
            sha256: z.ZodNullable<z.ZodString>;
            sha512: z.ZodNullable<z.ZodString>;
            bug_tracking_url: z.ZodNullable<z.ZodString>;
            code_view_url: z.ZodNullable<z.ZodString>;
            vcs_url: z.ZodNullable<z.ZodString>;
            copyright: z.ZodNullable<z.ZodString>;
            license_expression: z.ZodNullable<z.ZodString>;
            declared_license: z.ZodNullable<z.ZodString>;
            notice_text: z.ZodNullable<z.ZodString>;
            source_packages: z.ZodArray<z.ZodUnknown, "many">;
            file_references: z.ZodArray<z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                size: z.ZodNumber;
                sha1: z.ZodNullable<z.ZodString>;
                md5: z.ZodNullable<z.ZodString>;
                sha256: z.ZodNullable<z.ZodString>;
                sha512: z.ZodNullable<z.ZodString>;
                extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }, {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }>, "many">, "many">;
            extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            dependencies: z.ZodArray<z.ZodObject<{
                purl: z.ZodString;
                extracted_requirement: z.ZodNullable<z.ZodString>;
                scope: z.ZodString;
                is_runtime: z.ZodBoolean;
                is_optional: z.ZodBoolean;
                is_resolved: z.ZodBoolean;
                resolved_package: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
                extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            }, "strip", z.ZodTypeAny, {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }, {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }>, "many">;
            repository_homepage_url: z.ZodString;
            repository_download_url: z.ZodNullable<z.ZodString>;
            api_data_url: z.ZodString;
            datasource_id: z.ZodString;
            purl: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        }, {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        }>]>;
        extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        dependency_uid: z.ZodString;
        for_package_uid: z.ZodString;
        datafile_path: z.ZodString;
        datasource_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        extra_data: {};
        purl: string;
        extracted_requirement: string | null;
        scope: string;
        is_runtime: boolean;
        is_optional: boolean;
        is_resolved: boolean;
        resolved_package: ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        }) & ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        } | undefined);
        datasource_id: string;
        dependency_uid: string;
        for_package_uid: string;
        datafile_path: string;
    }, {
        extra_data: {};
        purl: string;
        extracted_requirement: string | null;
        scope: string;
        is_runtime: boolean;
        is_optional: boolean;
        is_resolved: boolean;
        resolved_package: ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        }) & ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        } | undefined);
        datasource_id: string;
        dependency_uid: string;
        for_package_uid: string;
        datafile_path: string;
    }>, "many">;
    packages: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        namespace: z.ZodNullable<z.ZodString>;
        name: z.ZodString;
        version: z.ZodString;
        qualifiers: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        subpath: z.ZodNullable<z.ZodString>;
        primary_language: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        release_date: z.ZodNullable<z.ZodString>;
        parties: z.ZodArray<z.ZodUnknown, "many">;
        keywords: z.ZodArray<z.ZodUnknown, "many">;
        homepage_url: z.ZodNullable<z.ZodString>;
        download_url: z.ZodString;
        size: z.ZodNullable<z.ZodNumber>;
        sha1: z.ZodNullable<z.ZodString>;
        md5: z.ZodNullable<z.ZodString>;
        sha256: z.ZodNullable<z.ZodString>;
        sha512: z.ZodNullable<z.ZodString>;
        bug_tracking_url: z.ZodNullable<z.ZodString>;
        code_view_url: z.ZodNullable<z.ZodString>;
        vcs_url: z.ZodNullable<z.ZodString>;
        copyright: z.ZodNullable<z.ZodString>;
        holder: z.ZodNullable<z.ZodString>;
        declared_license_expression: z.ZodNullable<z.ZodString>;
        declared_license_expression_spdx: z.ZodNullable<z.ZodString>;
        license_detections: z.ZodArray<z.ZodObject<{
            license_expression: z.ZodString;
            matches: z.ZodArray<z.ZodObject<{
                score: z.ZodNumber;
                start_line: z.ZodNumber;
                end_line: z.ZodNumber;
                matched_length: z.ZodNumber;
                match_coverage: z.ZodNumber;
                matcher: z.ZodString;
                license_expression: z.ZodString;
                rule_identifier: z.ZodString;
                rule_relevance: z.ZodNumber;
                rule_url: z.ZodNullable<z.ZodString>;
                matched_text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }, {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }>, "many">;
            identifier: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }[];
            identifier: string;
        }, {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }[];
            identifier: string;
        }>, "many">;
        other_license_expression: z.ZodNullable<z.ZodString>;
        other_license_expression_spdx: z.ZodNullable<z.ZodString>;
        other_license_detections: z.ZodArray<z.ZodUnknown, "many">;
        extracted_license_statement: z.ZodNullable<z.ZodString>;
        notice_text: z.ZodNullable<z.ZodString>;
        source_packages: z.ZodArray<z.ZodUnknown, "many">;
        extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        repository_homepage_url: z.ZodString;
        repository_download_url: z.ZodString;
        api_data_url: z.ZodString;
        package_uid: z.ZodString;
        datafile_paths: z.ZodArray<z.ZodString, "many">;
        datasource_ids: z.ZodArray<z.ZodString, "many">;
        purl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        extra_data: {};
        purl: string;
        namespace: string | null;
        name: string;
        version: string;
        qualifiers: {};
        subpath: string | null;
        primary_language: string;
        description: string | null;
        release_date: string | null;
        parties: unknown[];
        keywords: unknown[];
        homepage_url: string | null;
        download_url: string;
        size: number | null;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        sha512: string | null;
        bug_tracking_url: string | null;
        code_view_url: string | null;
        vcs_url: string | null;
        copyright: string | null;
        notice_text: string | null;
        source_packages: unknown[];
        repository_homepage_url: string;
        repository_download_url: string;
        api_data_url: string;
        holder: string | null;
        declared_license_expression: string | null;
        declared_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }[];
            identifier: string;
        }[];
        other_license_expression: string | null;
        other_license_expression_spdx: string | null;
        other_license_detections: unknown[];
        extracted_license_statement: string | null;
        package_uid: string;
        datafile_paths: string[];
        datasource_ids: string[];
    }, {
        type: string;
        extra_data: {};
        purl: string;
        namespace: string | null;
        name: string;
        version: string;
        qualifiers: {};
        subpath: string | null;
        primary_language: string;
        description: string | null;
        release_date: string | null;
        parties: unknown[];
        keywords: unknown[];
        homepage_url: string | null;
        download_url: string;
        size: number | null;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        sha512: string | null;
        bug_tracking_url: string | null;
        code_view_url: string | null;
        vcs_url: string | null;
        copyright: string | null;
        notice_text: string | null;
        source_packages: unknown[];
        repository_homepage_url: string;
        repository_download_url: string;
        api_data_url: string;
        holder: string | null;
        declared_license_expression: string | null;
        declared_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }[];
            identifier: string;
        }[];
        other_license_expression: string | null;
        other_license_expression_spdx: string | null;
        other_license_detections: unknown[];
        extracted_license_statement: string | null;
        package_uid: string;
        datafile_paths: string[];
        datasource_ids: string[];
    }>, "many">;
    license_detections: z.ZodArray<z.ZodObject<{
        identifier: z.ZodString;
        license_expression: z.ZodString;
        detection_count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        license_expression: string;
        identifier: string;
        detection_count: number;
    }, {
        license_expression: string;
        identifier: string;
        detection_count: number;
    }>, "many">;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        type: z.ZodString;
        name: z.ZodString;
        base_name: z.ZodString;
        extension: z.ZodString;
        size: z.ZodNumber;
        date: z.ZodNullable<z.ZodString>;
        sha1: z.ZodNullable<z.ZodString>;
        md5: z.ZodNullable<z.ZodString>;
        sha256: z.ZodNullable<z.ZodString>;
        mime_type: z.ZodNullable<z.ZodString>;
        file_type: z.ZodNullable<z.ZodString>;
        programming_language: z.ZodNullable<z.ZodString>;
        is_binary: z.ZodBoolean;
        is_text: z.ZodBoolean;
        is_archive: z.ZodBoolean;
        is_media: z.ZodBoolean;
        is_source: z.ZodBoolean;
        is_script: z.ZodBoolean;
        package_data: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            namespace: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
            version: z.ZodNullable<z.ZodString>;
            qualifiers: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            subpath: z.ZodNullable<z.ZodString>;
            primary_language: z.ZodString;
            description: z.ZodNullable<z.ZodString>;
            release_date: z.ZodNullable<z.ZodString>;
            parties: z.ZodArray<z.ZodUnknown, "many">;
            keywords: z.ZodArray<z.ZodUnknown, "many">;
            homepage_url: z.ZodNullable<z.ZodString>;
            download_url: z.ZodNullable<z.ZodString>;
            size: z.ZodNullable<z.ZodNumber>;
            sha1: z.ZodNullable<z.ZodString>;
            md5: z.ZodNullable<z.ZodString>;
            sha256: z.ZodNullable<z.ZodString>;
            sha512: z.ZodNullable<z.ZodString>;
            bug_tracking_url: z.ZodNullable<z.ZodString>;
            code_view_url: z.ZodNullable<z.ZodString>;
            vcs_url: z.ZodNullable<z.ZodString>;
            copyright: z.ZodNullable<z.ZodString>;
            holder: z.ZodNullable<z.ZodString>;
            declared_license_expression: z.ZodNullable<z.ZodString>;
            declared_license_expression_spdx: z.ZodNullable<z.ZodString>;
            license_detections: z.ZodArray<z.ZodObject<{
                license_expression: z.ZodString;
                matches: z.ZodArray<z.ZodObject<{
                    score: z.ZodNumber;
                    start_line: z.ZodNumber;
                    end_line: z.ZodNumber;
                    matched_length: z.ZodNumber;
                    match_coverage: z.ZodNumber;
                    matcher: z.ZodString;
                    license_expression: z.ZodString;
                    rule_identifier: z.ZodString;
                    rule_relevance: z.ZodNumber;
                    rule_url: z.ZodNullable<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }, {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }>, "many">;
                identifier: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }, {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }>, "many">;
            other_license_expression: z.ZodNullable<z.ZodString>;
            other_license_expression_spdx: z.ZodNullable<z.ZodString>;
            other_license_detections: z.ZodArray<z.ZodUnknown, "many">;
            extracted_license_statement: z.ZodNullable<z.ZodString>;
            notice_text: z.ZodNullable<z.ZodString>;
            source_packages: z.ZodArray<z.ZodUnknown, "many">;
            file_references: z.ZodArray<z.ZodUnknown, "many">;
            extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            dependencies: z.ZodArray<z.ZodObject<{
                purl: z.ZodString;
                extracted_requirement: z.ZodNullable<z.ZodString>;
                scope: z.ZodString;
                is_runtime: z.ZodBoolean;
                is_optional: z.ZodBoolean;
                is_resolved: z.ZodBoolean;
                resolved_package: z.ZodObject<{
                    type: z.ZodOptional<z.ZodString>;
                    namespace: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    version: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    qualifiers: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
                    subpath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    primary_language: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    release_date: z.ZodOptional<z.ZodNull>;
                    parties: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
                    keywords: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
                    homepage_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    download_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    sha1: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    md5: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    sha512: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    bug_tracking_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    code_view_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    vcs_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    copyright: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    holder: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    declared_license_expression: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    declared_license_expression_spdx: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    license_detections: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        license_expression: z.ZodString;
                        matches: z.ZodArray<z.ZodObject<{
                            score: z.ZodNumber;
                            start_line: z.ZodNumber;
                            end_line: z.ZodNumber;
                            matched_length: z.ZodNumber;
                            match_coverage: z.ZodNumber;
                            matcher: z.ZodString;
                            license_expression: z.ZodString;
                            rule_identifier: z.ZodString;
                            rule_relevance: z.ZodNumber;
                            rule_url: z.ZodNullable<z.ZodString>;
                            matched_text: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }>, "many">;
                        identifier: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }>, "many">>;
                    other_license_expression: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    other_license_expression_spdx: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    other_license_detections: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
                    extracted_license_statement: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    notice_text: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    source_packages: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
                    file_references: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
                    extra_data: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
                    dependencies: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        purl: z.ZodString;
                        extracted_requirement: z.ZodString;
                        scope: z.ZodString;
                        is_runtime: z.ZodBoolean;
                        is_optional: z.ZodBoolean;
                        is_resolved: z.ZodBoolean;
                        resolved_package: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
                        extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
                    }, "strip", z.ZodTypeAny, {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }, {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }>, "many">>;
                    repository_homepage_url: z.ZodOptional<z.ZodString>;
                    repository_download_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
                    api_data_url: z.ZodOptional<z.ZodString>;
                    datasource_id: z.ZodOptional<z.ZodString>;
                    purl: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                }, {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                }>;
                extra_data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            }, "strip", z.ZodTypeAny, {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }, {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }>, "many">;
            repository_homepage_url: z.ZodNullable<z.ZodString>;
            repository_download_url: z.ZodNullable<z.ZodString>;
            api_data_url: z.ZodNullable<z.ZodString>;
            datasource_id: z.ZodString;
            purl: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }[];
            purl: string | null;
            namespace: string | null;
            name: string | null;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: unknown[];
            repository_homepage_url: string | null;
            repository_download_url: string | null;
            api_data_url: string | null;
            datasource_id: string;
            holder: string | null;
            declared_license_expression: string | null;
            declared_license_expression_spdx: string | null;
            license_detections: {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }[];
            other_license_expression: string | null;
            other_license_expression_spdx: string | null;
            other_license_detections: unknown[];
            extracted_license_statement: string | null;
        }, {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }[];
            purl: string | null;
            namespace: string | null;
            name: string | null;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: unknown[];
            repository_homepage_url: string | null;
            repository_download_url: string | null;
            api_data_url: string | null;
            datasource_id: string;
            holder: string | null;
            declared_license_expression: string | null;
            declared_license_expression_spdx: string | null;
            license_detections: {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }[];
            other_license_expression: string | null;
            other_license_expression_spdx: string | null;
            other_license_detections: unknown[];
            extracted_license_statement: string | null;
        }>, "many">;
        for_packages: z.ZodArray<z.ZodUnknown, "many">;
        detected_license_expression: z.ZodNullable<z.ZodString>;
        detected_license_expression_spdx: z.ZodNullable<z.ZodString>;
        license_detections: z.ZodArray<z.ZodObject<{
            license_expression: z.ZodString;
            matches: z.ZodArray<z.ZodObject<{
                score: z.ZodNumber;
                start_line: z.ZodNumber;
                end_line: z.ZodNumber;
                matched_length: z.ZodNumber;
                match_coverage: z.ZodNumber;
                matcher: z.ZodString;
                license_expression: z.ZodString;
                rule_identifier: z.ZodString;
                rule_relevance: z.ZodNumber;
                rule_url: z.ZodNullable<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }, {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }>, "many">;
            identifier: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }[];
            identifier: string;
        }, {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }[];
            identifier: string;
        }>, "many">;
        license_clues: z.ZodArray<z.ZodUnknown, "many">;
        percentage_of_license_text: z.ZodNumber;
        copyrights: z.ZodArray<z.ZodObject<{
            copyright: z.ZodString;
            start_line: z.ZodNumber;
            end_line: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            copyright: string;
            start_line: number;
            end_line: number;
        }, {
            copyright: string;
            start_line: number;
            end_line: number;
        }>, "many">;
        holders: z.ZodArray<z.ZodObject<{
            holder: z.ZodString;
            start_line: z.ZodNumber;
            end_line: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            holder: string;
            start_line: number;
            end_line: number;
        }, {
            holder: string;
            start_line: number;
            end_line: number;
        }>, "many">;
        authors: z.ZodArray<z.ZodObject<{
            author: z.ZodString;
            start_line: z.ZodNumber;
            end_line: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            start_line: number;
            end_line: number;
            author: string;
        }, {
            start_line: number;
            end_line: number;
            author: string;
        }>, "many">;
        files_count: z.ZodNumber;
        dirs_count: z.ZodNumber;
        size_count: z.ZodNumber;
        scan_errors: z.ZodArray<z.ZodUnknown, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: string;
        date: string | null;
        files_count: number;
        name: string;
        size: number;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }[];
            identifier: string;
        }[];
        base_name: string;
        extension: string;
        mime_type: string | null;
        file_type: string | null;
        programming_language: string | null;
        is_binary: boolean;
        is_text: boolean;
        is_archive: boolean;
        is_media: boolean;
        is_source: boolean;
        is_script: boolean;
        package_data: {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }[];
            purl: string | null;
            namespace: string | null;
            name: string | null;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: unknown[];
            repository_homepage_url: string | null;
            repository_download_url: string | null;
            api_data_url: string | null;
            datasource_id: string;
            holder: string | null;
            declared_license_expression: string | null;
            declared_license_expression_spdx: string | null;
            license_detections: {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }[];
            other_license_expression: string | null;
            other_license_expression_spdx: string | null;
            other_license_detections: unknown[];
            extracted_license_statement: string | null;
        }[];
        for_packages: unknown[];
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_clues: unknown[];
        percentage_of_license_text: number;
        copyrights: {
            copyright: string;
            start_line: number;
            end_line: number;
        }[];
        holders: {
            holder: string;
            start_line: number;
            end_line: number;
        }[];
        authors: {
            start_line: number;
            end_line: number;
            author: string;
        }[];
        dirs_count: number;
        size_count: number;
        scan_errors: unknown[];
    }, {
        path: string;
        type: string;
        date: string | null;
        files_count: number;
        name: string;
        size: number;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }[];
            identifier: string;
        }[];
        base_name: string;
        extension: string;
        mime_type: string | null;
        file_type: string | null;
        programming_language: string | null;
        is_binary: boolean;
        is_text: boolean;
        is_archive: boolean;
        is_media: boolean;
        is_source: boolean;
        is_script: boolean;
        package_data: {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }[];
            purl: string | null;
            namespace: string | null;
            name: string | null;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: unknown[];
            repository_homepage_url: string | null;
            repository_download_url: string | null;
            api_data_url: string | null;
            datasource_id: string;
            holder: string | null;
            declared_license_expression: string | null;
            declared_license_expression_spdx: string | null;
            license_detections: {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }[];
            other_license_expression: string | null;
            other_license_expression_spdx: string | null;
            other_license_detections: unknown[];
            extracted_license_statement: string | null;
        }[];
        for_packages: unknown[];
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_clues: unknown[];
        percentage_of_license_text: number;
        copyrights: {
            copyright: string;
            start_line: number;
            end_line: number;
        }[];
        holders: {
            holder: string;
            start_line: number;
            end_line: number;
        }[];
        authors: {
            start_line: number;
            end_line: number;
            author: string;
        }[];
        dirs_count: number;
        size_count: number;
        scan_errors: unknown[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    files: {
        path: string;
        type: string;
        date: string | null;
        files_count: number;
        name: string;
        size: number;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }[];
            identifier: string;
        }[];
        base_name: string;
        extension: string;
        mime_type: string | null;
        file_type: string | null;
        programming_language: string | null;
        is_binary: boolean;
        is_text: boolean;
        is_archive: boolean;
        is_media: boolean;
        is_source: boolean;
        is_script: boolean;
        package_data: {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }[];
            purl: string | null;
            namespace: string | null;
            name: string | null;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: unknown[];
            repository_homepage_url: string | null;
            repository_download_url: string | null;
            api_data_url: string | null;
            datasource_id: string;
            holder: string | null;
            declared_license_expression: string | null;
            declared_license_expression_spdx: string | null;
            license_detections: {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }[];
            other_license_expression: string | null;
            other_license_expression_spdx: string | null;
            other_license_detections: unknown[];
            extracted_license_statement: string | null;
        }[];
        for_packages: unknown[];
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_clues: unknown[];
        percentage_of_license_text: number;
        copyrights: {
            copyright: string;
            start_line: number;
            end_line: number;
        }[];
        holders: {
            holder: string;
            start_line: number;
            end_line: number;
        }[];
        authors: {
            start_line: number;
            end_line: number;
            author: string;
        }[];
        dirs_count: number;
        size_count: number;
        scan_errors: unknown[];
    }[];
    headers: {
        message: string | null;
        options: {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--package": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
        };
        tool_name: string;
        tool_version: string;
        notice: string;
        start_timestamp: string;
        end_timestamp: string;
        output_format_version: string;
        duration: number;
        errors: unknown[];
        warnings: unknown[];
        extra_data: {
            system_environment: {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            };
            spdx_license_list_version: string;
            files_count: number;
        };
    }[];
    dependencies: {
        extra_data: {};
        purl: string;
        extracted_requirement: string | null;
        scope: string;
        is_runtime: boolean;
        is_optional: boolean;
        is_resolved: boolean;
        resolved_package: ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        }) & ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        } | undefined);
        datasource_id: string;
        dependency_uid: string;
        for_package_uid: string;
        datafile_path: string;
    }[];
    packages: {
        type: string;
        extra_data: {};
        purl: string;
        namespace: string | null;
        name: string;
        version: string;
        qualifiers: {};
        subpath: string | null;
        primary_language: string;
        description: string | null;
        release_date: string | null;
        parties: unknown[];
        keywords: unknown[];
        homepage_url: string | null;
        download_url: string;
        size: number | null;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        sha512: string | null;
        bug_tracking_url: string | null;
        code_view_url: string | null;
        vcs_url: string | null;
        copyright: string | null;
        notice_text: string | null;
        source_packages: unknown[];
        repository_homepage_url: string;
        repository_download_url: string;
        api_data_url: string;
        holder: string | null;
        declared_license_expression: string | null;
        declared_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }[];
            identifier: string;
        }[];
        other_license_expression: string | null;
        other_license_expression_spdx: string | null;
        other_license_detections: unknown[];
        extracted_license_statement: string | null;
        package_uid: string;
        datafile_paths: string[];
        datasource_ids: string[];
    }[];
    license_detections: {
        license_expression: string;
        identifier: string;
        detection_count: number;
    }[];
}, {
    files: {
        path: string;
        type: string;
        date: string | null;
        files_count: number;
        name: string;
        size: number;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
            }[];
            identifier: string;
        }[];
        base_name: string;
        extension: string;
        mime_type: string | null;
        file_type: string | null;
        programming_language: string | null;
        is_binary: boolean;
        is_text: boolean;
        is_archive: boolean;
        is_media: boolean;
        is_source: boolean;
        is_script: boolean;
        package_data: {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {
                    type?: string | undefined;
                    namespace?: string | undefined;
                    name?: string | undefined;
                    version?: string | null | undefined;
                    qualifiers?: {} | undefined;
                    subpath?: string | null | undefined;
                    primary_language?: string | undefined;
                    description?: string | null | undefined;
                    release_date?: null | undefined;
                    parties?: unknown[] | undefined;
                    keywords?: unknown[] | undefined;
                    homepage_url?: string | null | undefined;
                    download_url?: string | null | undefined;
                    size?: number | null | undefined;
                    sha1?: string | null | undefined;
                    md5?: string | null | undefined;
                    sha256?: string | null | undefined;
                    sha512?: string | null | undefined;
                    bug_tracking_url?: string | null | undefined;
                    code_view_url?: string | null | undefined;
                    vcs_url?: string | null | undefined;
                    copyright?: string | null | undefined;
                    holder?: string | null | undefined;
                    declared_license_expression?: string | null | undefined;
                    declared_license_expression_spdx?: string | null | undefined;
                    license_detections?: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[] | undefined;
                    other_license_expression?: string | null | undefined;
                    other_license_expression_spdx?: string | null | undefined;
                    other_license_detections?: unknown[] | undefined;
                    extracted_license_statement?: string | null | undefined;
                    notice_text?: string | null | undefined;
                    source_packages?: unknown[] | undefined;
                    file_references?: unknown[] | undefined;
                    extra_data?: {} | undefined;
                    dependencies?: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[] | undefined;
                    repository_homepage_url?: string | undefined;
                    repository_download_url?: string | null | undefined;
                    api_data_url?: string | undefined;
                    datasource_id?: string | undefined;
                    purl?: string | undefined;
                };
            }[];
            purl: string | null;
            namespace: string | null;
            name: string | null;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: unknown[];
            repository_homepage_url: string | null;
            repository_download_url: string | null;
            api_data_url: string | null;
            datasource_id: string;
            holder: string | null;
            declared_license_expression: string | null;
            declared_license_expression_spdx: string | null;
            license_detections: {
                license_expression: string;
                matches: {
                    license_expression: string;
                    score: number;
                    start_line: number;
                    end_line: number;
                    matched_length: number;
                    match_coverage: number;
                    matcher: string;
                    rule_identifier: string;
                    rule_relevance: number;
                    rule_url: string | null;
                }[];
                identifier: string;
            }[];
            other_license_expression: string | null;
            other_license_expression_spdx: string | null;
            other_license_detections: unknown[];
            extracted_license_statement: string | null;
        }[];
        for_packages: unknown[];
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_clues: unknown[];
        percentage_of_license_text: number;
        copyrights: {
            copyright: string;
            start_line: number;
            end_line: number;
        }[];
        holders: {
            holder: string;
            start_line: number;
            end_line: number;
        }[];
        authors: {
            start_line: number;
            end_line: number;
            author: string;
        }[];
        dirs_count: number;
        size_count: number;
        scan_errors: unknown[];
    }[];
    headers: {
        message: string | null;
        options: {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--package": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
        };
        tool_name: string;
        tool_version: string;
        notice: string;
        start_timestamp: string;
        end_timestamp: string;
        output_format_version: string;
        duration: number;
        errors: unknown[];
        warnings: unknown[];
        extra_data: {
            system_environment: {
                operating_system: string;
                cpu_architecture: string;
                platform: string;
                platform_version: string;
                python_version: string;
            };
            spdx_license_list_version: string;
            files_count: number;
        };
    }[];
    dependencies: {
        extra_data: {};
        purl: string;
        extracted_requirement: string | null;
        scope: string;
        is_runtime: boolean;
        is_optional: boolean;
        is_resolved: boolean;
        resolved_package: ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        }) & ({} | {
            type: string;
            extra_data: {};
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: {};
            }[];
            purl: string;
            namespace: string;
            name: string;
            version: string | null;
            qualifiers: {};
            subpath: string | null;
            primary_language: string;
            description: string | null;
            release_date: string | null;
            parties: unknown[];
            keywords: unknown[];
            homepage_url: string | null;
            download_url: string | null;
            size: number | null;
            sha1: string | null;
            md5: string | null;
            sha256: string | null;
            sha512: string | null;
            bug_tracking_url: string | null;
            code_view_url: string | null;
            vcs_url: string | null;
            copyright: string | null;
            license_expression: string | null;
            declared_license: string | null;
            notice_text: string | null;
            source_packages: unknown[];
            file_references: {
                path: string;
                extra_data: {};
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
            }[][];
            repository_homepage_url: string;
            repository_download_url: string | null;
            api_data_url: string;
            datasource_id: string;
        } | undefined);
        datasource_id: string;
        dependency_uid: string;
        for_package_uid: string;
        datafile_path: string;
    }[];
    packages: {
        type: string;
        extra_data: {};
        purl: string;
        namespace: string | null;
        name: string;
        version: string;
        qualifiers: {};
        subpath: string | null;
        primary_language: string;
        description: string | null;
        release_date: string | null;
        parties: unknown[];
        keywords: unknown[];
        homepage_url: string | null;
        download_url: string;
        size: number | null;
        sha1: string | null;
        md5: string | null;
        sha256: string | null;
        sha512: string | null;
        bug_tracking_url: string | null;
        code_view_url: string | null;
        vcs_url: string | null;
        copyright: string | null;
        notice_text: string | null;
        source_packages: unknown[];
        repository_homepage_url: string;
        repository_download_url: string;
        api_data_url: string;
        holder: string | null;
        declared_license_expression: string | null;
        declared_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
                matched_length: number;
                match_coverage: number;
                matcher: string;
                rule_identifier: string;
                rule_relevance: number;
                rule_url: string | null;
                matched_text: string;
            }[];
            identifier: string;
        }[];
        other_license_expression: string | null;
        other_license_expression_spdx: string | null;
        other_license_detections: unknown[];
        extracted_license_statement: string | null;
        package_uid: string;
        datafile_paths: string[];
        datasource_ids: string[];
    }[];
    license_detections: {
        license_expression: string;
        identifier: string;
        detection_count: number;
    }[];
}>;

declare const dosApi: [{
    method: "post";
    path: "/scan-results";
    description: "Get scan results for specified purl";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            purl: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            purl: string;
        }, {
            purl: string;
        }>;
    }];
    response: zod.ZodObject<{
        state: zod.ZodObject<{
            status: zod.ZodString;
            id: zod.ZodNullable<zod.ZodString>;
        }, "strip", zod.ZodTypeAny, {
            status: string;
            id: string | null;
        }, {
            status: string;
            id: string | null;
        }>;
        results: zod.ZodUnion<[zod.ZodNull, zod.ZodObject<{
            licenses: zod.ZodArray<zod.ZodObject<{
                license: zod.ZodString;
                location: zod.ZodObject<{
                    path: zod.ZodString;
                    start_line: zod.ZodNumber;
                    end_line: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    path: string;
                    start_line: number;
                    end_line: number;
                }, {
                    path: string;
                    start_line: number;
                    end_line: number;
                }>;
                score: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                score: number;
                license: string;
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
            }, {
                score: number;
                license: string;
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
            }>, "many">;
            copyrights: zod.ZodArray<zod.ZodObject<{
                statement: zod.ZodString;
                location: zod.ZodObject<{
                    path: zod.ZodString;
                    start_line: zod.ZodNumber;
                    end_line: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    path: string;
                    start_line: number;
                    end_line: number;
                }, {
                    path: string;
                    start_line: number;
                    end_line: number;
                }>;
            }, "strip", zod.ZodTypeAny, {
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
                statement: string;
            }, {
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
                statement: string;
            }>, "many">;
        }, "strip", zod.ZodTypeAny, {
            copyrights: {
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
                statement: string;
            }[];
            licenses: {
                score: number;
                license: string;
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
            }[];
        }, {
            copyrights: {
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
                statement: string;
            }[];
            licenses: {
                score: number;
                license: string;
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
            }[];
        }>]>;
    }, "strip", zod.ZodTypeAny, {
        state: {
            status: string;
            id: string | null;
        };
        results: {
            copyrights: {
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
                statement: string;
            }[];
            licenses: {
                score: number;
                license: string;
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
            }[];
        } | null;
    }, {
        state: {
            status: string;
            id: string | null;
        };
        results: {
            copyrights: {
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
                statement: string;
            }[];
            licenses: {
                score: number;
                license: string;
                location: {
                    path: string;
                    start_line: number;
                    end_line: number;
                };
            }[];
        } | null;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }];
}, {
    method: "delete";
    path: "/scan-results";
    description: "Delete scan results for specified purl";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            purl: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            purl: string;
        }, {
            purl: string;
        }>;
    }];
    response: zod.ZodObject<{
        message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }];
}, {
    method: "post";
    path: "/upload-url";
    description: "Get presigned upload URL for S3 object storage with specified object key";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            key: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    }];
    response: zod.ZodObject<{
        success: zod.ZodBoolean;
        presignedUrl: zod.ZodOptional<zod.ZodString>;
        message: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
        success: boolean;
        presignedUrl?: string | undefined;
        message?: string | undefined;
    }, {
        success: boolean;
        presignedUrl?: string | undefined;
        message?: string | undefined;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }];
}, {
    method: "post";
    path: "/job";
    description: "Add scanner job for package";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            zipFileKey: zod.ZodString;
            purl: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            purl: string;
            zipFileKey: string;
        }, {
            purl: string;
            zipFileKey: string;
        }>;
    }];
    response: zod.ZodObject<{
        scannerJobId: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        scannerJobId: string;
    }, {
        scannerJobId: string;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }];
}, {
    method: "get";
    path: "/job-state/:id";
    description: "Get state for scanner job with given id";
    parameters: [{
        name: "id";
        type: "Path";
        schema: zod.ZodString;
    }];
    response: zod.ZodObject<{
        state: zod.ZodObject<{
            status: zod.ZodString;
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
            status: string;
        }, {
            message: string;
            status: string;
        }>;
    }, "strip", zod.ZodTypeAny, {
        state: {
            message: string;
            status: string;
        };
    }, {
        state: {
            message: string;
            status: string;
        };
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }];
}, {
    method: "put";
    path: "/job-state/:id";
    description: "Edit scanner job state";
    parameters: [{
        name: "id";
        type: "Path";
        schema: zod.ZodString;
    }, {
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            state: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            state: string;
        }, {
            state: string;
        }>;
    }];
    response: zod.ZodObject<{
        message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }];
}, {
    method: "post";
    path: "/job-results";
    description: "Save scanner job results";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            id: zod.ZodString;
            result: zod.ZodObject<{
                headers: zod.ZodArray<zod.ZodObject<{
                    tool_name: zod.ZodString;
                    tool_version: zod.ZodString;
                    options: zod.ZodObject<{
                        input: zod.ZodArray<zod.ZodString, "many">;
                        "--copyright": zod.ZodBoolean;
                        "--info": zod.ZodBoolean;
                        "--json": zod.ZodOptional<zod.ZodString>;
                        "--json-pp": zod.ZodOptional<zod.ZodString>;
                        "--license": zod.ZodBoolean;
                        "--package": zod.ZodBoolean;
                    }, "strip", zod.ZodTypeAny, {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    }, {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    }>;
                    notice: zod.ZodString;
                    start_timestamp: zod.ZodString;
                    end_timestamp: zod.ZodString;
                    output_format_version: zod.ZodString;
                    duration: zod.ZodNumber;
                    message: zod.ZodNullable<zod.ZodString>;
                    errors: zod.ZodArray<zod.ZodUnknown, "many">;
                    warnings: zod.ZodArray<zod.ZodUnknown, "many">;
                    extra_data: zod.ZodObject<{
                        system_environment: zod.ZodObject<{
                            operating_system: zod.ZodString;
                            cpu_architecture: zod.ZodString;
                            platform: zod.ZodString;
                            platform_version: zod.ZodString;
                            python_version: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        }, {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        }>;
                        spdx_license_list_version: zod.ZodString;
                        files_count: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    }, {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    }>;
                }, "strip", zod.ZodTypeAny, {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
                    duration: number;
                    errors: unknown[];
                    warnings: unknown[];
                    extra_data: {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    };
                }, {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
                    duration: number;
                    errors: unknown[];
                    warnings: unknown[];
                    extra_data: {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    };
                }>, "many">;
                dependencies: zod.ZodArray<zod.ZodObject<{
                    purl: zod.ZodString;
                    extracted_requirement: zod.ZodNullable<zod.ZodString>;
                    scope: zod.ZodString;
                    is_runtime: zod.ZodBoolean;
                    is_optional: zod.ZodBoolean;
                    is_resolved: zod.ZodBoolean;
                    resolved_package: zod.ZodUnion<[zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>, zod.ZodObject<{
                        type: zod.ZodString;
                        namespace: zod.ZodString;
                        name: zod.ZodString;
                        version: zod.ZodNullable<zod.ZodString>;
                        qualifiers: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        subpath: zod.ZodNullable<zod.ZodString>;
                        primary_language: zod.ZodString;
                        description: zod.ZodNullable<zod.ZodString>;
                        release_date: zod.ZodNullable<zod.ZodString>;
                        parties: zod.ZodArray<zod.ZodUnknown, "many">;
                        keywords: zod.ZodArray<zod.ZodUnknown, "many">;
                        homepage_url: zod.ZodNullable<zod.ZodString>;
                        download_url: zod.ZodNullable<zod.ZodString>;
                        size: zod.ZodNullable<zod.ZodNumber>;
                        sha1: zod.ZodNullable<zod.ZodString>;
                        md5: zod.ZodNullable<zod.ZodString>;
                        sha256: zod.ZodNullable<zod.ZodString>;
                        sha512: zod.ZodNullable<zod.ZodString>;
                        bug_tracking_url: zod.ZodNullable<zod.ZodString>;
                        code_view_url: zod.ZodNullable<zod.ZodString>;
                        vcs_url: zod.ZodNullable<zod.ZodString>;
                        copyright: zod.ZodNullable<zod.ZodString>;
                        license_expression: zod.ZodNullable<zod.ZodString>;
                        declared_license: zod.ZodNullable<zod.ZodString>;
                        notice_text: zod.ZodNullable<zod.ZodString>;
                        source_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                        file_references: zod.ZodArray<zod.ZodArray<zod.ZodObject<{
                            path: zod.ZodString;
                            size: zod.ZodNumber;
                            sha1: zod.ZodNullable<zod.ZodString>;
                            md5: zod.ZodNullable<zod.ZodString>;
                            sha256: zod.ZodNullable<zod.ZodString>;
                            sha512: zod.ZodNullable<zod.ZodString>;
                            extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        }, "strip", zod.ZodTypeAny, {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }, {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }>, "many">, "many">;
                        extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        dependencies: zod.ZodArray<zod.ZodObject<{
                            purl: zod.ZodString;
                            extracted_requirement: zod.ZodNullable<zod.ZodString>;
                            scope: zod.ZodString;
                            is_runtime: zod.ZodBoolean;
                            is_optional: zod.ZodBoolean;
                            is_resolved: zod.ZodBoolean;
                            resolved_package: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                            extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        }, "strip", zod.ZodTypeAny, {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }, {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }>, "many">;
                        repository_homepage_url: zod.ZodString;
                        repository_download_url: zod.ZodNullable<zod.ZodString>;
                        api_data_url: zod.ZodString;
                        datasource_id: zod.ZodString;
                        purl: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }, {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }>]>;
                    extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    dependency_uid: zod.ZodString;
                    for_package_uid: zod.ZodString;
                    datafile_path: zod.ZodString;
                    datasource_id: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    extra_data: {};
                    purl: string;
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    } | undefined);
                    datasource_id: string;
                    dependency_uid: string;
                    for_package_uid: string;
                    datafile_path: string;
                }, {
                    extra_data: {};
                    purl: string;
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    } | undefined);
                    datasource_id: string;
                    dependency_uid: string;
                    for_package_uid: string;
                    datafile_path: string;
                }>, "many">;
                packages: zod.ZodArray<zod.ZodObject<{
                    type: zod.ZodString;
                    namespace: zod.ZodNullable<zod.ZodString>;
                    name: zod.ZodString;
                    version: zod.ZodString;
                    qualifiers: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    subpath: zod.ZodNullable<zod.ZodString>;
                    primary_language: zod.ZodString;
                    description: zod.ZodNullable<zod.ZodString>;
                    release_date: zod.ZodNullable<zod.ZodString>;
                    parties: zod.ZodArray<zod.ZodUnknown, "many">;
                    keywords: zod.ZodArray<zod.ZodUnknown, "many">;
                    homepage_url: zod.ZodNullable<zod.ZodString>;
                    download_url: zod.ZodString;
                    size: zod.ZodNullable<zod.ZodNumber>;
                    sha1: zod.ZodNullable<zod.ZodString>;
                    md5: zod.ZodNullable<zod.ZodString>;
                    sha256: zod.ZodNullable<zod.ZodString>;
                    sha512: zod.ZodNullable<zod.ZodString>;
                    bug_tracking_url: zod.ZodNullable<zod.ZodString>;
                    code_view_url: zod.ZodNullable<zod.ZodString>;
                    vcs_url: zod.ZodNullable<zod.ZodString>;
                    copyright: zod.ZodNullable<zod.ZodString>;
                    holder: zod.ZodNullable<zod.ZodString>;
                    declared_license_expression: zod.ZodNullable<zod.ZodString>;
                    declared_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                    license_detections: zod.ZodArray<zod.ZodObject<{
                        license_expression: zod.ZodString;
                        matches: zod.ZodArray<zod.ZodObject<{
                            score: zod.ZodNumber;
                            start_line: zod.ZodNumber;
                            end_line: zod.ZodNumber;
                            matched_length: zod.ZodNumber;
                            match_coverage: zod.ZodNumber;
                            matcher: zod.ZodString;
                            license_expression: zod.ZodString;
                            rule_identifier: zod.ZodString;
                            rule_relevance: zod.ZodNumber;
                            rule_url: zod.ZodNullable<zod.ZodString>;
                            matched_text: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }>, "many">;
                        identifier: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }>, "many">;
                    other_license_expression: zod.ZodNullable<zod.ZodString>;
                    other_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                    other_license_detections: zod.ZodArray<zod.ZodUnknown, "many">;
                    extracted_license_statement: zod.ZodNullable<zod.ZodString>;
                    notice_text: zod.ZodNullable<zod.ZodString>;
                    source_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                    extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    repository_homepage_url: zod.ZodString;
                    repository_download_url: zod.ZodString;
                    api_data_url: zod.ZodString;
                    package_uid: zod.ZodString;
                    datafile_paths: zod.ZodArray<zod.ZodString, "many">;
                    datasource_ids: zod.ZodArray<zod.ZodString, "many">;
                    purl: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    type: string;
                    extra_data: {};
                    purl: string;
                    namespace: string | null;
                    name: string;
                    version: string;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }, {
                    type: string;
                    extra_data: {};
                    purl: string;
                    namespace: string | null;
                    name: string;
                    version: string;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }>, "many">;
                license_detections: zod.ZodArray<zod.ZodObject<{
                    identifier: zod.ZodString;
                    license_expression: zod.ZodString;
                    detection_count: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    license_expression: string;
                    identifier: string;
                    detection_count: number;
                }, {
                    license_expression: string;
                    identifier: string;
                    detection_count: number;
                }>, "many">;
                files: zod.ZodArray<zod.ZodObject<{
                    path: zod.ZodString;
                    type: zod.ZodString;
                    name: zod.ZodString;
                    base_name: zod.ZodString;
                    extension: zod.ZodString;
                    size: zod.ZodNumber;
                    date: zod.ZodNullable<zod.ZodString>;
                    sha1: zod.ZodNullable<zod.ZodString>;
                    md5: zod.ZodNullable<zod.ZodString>;
                    sha256: zod.ZodNullable<zod.ZodString>;
                    mime_type: zod.ZodNullable<zod.ZodString>;
                    file_type: zod.ZodNullable<zod.ZodString>;
                    programming_language: zod.ZodNullable<zod.ZodString>;
                    is_binary: zod.ZodBoolean;
                    is_text: zod.ZodBoolean;
                    is_archive: zod.ZodBoolean;
                    is_media: zod.ZodBoolean;
                    is_source: zod.ZodBoolean;
                    is_script: zod.ZodBoolean;
                    package_data: zod.ZodArray<zod.ZodObject<{
                        type: zod.ZodString;
                        namespace: zod.ZodNullable<zod.ZodString>;
                        name: zod.ZodNullable<zod.ZodString>;
                        version: zod.ZodNullable<zod.ZodString>;
                        qualifiers: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        subpath: zod.ZodNullable<zod.ZodString>;
                        primary_language: zod.ZodString;
                        description: zod.ZodNullable<zod.ZodString>;
                        release_date: zod.ZodNullable<zod.ZodString>;
                        parties: zod.ZodArray<zod.ZodUnknown, "many">;
                        keywords: zod.ZodArray<zod.ZodUnknown, "many">;
                        homepage_url: zod.ZodNullable<zod.ZodString>;
                        download_url: zod.ZodNullable<zod.ZodString>;
                        size: zod.ZodNullable<zod.ZodNumber>;
                        sha1: zod.ZodNullable<zod.ZodString>;
                        md5: zod.ZodNullable<zod.ZodString>;
                        sha256: zod.ZodNullable<zod.ZodString>;
                        sha512: zod.ZodNullable<zod.ZodString>;
                        bug_tracking_url: zod.ZodNullable<zod.ZodString>;
                        code_view_url: zod.ZodNullable<zod.ZodString>;
                        vcs_url: zod.ZodNullable<zod.ZodString>;
                        copyright: zod.ZodNullable<zod.ZodString>;
                        holder: zod.ZodNullable<zod.ZodString>;
                        declared_license_expression: zod.ZodNullable<zod.ZodString>;
                        declared_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                        license_detections: zod.ZodArray<zod.ZodObject<{
                            license_expression: zod.ZodString;
                            matches: zod.ZodArray<zod.ZodObject<{
                                score: zod.ZodNumber;
                                start_line: zod.ZodNumber;
                                end_line: zod.ZodNumber;
                                matched_length: zod.ZodNumber;
                                match_coverage: zod.ZodNumber;
                                matcher: zod.ZodString;
                                license_expression: zod.ZodString;
                                rule_identifier: zod.ZodString;
                                rule_relevance: zod.ZodNumber;
                                rule_url: zod.ZodNullable<zod.ZodString>;
                            }, "strip", zod.ZodTypeAny, {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }, {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }>, "many">;
                            identifier: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }, {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }>, "many">;
                        other_license_expression: zod.ZodNullable<zod.ZodString>;
                        other_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                        other_license_detections: zod.ZodArray<zod.ZodUnknown, "many">;
                        extracted_license_statement: zod.ZodNullable<zod.ZodString>;
                        notice_text: zod.ZodNullable<zod.ZodString>;
                        source_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                        file_references: zod.ZodArray<zod.ZodUnknown, "many">;
                        extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        dependencies: zod.ZodArray<zod.ZodObject<{
                            purl: zod.ZodString;
                            extracted_requirement: zod.ZodNullable<zod.ZodString>;
                            scope: zod.ZodString;
                            is_runtime: zod.ZodBoolean;
                            is_optional: zod.ZodBoolean;
                            is_resolved: zod.ZodBoolean;
                            resolved_package: zod.ZodObject<{
                                type: zod.ZodOptional<zod.ZodString>;
                                namespace: zod.ZodOptional<zod.ZodString>;
                                name: zod.ZodOptional<zod.ZodString>;
                                version: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
                                qualifiers: zod.ZodOptional<zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>>;
                                subpath: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                primary_language: zod.ZodOptional<zod.ZodString>;
                                description: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                release_date: zod.ZodOptional<zod.ZodNull>;
                                parties: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                                keywords: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                                homepage_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                download_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                size: zod.ZodOptional<zod.ZodNullable<zod.ZodNumber>>;
                                sha1: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                md5: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                sha256: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                sha512: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                bug_tracking_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                code_view_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                vcs_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                copyright: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                holder: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                declared_license_expression: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                declared_license_expression_spdx: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                license_detections: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                                    license_expression: zod.ZodString;
                                    matches: zod.ZodArray<zod.ZodObject<{
                                        score: zod.ZodNumber;
                                        start_line: zod.ZodNumber;
                                        end_line: zod.ZodNumber;
                                        matched_length: zod.ZodNumber;
                                        match_coverage: zod.ZodNumber;
                                        matcher: zod.ZodString;
                                        license_expression: zod.ZodString;
                                        rule_identifier: zod.ZodString;
                                        rule_relevance: zod.ZodNumber;
                                        rule_url: zod.ZodNullable<zod.ZodString>;
                                        matched_text: zod.ZodString;
                                    }, "strip", zod.ZodTypeAny, {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }, {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }>, "many">;
                                    identifier: zod.ZodString;
                                }, "strip", zod.ZodTypeAny, {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }, {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }>, "many">>;
                                other_license_expression: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                other_license_expression_spdx: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                other_license_detections: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                                extracted_license_statement: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                notice_text: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                                source_packages: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                                file_references: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                                extra_data: zod.ZodOptional<zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>>;
                                dependencies: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                                    purl: zod.ZodString;
                                    extracted_requirement: zod.ZodString;
                                    scope: zod.ZodString;
                                    is_runtime: zod.ZodBoolean;
                                    is_optional: zod.ZodBoolean;
                                    is_resolved: zod.ZodBoolean;
                                    resolved_package: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                                    extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                                }, "strip", zod.ZodTypeAny, {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }, {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }>, "many">>;
                                repository_homepage_url: zod.ZodOptional<zod.ZodString>;
                                repository_download_url: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
                                api_data_url: zod.ZodOptional<zod.ZodString>;
                                datasource_id: zod.ZodOptional<zod.ZodString>;
                                purl: zod.ZodOptional<zod.ZodString>;
                            }, "strip", zod.ZodTypeAny, {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            }, {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            }>;
                            extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        }, "strip", zod.ZodTypeAny, {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }, {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }>, "many">;
                        repository_homepage_url: zod.ZodNullable<zod.ZodString>;
                        repository_download_url: zod.ZodNullable<zod.ZodString>;
                        api_data_url: zod.ZodNullable<zod.ZodString>;
                        datasource_id: zod.ZodString;
                        purl: zod.ZodNullable<zod.ZodString>;
                    }, "strip", zod.ZodTypeAny, {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }, {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }>, "many">;
                    for_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                    detected_license_expression: zod.ZodNullable<zod.ZodString>;
                    detected_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                    license_detections: zod.ZodArray<zod.ZodObject<{
                        license_expression: zod.ZodString;
                        matches: zod.ZodArray<zod.ZodObject<{
                            score: zod.ZodNumber;
                            start_line: zod.ZodNumber;
                            end_line: zod.ZodNumber;
                            matched_length: zod.ZodNumber;
                            match_coverage: zod.ZodNumber;
                            matcher: zod.ZodString;
                            license_expression: zod.ZodString;
                            rule_identifier: zod.ZodString;
                            rule_relevance: zod.ZodNumber;
                            rule_url: zod.ZodNullable<zod.ZodString>;
                        }, "strip", zod.ZodTypeAny, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }>, "many">;
                        identifier: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }>, "many">;
                    license_clues: zod.ZodArray<zod.ZodUnknown, "many">;
                    percentage_of_license_text: zod.ZodNumber;
                    copyrights: zod.ZodArray<zod.ZodObject<{
                        copyright: zod.ZodString;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }, {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }>, "many">;
                    holders: zod.ZodArray<zod.ZodObject<{
                        holder: zod.ZodString;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }, {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }>, "many">;
                    authors: zod.ZodArray<zod.ZodObject<{
                        author: zod.ZodString;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }, {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }>, "many">;
                    files_count: zod.ZodNumber;
                    dirs_count: zod.ZodNumber;
                    size_count: zod.ZodNumber;
                    scan_errors: zod.ZodArray<zod.ZodUnknown, "many">;
                }, "strip", zod.ZodTypeAny, {
                    path: string;
                    type: string;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    base_name: string;
                    extension: string;
                    mime_type: string | null;
                    file_type: string | null;
                    programming_language: string | null;
                    is_binary: boolean;
                    is_text: boolean;
                    is_archive: boolean;
                    is_media: boolean;
                    is_source: boolean;
                    is_script: boolean;
                    package_data: {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }[];
                    for_packages: unknown[];
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_clues: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }, {
                    path: string;
                    type: string;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    base_name: string;
                    extension: string;
                    mime_type: string | null;
                    file_type: string | null;
                    programming_language: string | null;
                    is_binary: boolean;
                    is_text: boolean;
                    is_archive: boolean;
                    is_media: boolean;
                    is_source: boolean;
                    is_script: boolean;
                    package_data: {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }[];
                    for_packages: unknown[];
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_clues: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }>, "many">;
            }, "strip", zod.ZodTypeAny, {
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    base_name: string;
                    extension: string;
                    mime_type: string | null;
                    file_type: string | null;
                    programming_language: string | null;
                    is_binary: boolean;
                    is_text: boolean;
                    is_archive: boolean;
                    is_media: boolean;
                    is_source: boolean;
                    is_script: boolean;
                    package_data: {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }[];
                    for_packages: unknown[];
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_clues: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
                    duration: number;
                    errors: unknown[];
                    warnings: unknown[];
                    extra_data: {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    };
                }[];
                dependencies: {
                    extra_data: {};
                    purl: string;
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    } | undefined);
                    datasource_id: string;
                    dependency_uid: string;
                    for_package_uid: string;
                    datafile_path: string;
                }[];
                packages: {
                    type: string;
                    extra_data: {};
                    purl: string;
                    namespace: string | null;
                    name: string;
                    version: string;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                license_detections: {
                    license_expression: string;
                    identifier: string;
                    detection_count: number;
                }[];
            }, {
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    base_name: string;
                    extension: string;
                    mime_type: string | null;
                    file_type: string | null;
                    programming_language: string | null;
                    is_binary: boolean;
                    is_text: boolean;
                    is_archive: boolean;
                    is_media: boolean;
                    is_source: boolean;
                    is_script: boolean;
                    package_data: {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }[];
                    for_packages: unknown[];
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_clues: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
                    duration: number;
                    errors: unknown[];
                    warnings: unknown[];
                    extra_data: {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    };
                }[];
                dependencies: {
                    extra_data: {};
                    purl: string;
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    } | undefined);
                    datasource_id: string;
                    dependency_uid: string;
                    for_package_uid: string;
                    datafile_path: string;
                }[];
                packages: {
                    type: string;
                    extra_data: {};
                    purl: string;
                    namespace: string | null;
                    name: string;
                    version: string;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                license_detections: {
                    license_expression: string;
                    identifier: string;
                    detection_count: number;
                }[];
            }>;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            result: {
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    base_name: string;
                    extension: string;
                    mime_type: string | null;
                    file_type: string | null;
                    programming_language: string | null;
                    is_binary: boolean;
                    is_text: boolean;
                    is_archive: boolean;
                    is_media: boolean;
                    is_source: boolean;
                    is_script: boolean;
                    package_data: {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }[];
                    for_packages: unknown[];
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_clues: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
                    duration: number;
                    errors: unknown[];
                    warnings: unknown[];
                    extra_data: {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    };
                }[];
                dependencies: {
                    extra_data: {};
                    purl: string;
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    } | undefined);
                    datasource_id: string;
                    dependency_uid: string;
                    for_package_uid: string;
                    datafile_path: string;
                }[];
                packages: {
                    type: string;
                    extra_data: {};
                    purl: string;
                    namespace: string | null;
                    name: string;
                    version: string;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                license_detections: {
                    license_expression: string;
                    identifier: string;
                    detection_count: number;
                }[];
            };
        }, {
            id: string;
            result: {
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    base_name: string;
                    extension: string;
                    mime_type: string | null;
                    file_type: string | null;
                    programming_language: string | null;
                    is_binary: boolean;
                    is_text: boolean;
                    is_archive: boolean;
                    is_media: boolean;
                    is_source: boolean;
                    is_script: boolean;
                    package_data: {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | null | undefined;
                                qualifiers?: {} | undefined;
                                subpath?: string | null | undefined;
                                primary_language?: string | undefined;
                                description?: string | null | undefined;
                                release_date?: null | undefined;
                                parties?: unknown[] | undefined;
                                keywords?: unknown[] | undefined;
                                homepage_url?: string | null | undefined;
                                download_url?: string | null | undefined;
                                size?: number | null | undefined;
                                sha1?: string | null | undefined;
                                md5?: string | null | undefined;
                                sha256?: string | null | undefined;
                                sha512?: string | null | undefined;
                                bug_tracking_url?: string | null | undefined;
                                code_view_url?: string | null | undefined;
                                vcs_url?: string | null | undefined;
                                copyright?: string | null | undefined;
                                holder?: string | null | undefined;
                                declared_license_expression?: string | null | undefined;
                                declared_license_expression_spdx?: string | null | undefined;
                                license_detections?: {
                                    license_expression: string;
                                    matches: {
                                        license_expression: string;
                                        score: number;
                                        start_line: number;
                                        end_line: number;
                                        matched_length: number;
                                        match_coverage: number;
                                        matcher: string;
                                        rule_identifier: string;
                                        rule_relevance: number;
                                        rule_url: string | null;
                                        matched_text: string;
                                    }[];
                                    identifier: string;
                                }[] | undefined;
                                other_license_expression?: string | null | undefined;
                                other_license_expression_spdx?: string | null | undefined;
                                other_license_detections?: unknown[] | undefined;
                                extracted_license_statement?: string | null | undefined;
                                notice_text?: string | null | undefined;
                                source_packages?: unknown[] | undefined;
                                file_references?: unknown[] | undefined;
                                extra_data?: {} | undefined;
                                dependencies?: {
                                    extra_data: {};
                                    purl: string;
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | null | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        purl: string | null;
                        namespace: string | null;
                        name: string | null;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                        holder: string | null;
                        declared_license_expression: string | null;
                        declared_license_expression_spdx: string | null;
                        license_detections: {
                            license_expression: string;
                            matches: {
                                license_expression: string;
                                score: number;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }[];
                            identifier: string;
                        }[];
                        other_license_expression: string | null;
                        other_license_expression_spdx: string | null;
                        other_license_detections: unknown[];
                        extracted_license_statement: string | null;
                    }[];
                    for_packages: unknown[];
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_clues: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        holder: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--package": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
                    duration: number;
                    errors: unknown[];
                    warnings: unknown[];
                    extra_data: {
                        system_environment: {
                            operating_system: string;
                            cpu_architecture: string;
                            platform: string;
                            platform_version: string;
                            python_version: string;
                        };
                        spdx_license_list_version: string;
                        files_count: number;
                    };
                }[];
                dependencies: {
                    extra_data: {};
                    purl: string;
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        extra_data: {};
                        dependencies: {
                            extra_data: {};
                            purl: string;
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        purl: string;
                        namespace: string;
                        name: string;
                        version: string | null;
                        qualifiers: {};
                        subpath: string | null;
                        primary_language: string;
                        description: string | null;
                        release_date: string | null;
                        parties: unknown[];
                        keywords: unknown[];
                        homepage_url: string | null;
                        download_url: string | null;
                        size: number | null;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        copyright: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha256: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    } | undefined);
                    datasource_id: string;
                    dependency_uid: string;
                    for_package_uid: string;
                    datafile_path: string;
                }[];
                packages: {
                    type: string;
                    extra_data: {};
                    purl: string;
                    namespace: string | null;
                    name: string;
                    version: string;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                            matched_text: string;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                license_detections: {
                    license_expression: string;
                    identifier: string;
                    detection_count: number;
                }[];
            };
        }>;
    }];
    response: zod.ZodObject<{
        message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }];
}];

declare const DBScannerJobSchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    state: z.ZodString;
    scannerName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    scannerVersion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    scannerConfig: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    scanStartTS: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    scanEndTS: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    spdxLicenseListVersion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    packageId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
    packageId: number;
    scannerName?: string | null | undefined;
    scannerVersion?: string | null | undefined;
    scannerConfig?: string | null | undefined;
    duration?: number | null | undefined;
    scanStartTS?: Date | null | undefined;
    scanEndTS?: Date | null | undefined;
    spdxLicenseListVersion?: string | null | undefined;
}, {
    id: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
    packageId: number;
    scannerName?: string | null | undefined;
    scannerVersion?: string | null | undefined;
    scannerConfig?: string | null | undefined;
    duration?: number | null | undefined;
    scanStartTS?: Date | null | undefined;
    scanEndTS?: Date | null | undefined;
    spdxLicenseListVersion?: string | null | undefined;
}>;
type DBScannerJobType = z.infer<typeof CreateScannerJobSchema>;
declare const CreateScannerJobSchema: z.ZodObject<{
    data: z.ZodObject<{
        state: z.ZodString;
        packageId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        state: string;
        packageId: number;
    }, {
        state: string;
        packageId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        state: string;
        packageId: number;
    };
}, {
    data: {
        state: string;
        packageId: number;
    };
}>;
type CreateScannerJobInput = z.infer<typeof CreateScannerJobSchema>;
declare const UpdateScannerJobSchema: z.ZodObject<{
    id: z.ZodString;
    data: z.ZodObject<{
        state: z.ZodOptional<z.ZodString>;
        scannerName: z.ZodOptional<z.ZodString>;
        scannerVersion: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodNumber>;
        scanStartTS: z.ZodOptional<z.ZodDate>;
        scanEndTS: z.ZodOptional<z.ZodDate>;
        spdxLicenseListVersion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        duration?: number | undefined;
        scanStartTS?: Date | undefined;
        scanEndTS?: Date | undefined;
        spdxLicenseListVersion?: string | undefined;
    }, {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        duration?: number | undefined;
        scanStartTS?: Date | undefined;
        scanEndTS?: Date | undefined;
        spdxLicenseListVersion?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        duration?: number | undefined;
        scanStartTS?: Date | undefined;
        scanEndTS?: Date | undefined;
        spdxLicenseListVersion?: string | undefined;
    };
    id: string;
}, {
    data: {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        duration?: number | undefined;
        scanStartTS?: Date | undefined;
        scanEndTS?: Date | undefined;
        spdxLicenseListVersion?: string | undefined;
    };
    id: string;
}>;
type UpdateScannerJobInput = z.infer<typeof UpdateScannerJobSchema>;
declare const ScannerJobOnlyIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
type ScannerJobOnlyIdOutput = z.infer<typeof ScannerJobOnlyIdSchema>;
declare const DBFileSchema: z.ZodObject<{
    id: z.ZodNumber;
    sha256: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    scanStatus: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    sha256: string;
    createdAt: Date;
    updatedAt: Date;
    scanStatus: string;
}, {
    id: number;
    sha256: string;
    createdAt: Date;
    updatedAt: Date;
    scanStatus: string;
}>;
declare const CreateFileSchema: z.ZodObject<{
    data: z.ZodObject<{
        sha256: z.ZodString;
        scanStatus: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        scanStatus: string;
    }, {
        sha256: string;
        scanStatus: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        sha256: string;
        scanStatus: string;
    };
}, {
    data: {
        sha256: string;
        scanStatus: string;
    };
}>;
type CreateFileInput = z.infer<typeof CreateFileSchema>;
declare const UpdateFileSchema: z.ZodObject<{
    id: z.ZodNumber;
    data: z.ZodObject<{
        scanStatus: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        scanStatus?: string | undefined;
    }, {
        scanStatus?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        scanStatus?: string | undefined;
    };
    id: number;
}, {
    data: {
        scanStatus?: string | undefined;
    };
    id: number;
}>;
type UpdateFileInput = z.infer<typeof UpdateFileSchema>;
declare const CreateLicenseFindingSchema: z.ZodObject<{
    data: z.ZodObject<{
        scanner: z.ZodString;
        licenseExpression: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        score: z.ZodNumber;
        sha256: z.ZodString;
        scannerJobId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        score: number;
        scannerJobId: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
    }, {
        sha256: string;
        score: number;
        scannerJobId: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        sha256: string;
        score: number;
        scannerJobId: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
    };
}, {
    data: {
        sha256: string;
        score: number;
        scannerJobId: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
    };
}>;
type CreateLicenseFindingInput = z.infer<typeof CreateLicenseFindingSchema>;
declare const CreateCopyrightFindingSchema: z.ZodObject<{
    data: z.ZodObject<{
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        copyright: z.ZodString;
        sha256: z.ZodString;
        scannerJobId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        copyright: string;
        scannerJobId: string;
        startLine: number;
        endLine: number;
    }, {
        sha256: string;
        copyright: string;
        scannerJobId: string;
        startLine: number;
        endLine: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        sha256: string;
        copyright: string;
        scannerJobId: string;
        startLine: number;
        endLine: number;
    };
}, {
    data: {
        sha256: string;
        copyright: string;
        scannerJobId: string;
        startLine: number;
        endLine: number;
    };
}>;
type CreateCopyrightFindingInput = z.infer<typeof CreateCopyrightFindingSchema>;
declare const CreatePackageSchema: z.ZodObject<{
    data: z.ZodObject<{
        purl: z.ZodString;
        name: z.ZodString;
        version: z.ZodString;
        scanStatus: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purl: string;
        name: string;
        version: string;
        scanStatus: string;
    }, {
        purl: string;
        name: string;
        version: string;
        scanStatus: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        purl: string;
        name: string;
        version: string;
        scanStatus: string;
    };
}, {
    data: {
        purl: string;
        name: string;
        version: string;
        scanStatus: string;
    };
}>;
type CreatePackageInput = z.infer<typeof CreatePackageSchema>;
declare const UpdatePackageSchema: z.ZodObject<{
    id: z.ZodNumber;
    data: z.ZodObject<{
        scanStatus: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        scanStatus?: string | undefined;
    }, {
        scanStatus?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        scanStatus?: string | undefined;
    };
    id: number;
}, {
    data: {
        scanStatus?: string | undefined;
    };
    id: number;
}>;
type UpdatePackageInput = z.infer<typeof UpdatePackageSchema>;
declare const CreateFileTreeSchema: z.ZodObject<{
    data: z.ZodObject<{
        path: z.ZodString;
        packageId: z.ZodNumber;
        sha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        sha256: string;
        packageId: number;
    }, {
        path: string;
        sha256: string;
        packageId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        path: string;
        sha256: string;
        packageId: number;
    };
}, {
    data: {
        path: string;
        sha256: string;
        packageId: number;
    };
}>;
type CreateFileTreeInput = z.infer<typeof CreateFileTreeSchema>;

declare const scannerAgentApi: [{
    method: "get";
    path: "/";
    description: "Root endpoint";
    response: zod.ZodObject<{
        message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        message: string;
    }, {
        message: string;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 404;
        description: "No such job in the work queue";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }];
}, {
    method: "get";
    path: "/jobs";
    description: "List all jobs";
    response: zod.ZodArray<zod.ZodObject<{
        id: zod.ZodString;
        state: zod.ZodString;
        finishedOn: zod.ZodOptional<zod.ZodNumber>;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        state: string;
        finishedOn?: number | undefined;
    }, {
        id: string;
        state: string;
        finishedOn?: number | undefined;
    }>, "many">;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 404;
        description: "No such job in the work queue";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }];
}, {
    method: "post";
    path: "/job";
    description: "Add scanner job";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            jobId: zod.ZodString;
            files: zod.ZodArray<zod.ZodObject<{
                hash: zod.ZodString;
                path: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                path: string;
                hash: string;
            }, {
                path: string;
                hash: string;
            }>, "many">;
        }, "strip", zod.ZodTypeAny, {
            jobId: string;
            files: {
                path: string;
                hash: string;
            }[];
        }, {
            jobId: string;
            files: {
                path: string;
                hash: string;
            }[];
        }>;
    }];
    response: zod.ZodObject<{
        id: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 404;
        description: "No such job in the work queue";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }];
}, {
    method: "get";
    path: "/job/:id";
    description: "Get scanner job status";
    parameters: [{
        name: "id";
        type: "Path";
        schema: zod.ZodString;
    }];
    response: zod.ZodObject<{
        id: zod.ZodString;
        state: zod.ZodOptional<zod.ZodString>;
        data: zod.ZodOptional<zod.ZodObject<{
            directory: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            directory: string;
        }, {
            directory: string;
        }>>;
        finishedOn: zod.ZodOptional<zod.ZodNumber>;
        result: zod.ZodOptional<zod.ZodObject<{
            headers: zod.ZodArray<zod.ZodObject<{
                tool_name: zod.ZodString;
                tool_version: zod.ZodString;
                options: zod.ZodObject<{
                    input: zod.ZodArray<zod.ZodString, "many">;
                    "--copyright": zod.ZodBoolean;
                    "--info": zod.ZodBoolean;
                    "--json": zod.ZodOptional<zod.ZodString>;
                    "--json-pp": zod.ZodOptional<zod.ZodString>;
                    "--license": zod.ZodBoolean;
                    "--package": zod.ZodBoolean;
                }, "strip", zod.ZodTypeAny, {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                }, {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                }>;
                notice: zod.ZodString;
                start_timestamp: zod.ZodString;
                end_timestamp: zod.ZodString;
                output_format_version: zod.ZodString;
                duration: zod.ZodNumber;
                message: zod.ZodNullable<zod.ZodString>;
                errors: zod.ZodArray<zod.ZodUnknown, "many">;
                warnings: zod.ZodArray<zod.ZodUnknown, "many">;
                extra_data: zod.ZodObject<{
                    system_environment: zod.ZodObject<{
                        operating_system: zod.ZodString;
                        cpu_architecture: zod.ZodString;
                        platform: zod.ZodString;
                        platform_version: zod.ZodString;
                        python_version: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    }, {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    }>;
                    spdx_license_list_version: zod.ZodString;
                    files_count: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                }, {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                }>;
            }, "strip", zod.ZodTypeAny, {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                };
                tool_name: string;
                tool_version: string;
                notice: string;
                start_timestamp: string;
                end_timestamp: string;
                output_format_version: string;
                duration: number;
                errors: unknown[];
                warnings: unknown[];
                extra_data: {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                };
            }, {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                };
                tool_name: string;
                tool_version: string;
                notice: string;
                start_timestamp: string;
                end_timestamp: string;
                output_format_version: string;
                duration: number;
                errors: unknown[];
                warnings: unknown[];
                extra_data: {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                };
            }>, "many">;
            dependencies: zod.ZodArray<zod.ZodObject<{
                purl: zod.ZodString;
                extracted_requirement: zod.ZodNullable<zod.ZodString>;
                scope: zod.ZodString;
                is_runtime: zod.ZodBoolean;
                is_optional: zod.ZodBoolean;
                is_resolved: zod.ZodBoolean;
                resolved_package: zod.ZodUnion<[zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>, zod.ZodObject<{
                    type: zod.ZodString;
                    namespace: zod.ZodString;
                    name: zod.ZodString;
                    version: zod.ZodNullable<zod.ZodString>;
                    qualifiers: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    subpath: zod.ZodNullable<zod.ZodString>;
                    primary_language: zod.ZodString;
                    description: zod.ZodNullable<zod.ZodString>;
                    release_date: zod.ZodNullable<zod.ZodString>;
                    parties: zod.ZodArray<zod.ZodUnknown, "many">;
                    keywords: zod.ZodArray<zod.ZodUnknown, "many">;
                    homepage_url: zod.ZodNullable<zod.ZodString>;
                    download_url: zod.ZodNullable<zod.ZodString>;
                    size: zod.ZodNullable<zod.ZodNumber>;
                    sha1: zod.ZodNullable<zod.ZodString>;
                    md5: zod.ZodNullable<zod.ZodString>;
                    sha256: zod.ZodNullable<zod.ZodString>;
                    sha512: zod.ZodNullable<zod.ZodString>;
                    bug_tracking_url: zod.ZodNullable<zod.ZodString>;
                    code_view_url: zod.ZodNullable<zod.ZodString>;
                    vcs_url: zod.ZodNullable<zod.ZodString>;
                    copyright: zod.ZodNullable<zod.ZodString>;
                    license_expression: zod.ZodNullable<zod.ZodString>;
                    declared_license: zod.ZodNullable<zod.ZodString>;
                    notice_text: zod.ZodNullable<zod.ZodString>;
                    source_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                    file_references: zod.ZodArray<zod.ZodArray<zod.ZodObject<{
                        path: zod.ZodString;
                        size: zod.ZodNumber;
                        sha1: zod.ZodNullable<zod.ZodString>;
                        md5: zod.ZodNullable<zod.ZodString>;
                        sha256: zod.ZodNullable<zod.ZodString>;
                        sha512: zod.ZodNullable<zod.ZodString>;
                        extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    }, "strip", zod.ZodTypeAny, {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }, {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }>, "many">, "many">;
                    extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    dependencies: zod.ZodArray<zod.ZodObject<{
                        purl: zod.ZodString;
                        extracted_requirement: zod.ZodNullable<zod.ZodString>;
                        scope: zod.ZodString;
                        is_runtime: zod.ZodBoolean;
                        is_optional: zod.ZodBoolean;
                        is_resolved: zod.ZodBoolean;
                        resolved_package: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    }, "strip", zod.ZodTypeAny, {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }, {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }>, "many">;
                    repository_homepage_url: zod.ZodString;
                    repository_download_url: zod.ZodNullable<zod.ZodString>;
                    api_data_url: zod.ZodString;
                    datasource_id: zod.ZodString;
                    purl: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }, {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }>]>;
                extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                dependency_uid: zod.ZodString;
                for_package_uid: zod.ZodString;
                datafile_path: zod.ZodString;
                datasource_id: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }) & ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                } | undefined);
                datasource_id: string;
                dependency_uid: string;
                for_package_uid: string;
                datafile_path: string;
            }, {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }) & ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                } | undefined);
                datasource_id: string;
                dependency_uid: string;
                for_package_uid: string;
                datafile_path: string;
            }>, "many">;
            packages: zod.ZodArray<zod.ZodObject<{
                type: zod.ZodString;
                namespace: zod.ZodNullable<zod.ZodString>;
                name: zod.ZodString;
                version: zod.ZodString;
                qualifiers: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                subpath: zod.ZodNullable<zod.ZodString>;
                primary_language: zod.ZodString;
                description: zod.ZodNullable<zod.ZodString>;
                release_date: zod.ZodNullable<zod.ZodString>;
                parties: zod.ZodArray<zod.ZodUnknown, "many">;
                keywords: zod.ZodArray<zod.ZodUnknown, "many">;
                homepage_url: zod.ZodNullable<zod.ZodString>;
                download_url: zod.ZodString;
                size: zod.ZodNullable<zod.ZodNumber>;
                sha1: zod.ZodNullable<zod.ZodString>;
                md5: zod.ZodNullable<zod.ZodString>;
                sha256: zod.ZodNullable<zod.ZodString>;
                sha512: zod.ZodNullable<zod.ZodString>;
                bug_tracking_url: zod.ZodNullable<zod.ZodString>;
                code_view_url: zod.ZodNullable<zod.ZodString>;
                vcs_url: zod.ZodNullable<zod.ZodString>;
                copyright: zod.ZodNullable<zod.ZodString>;
                holder: zod.ZodNullable<zod.ZodString>;
                declared_license_expression: zod.ZodNullable<zod.ZodString>;
                declared_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                license_detections: zod.ZodArray<zod.ZodObject<{
                    license_expression: zod.ZodString;
                    matches: zod.ZodArray<zod.ZodObject<{
                        score: zod.ZodNumber;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                        matched_length: zod.ZodNumber;
                        match_coverage: zod.ZodNumber;
                        matcher: zod.ZodString;
                        license_expression: zod.ZodString;
                        rule_identifier: zod.ZodString;
                        rule_relevance: zod.ZodNumber;
                        rule_url: zod.ZodNullable<zod.ZodString>;
                        matched_text: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }, {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }>, "many">;
                    identifier: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }, {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }>, "many">;
                other_license_expression: zod.ZodNullable<zod.ZodString>;
                other_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                other_license_detections: zod.ZodArray<zod.ZodUnknown, "many">;
                extracted_license_statement: zod.ZodNullable<zod.ZodString>;
                notice_text: zod.ZodNullable<zod.ZodString>;
                source_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                repository_homepage_url: zod.ZodString;
                repository_download_url: zod.ZodString;
                api_data_url: zod.ZodString;
                package_uid: zod.ZodString;
                datafile_paths: zod.ZodArray<zod.ZodString, "many">;
                datasource_ids: zod.ZodArray<zod.ZodString, "many">;
                purl: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                type: string;
                extra_data: {};
                purl: string;
                namespace: string | null;
                name: string;
                version: string;
                qualifiers: {};
                subpath: string | null;
                primary_language: string;
                description: string | null;
                release_date: string | null;
                parties: unknown[];
                keywords: unknown[];
                homepage_url: string | null;
                download_url: string;
                size: number | null;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
                bug_tracking_url: string | null;
                code_view_url: string | null;
                vcs_url: string | null;
                copyright: string | null;
                notice_text: string | null;
                source_packages: unknown[];
                repository_homepage_url: string;
                repository_download_url: string;
                api_data_url: string;
                holder: string | null;
                declared_license_expression: string | null;
                declared_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }[];
                other_license_expression: string | null;
                other_license_expression_spdx: string | null;
                other_license_detections: unknown[];
                extracted_license_statement: string | null;
                package_uid: string;
                datafile_paths: string[];
                datasource_ids: string[];
            }, {
                type: string;
                extra_data: {};
                purl: string;
                namespace: string | null;
                name: string;
                version: string;
                qualifiers: {};
                subpath: string | null;
                primary_language: string;
                description: string | null;
                release_date: string | null;
                parties: unknown[];
                keywords: unknown[];
                homepage_url: string | null;
                download_url: string;
                size: number | null;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
                bug_tracking_url: string | null;
                code_view_url: string | null;
                vcs_url: string | null;
                copyright: string | null;
                notice_text: string | null;
                source_packages: unknown[];
                repository_homepage_url: string;
                repository_download_url: string;
                api_data_url: string;
                holder: string | null;
                declared_license_expression: string | null;
                declared_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }[];
                other_license_expression: string | null;
                other_license_expression_spdx: string | null;
                other_license_detections: unknown[];
                extracted_license_statement: string | null;
                package_uid: string;
                datafile_paths: string[];
                datasource_ids: string[];
            }>, "many">;
            license_detections: zod.ZodArray<zod.ZodObject<{
                identifier: zod.ZodString;
                license_expression: zod.ZodString;
                detection_count: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                license_expression: string;
                identifier: string;
                detection_count: number;
            }, {
                license_expression: string;
                identifier: string;
                detection_count: number;
            }>, "many">;
            files: zod.ZodArray<zod.ZodObject<{
                path: zod.ZodString;
                type: zod.ZodString;
                name: zod.ZodString;
                base_name: zod.ZodString;
                extension: zod.ZodString;
                size: zod.ZodNumber;
                date: zod.ZodNullable<zod.ZodString>;
                sha1: zod.ZodNullable<zod.ZodString>;
                md5: zod.ZodNullable<zod.ZodString>;
                sha256: zod.ZodNullable<zod.ZodString>;
                mime_type: zod.ZodNullable<zod.ZodString>;
                file_type: zod.ZodNullable<zod.ZodString>;
                programming_language: zod.ZodNullable<zod.ZodString>;
                is_binary: zod.ZodBoolean;
                is_text: zod.ZodBoolean;
                is_archive: zod.ZodBoolean;
                is_media: zod.ZodBoolean;
                is_source: zod.ZodBoolean;
                is_script: zod.ZodBoolean;
                package_data: zod.ZodArray<zod.ZodObject<{
                    type: zod.ZodString;
                    namespace: zod.ZodNullable<zod.ZodString>;
                    name: zod.ZodNullable<zod.ZodString>;
                    version: zod.ZodNullable<zod.ZodString>;
                    qualifiers: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    subpath: zod.ZodNullable<zod.ZodString>;
                    primary_language: zod.ZodString;
                    description: zod.ZodNullable<zod.ZodString>;
                    release_date: zod.ZodNullable<zod.ZodString>;
                    parties: zod.ZodArray<zod.ZodUnknown, "many">;
                    keywords: zod.ZodArray<zod.ZodUnknown, "many">;
                    homepage_url: zod.ZodNullable<zod.ZodString>;
                    download_url: zod.ZodNullable<zod.ZodString>;
                    size: zod.ZodNullable<zod.ZodNumber>;
                    sha1: zod.ZodNullable<zod.ZodString>;
                    md5: zod.ZodNullable<zod.ZodString>;
                    sha256: zod.ZodNullable<zod.ZodString>;
                    sha512: zod.ZodNullable<zod.ZodString>;
                    bug_tracking_url: zod.ZodNullable<zod.ZodString>;
                    code_view_url: zod.ZodNullable<zod.ZodString>;
                    vcs_url: zod.ZodNullable<zod.ZodString>;
                    copyright: zod.ZodNullable<zod.ZodString>;
                    holder: zod.ZodNullable<zod.ZodString>;
                    declared_license_expression: zod.ZodNullable<zod.ZodString>;
                    declared_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                    license_detections: zod.ZodArray<zod.ZodObject<{
                        license_expression: zod.ZodString;
                        matches: zod.ZodArray<zod.ZodObject<{
                            score: zod.ZodNumber;
                            start_line: zod.ZodNumber;
                            end_line: zod.ZodNumber;
                            matched_length: zod.ZodNumber;
                            match_coverage: zod.ZodNumber;
                            matcher: zod.ZodString;
                            license_expression: zod.ZodString;
                            rule_identifier: zod.ZodString;
                            rule_relevance: zod.ZodNumber;
                            rule_url: zod.ZodNullable<zod.ZodString>;
                        }, "strip", zod.ZodTypeAny, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }>, "many">;
                        identifier: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }>, "many">;
                    other_license_expression: zod.ZodNullable<zod.ZodString>;
                    other_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                    other_license_detections: zod.ZodArray<zod.ZodUnknown, "many">;
                    extracted_license_statement: zod.ZodNullable<zod.ZodString>;
                    notice_text: zod.ZodNullable<zod.ZodString>;
                    source_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                    file_references: zod.ZodArray<zod.ZodUnknown, "many">;
                    extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    dependencies: zod.ZodArray<zod.ZodObject<{
                        purl: zod.ZodString;
                        extracted_requirement: zod.ZodNullable<zod.ZodString>;
                        scope: zod.ZodString;
                        is_runtime: zod.ZodBoolean;
                        is_optional: zod.ZodBoolean;
                        is_resolved: zod.ZodBoolean;
                        resolved_package: zod.ZodObject<{
                            type: zod.ZodOptional<zod.ZodString>;
                            namespace: zod.ZodOptional<zod.ZodString>;
                            name: zod.ZodOptional<zod.ZodString>;
                            version: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
                            qualifiers: zod.ZodOptional<zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>>;
                            subpath: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            primary_language: zod.ZodOptional<zod.ZodString>;
                            description: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            release_date: zod.ZodOptional<zod.ZodNull>;
                            parties: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                            keywords: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                            homepage_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            download_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            size: zod.ZodOptional<zod.ZodNullable<zod.ZodNumber>>;
                            sha1: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            md5: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            sha256: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            sha512: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            bug_tracking_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            code_view_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            vcs_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            copyright: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            holder: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            declared_license_expression: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            declared_license_expression_spdx: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            license_detections: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                                license_expression: zod.ZodString;
                                matches: zod.ZodArray<zod.ZodObject<{
                                    score: zod.ZodNumber;
                                    start_line: zod.ZodNumber;
                                    end_line: zod.ZodNumber;
                                    matched_length: zod.ZodNumber;
                                    match_coverage: zod.ZodNumber;
                                    matcher: zod.ZodString;
                                    license_expression: zod.ZodString;
                                    rule_identifier: zod.ZodString;
                                    rule_relevance: zod.ZodNumber;
                                    rule_url: zod.ZodNullable<zod.ZodString>;
                                    matched_text: zod.ZodString;
                                }, "strip", zod.ZodTypeAny, {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }, {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }>, "many">;
                                identifier: zod.ZodString;
                            }, "strip", zod.ZodTypeAny, {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }, {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }>, "many">>;
                            other_license_expression: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            other_license_expression_spdx: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            other_license_detections: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                            extracted_license_statement: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            notice_text: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                            source_packages: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                            file_references: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown, "many">>;
                            extra_data: zod.ZodOptional<zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>>;
                            dependencies: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                                purl: zod.ZodString;
                                extracted_requirement: zod.ZodString;
                                scope: zod.ZodString;
                                is_runtime: zod.ZodBoolean;
                                is_optional: zod.ZodBoolean;
                                is_resolved: zod.ZodBoolean;
                                resolved_package: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                                extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                            }, "strip", zod.ZodTypeAny, {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }, {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }>, "many">>;
                            repository_homepage_url: zod.ZodOptional<zod.ZodString>;
                            repository_download_url: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
                            api_data_url: zod.ZodOptional<zod.ZodString>;
                            datasource_id: zod.ZodOptional<zod.ZodString>;
                            purl: zod.ZodOptional<zod.ZodString>;
                        }, "strip", zod.ZodTypeAny, {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        }, {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        }>;
                        extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    }, "strip", zod.ZodTypeAny, {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }, {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }>, "many">;
                    repository_homepage_url: zod.ZodNullable<zod.ZodString>;
                    repository_download_url: zod.ZodNullable<zod.ZodString>;
                    api_data_url: zod.ZodNullable<zod.ZodString>;
                    datasource_id: zod.ZodString;
                    purl: zod.ZodNullable<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }, {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }>, "many">;
                for_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                detected_license_expression: zod.ZodNullable<zod.ZodString>;
                detected_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                license_detections: zod.ZodArray<zod.ZodObject<{
                    license_expression: zod.ZodString;
                    matches: zod.ZodArray<zod.ZodObject<{
                        score: zod.ZodNumber;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                        matched_length: zod.ZodNumber;
                        match_coverage: zod.ZodNumber;
                        matcher: zod.ZodString;
                        license_expression: zod.ZodString;
                        rule_identifier: zod.ZodString;
                        rule_relevance: zod.ZodNumber;
                        rule_url: zod.ZodNullable<zod.ZodString>;
                    }, "strip", zod.ZodTypeAny, {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }, {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }>, "many">;
                    identifier: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }, {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }>, "many">;
                license_clues: zod.ZodArray<zod.ZodUnknown, "many">;
                percentage_of_license_text: zod.ZodNumber;
                copyrights: zod.ZodArray<zod.ZodObject<{
                    copyright: zod.ZodString;
                    start_line: zod.ZodNumber;
                    end_line: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }, {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }>, "many">;
                holders: zod.ZodArray<zod.ZodObject<{
                    holder: zod.ZodString;
                    start_line: zod.ZodNumber;
                    end_line: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }, {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }>, "many">;
                authors: zod.ZodArray<zod.ZodObject<{
                    author: zod.ZodString;
                    start_line: zod.ZodNumber;
                    end_line: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    start_line: number;
                    end_line: number;
                    author: string;
                }, {
                    start_line: number;
                    end_line: number;
                    author: string;
                }>, "many">;
                files_count: zod.ZodNumber;
                dirs_count: zod.ZodNumber;
                size_count: zod.ZodNumber;
                scan_errors: zod.ZodArray<zod.ZodUnknown, "many">;
            }, "strip", zod.ZodTypeAny, {
                path: string;
                type: string;
                date: string | null;
                files_count: number;
                name: string;
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }[];
                base_name: string;
                extension: string;
                mime_type: string | null;
                file_type: string | null;
                programming_language: string | null;
                is_binary: boolean;
                is_text: boolean;
                is_archive: boolean;
                is_media: boolean;
                is_source: boolean;
                is_script: boolean;
                package_data: {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }[];
                for_packages: unknown[];
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_clues: unknown[];
                percentage_of_license_text: number;
                copyrights: {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }[];
                holders: {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }[];
                authors: {
                    start_line: number;
                    end_line: number;
                    author: string;
                }[];
                dirs_count: number;
                size_count: number;
                scan_errors: unknown[];
            }, {
                path: string;
                type: string;
                date: string | null;
                files_count: number;
                name: string;
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }[];
                base_name: string;
                extension: string;
                mime_type: string | null;
                file_type: string | null;
                programming_language: string | null;
                is_binary: boolean;
                is_text: boolean;
                is_archive: boolean;
                is_media: boolean;
                is_source: boolean;
                is_script: boolean;
                package_data: {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }[];
                for_packages: unknown[];
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_clues: unknown[];
                percentage_of_license_text: number;
                copyrights: {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }[];
                holders: {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }[];
                authors: {
                    start_line: number;
                    end_line: number;
                    author: string;
                }[];
                dirs_count: number;
                size_count: number;
                scan_errors: unknown[];
            }>, "many">;
        }, "strip", zod.ZodTypeAny, {
            files: {
                path: string;
                type: string;
                date: string | null;
                files_count: number;
                name: string;
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }[];
                base_name: string;
                extension: string;
                mime_type: string | null;
                file_type: string | null;
                programming_language: string | null;
                is_binary: boolean;
                is_text: boolean;
                is_archive: boolean;
                is_media: boolean;
                is_source: boolean;
                is_script: boolean;
                package_data: {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }[];
                for_packages: unknown[];
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_clues: unknown[];
                percentage_of_license_text: number;
                copyrights: {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }[];
                holders: {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }[];
                authors: {
                    start_line: number;
                    end_line: number;
                    author: string;
                }[];
                dirs_count: number;
                size_count: number;
                scan_errors: unknown[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                };
                tool_name: string;
                tool_version: string;
                notice: string;
                start_timestamp: string;
                end_timestamp: string;
                output_format_version: string;
                duration: number;
                errors: unknown[];
                warnings: unknown[];
                extra_data: {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                };
            }[];
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }) & ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                } | undefined);
                datasource_id: string;
                dependency_uid: string;
                for_package_uid: string;
                datafile_path: string;
            }[];
            packages: {
                type: string;
                extra_data: {};
                purl: string;
                namespace: string | null;
                name: string;
                version: string;
                qualifiers: {};
                subpath: string | null;
                primary_language: string;
                description: string | null;
                release_date: string | null;
                parties: unknown[];
                keywords: unknown[];
                homepage_url: string | null;
                download_url: string;
                size: number | null;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
                bug_tracking_url: string | null;
                code_view_url: string | null;
                vcs_url: string | null;
                copyright: string | null;
                notice_text: string | null;
                source_packages: unknown[];
                repository_homepage_url: string;
                repository_download_url: string;
                api_data_url: string;
                holder: string | null;
                declared_license_expression: string | null;
                declared_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }[];
                other_license_expression: string | null;
                other_license_expression_spdx: string | null;
                other_license_detections: unknown[];
                extracted_license_statement: string | null;
                package_uid: string;
                datafile_paths: string[];
                datasource_ids: string[];
            }[];
            license_detections: {
                license_expression: string;
                identifier: string;
                detection_count: number;
            }[];
        }, {
            files: {
                path: string;
                type: string;
                date: string | null;
                files_count: number;
                name: string;
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }[];
                base_name: string;
                extension: string;
                mime_type: string | null;
                file_type: string | null;
                programming_language: string | null;
                is_binary: boolean;
                is_text: boolean;
                is_archive: boolean;
                is_media: boolean;
                is_source: boolean;
                is_script: boolean;
                package_data: {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }[];
                for_packages: unknown[];
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_clues: unknown[];
                percentage_of_license_text: number;
                copyrights: {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }[];
                holders: {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }[];
                authors: {
                    start_line: number;
                    end_line: number;
                    author: string;
                }[];
                dirs_count: number;
                size_count: number;
                scan_errors: unknown[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                };
                tool_name: string;
                tool_version: string;
                notice: string;
                start_timestamp: string;
                end_timestamp: string;
                output_format_version: string;
                duration: number;
                errors: unknown[];
                warnings: unknown[];
                extra_data: {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                };
            }[];
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }) & ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                } | undefined);
                datasource_id: string;
                dependency_uid: string;
                for_package_uid: string;
                datafile_path: string;
            }[];
            packages: {
                type: string;
                extra_data: {};
                purl: string;
                namespace: string | null;
                name: string;
                version: string;
                qualifiers: {};
                subpath: string | null;
                primary_language: string;
                description: string | null;
                release_date: string | null;
                parties: unknown[];
                keywords: unknown[];
                homepage_url: string | null;
                download_url: string;
                size: number | null;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
                bug_tracking_url: string | null;
                code_view_url: string | null;
                vcs_url: string | null;
                copyright: string | null;
                notice_text: string | null;
                source_packages: unknown[];
                repository_homepage_url: string;
                repository_download_url: string;
                api_data_url: string;
                holder: string | null;
                declared_license_expression: string | null;
                declared_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }[];
                other_license_expression: string | null;
                other_license_expression_spdx: string | null;
                other_license_detections: unknown[];
                extracted_license_statement: string | null;
                package_uid: string;
                datafile_paths: string[];
                datasource_ids: string[];
            }[];
            license_detections: {
                license_expression: string;
                identifier: string;
                detection_count: number;
            }[];
        }>>;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        state?: string | undefined;
        data?: {
            directory: string;
        } | undefined;
        finishedOn?: number | undefined;
        result?: {
            files: {
                path: string;
                type: string;
                date: string | null;
                files_count: number;
                name: string;
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }[];
                base_name: string;
                extension: string;
                mime_type: string | null;
                file_type: string | null;
                programming_language: string | null;
                is_binary: boolean;
                is_text: boolean;
                is_archive: boolean;
                is_media: boolean;
                is_source: boolean;
                is_script: boolean;
                package_data: {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }[];
                for_packages: unknown[];
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_clues: unknown[];
                percentage_of_license_text: number;
                copyrights: {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }[];
                holders: {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }[];
                authors: {
                    start_line: number;
                    end_line: number;
                    author: string;
                }[];
                dirs_count: number;
                size_count: number;
                scan_errors: unknown[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                };
                tool_name: string;
                tool_version: string;
                notice: string;
                start_timestamp: string;
                end_timestamp: string;
                output_format_version: string;
                duration: number;
                errors: unknown[];
                warnings: unknown[];
                extra_data: {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                };
            }[];
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }) & ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                } | undefined);
                datasource_id: string;
                dependency_uid: string;
                for_package_uid: string;
                datafile_path: string;
            }[];
            packages: {
                type: string;
                extra_data: {};
                purl: string;
                namespace: string | null;
                name: string;
                version: string;
                qualifiers: {};
                subpath: string | null;
                primary_language: string;
                description: string | null;
                release_date: string | null;
                parties: unknown[];
                keywords: unknown[];
                homepage_url: string | null;
                download_url: string;
                size: number | null;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
                bug_tracking_url: string | null;
                code_view_url: string | null;
                vcs_url: string | null;
                copyright: string | null;
                notice_text: string | null;
                source_packages: unknown[];
                repository_homepage_url: string;
                repository_download_url: string;
                api_data_url: string;
                holder: string | null;
                declared_license_expression: string | null;
                declared_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }[];
                other_license_expression: string | null;
                other_license_expression_spdx: string | null;
                other_license_detections: unknown[];
                extracted_license_statement: string | null;
                package_uid: string;
                datafile_paths: string[];
                datasource_ids: string[];
            }[];
            license_detections: {
                license_expression: string;
                identifier: string;
                detection_count: number;
            }[];
        } | undefined;
    }, {
        id: string;
        state?: string | undefined;
        data?: {
            directory: string;
        } | undefined;
        finishedOn?: number | undefined;
        result?: {
            files: {
                path: string;
                type: string;
                date: string | null;
                files_count: number;
                name: string;
                size: number;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }[];
                    identifier: string;
                }[];
                base_name: string;
                extension: string;
                mime_type: string | null;
                file_type: string | null;
                programming_language: string | null;
                is_binary: boolean;
                is_text: boolean;
                is_archive: boolean;
                is_media: boolean;
                is_source: boolean;
                is_script: boolean;
                package_data: {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | null | undefined;
                            qualifiers?: {} | undefined;
                            subpath?: string | null | undefined;
                            primary_language?: string | undefined;
                            description?: string | null | undefined;
                            release_date?: null | undefined;
                            parties?: unknown[] | undefined;
                            keywords?: unknown[] | undefined;
                            homepage_url?: string | null | undefined;
                            download_url?: string | null | undefined;
                            size?: number | null | undefined;
                            sha1?: string | null | undefined;
                            md5?: string | null | undefined;
                            sha256?: string | null | undefined;
                            sha512?: string | null | undefined;
                            bug_tracking_url?: string | null | undefined;
                            code_view_url?: string | null | undefined;
                            vcs_url?: string | null | undefined;
                            copyright?: string | null | undefined;
                            holder?: string | null | undefined;
                            declared_license_expression?: string | null | undefined;
                            declared_license_expression_spdx?: string | null | undefined;
                            license_detections?: {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    matched_length: number;
                                    match_coverage: number;
                                    matcher: string;
                                    rule_identifier: string;
                                    rule_relevance: number;
                                    rule_url: string | null;
                                    matched_text: string;
                                }[];
                                identifier: string;
                            }[] | undefined;
                            other_license_expression?: string | null | undefined;
                            other_license_expression_spdx?: string | null | undefined;
                            other_license_detections?: unknown[] | undefined;
                            extracted_license_statement?: string | null | undefined;
                            notice_text?: string | null | undefined;
                            source_packages?: unknown[] | undefined;
                            file_references?: unknown[] | undefined;
                            extra_data?: {} | undefined;
                            dependencies?: {
                                extra_data: {};
                                purl: string;
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | null | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    purl: string | null;
                    namespace: string | null;
                    name: string | null;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: unknown[];
                    repository_homepage_url: string | null;
                    repository_download_url: string | null;
                    api_data_url: string | null;
                    datasource_id: string;
                    holder: string | null;
                    declared_license_expression: string | null;
                    declared_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }[];
                        identifier: string;
                    }[];
                    other_license_expression: string | null;
                    other_license_expression_spdx: string | null;
                    other_license_detections: unknown[];
                    extracted_license_statement: string | null;
                }[];
                for_packages: unknown[];
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_clues: unknown[];
                percentage_of_license_text: number;
                copyrights: {
                    copyright: string;
                    start_line: number;
                    end_line: number;
                }[];
                holders: {
                    holder: string;
                    start_line: number;
                    end_line: number;
                }[];
                authors: {
                    start_line: number;
                    end_line: number;
                    author: string;
                }[];
                dirs_count: number;
                size_count: number;
                scan_errors: unknown[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--package": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                };
                tool_name: string;
                tool_version: string;
                notice: string;
                start_timestamp: string;
                end_timestamp: string;
                output_format_version: string;
                duration: number;
                errors: unknown[];
                warnings: unknown[];
                extra_data: {
                    system_environment: {
                        operating_system: string;
                        cpu_architecture: string;
                        platform: string;
                        platform_version: string;
                        python_version: string;
                    };
                    spdx_license_list_version: string;
                    files_count: number;
                };
            }[];
            dependencies: {
                extra_data: {};
                purl: string;
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                }) & ({} | {
                    type: string;
                    extra_data: {};
                    dependencies: {
                        extra_data: {};
                        purl: string;
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    purl: string;
                    namespace: string;
                    name: string;
                    version: string | null;
                    qualifiers: {};
                    subpath: string | null;
                    primary_language: string;
                    description: string | null;
                    release_date: string | null;
                    parties: unknown[];
                    keywords: unknown[];
                    homepage_url: string | null;
                    download_url: string | null;
                    size: number | null;
                    sha1: string | null;
                    md5: string | null;
                    sha256: string | null;
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    copyright: string | null;
                    license_expression: string | null;
                    declared_license: string | null;
                    notice_text: string | null;
                    source_packages: unknown[];
                    file_references: {
                        path: string;
                        extra_data: {};
                        size: number;
                        sha1: string | null;
                        md5: string | null;
                        sha256: string | null;
                        sha512: string | null;
                    }[][];
                    repository_homepage_url: string;
                    repository_download_url: string | null;
                    api_data_url: string;
                    datasource_id: string;
                } | undefined);
                datasource_id: string;
                dependency_uid: string;
                for_package_uid: string;
                datafile_path: string;
            }[];
            packages: {
                type: string;
                extra_data: {};
                purl: string;
                namespace: string | null;
                name: string;
                version: string;
                qualifiers: {};
                subpath: string | null;
                primary_language: string;
                description: string | null;
                release_date: string | null;
                parties: unknown[];
                keywords: unknown[];
                homepage_url: string | null;
                download_url: string;
                size: number | null;
                sha1: string | null;
                md5: string | null;
                sha256: string | null;
                sha512: string | null;
                bug_tracking_url: string | null;
                code_view_url: string | null;
                vcs_url: string | null;
                copyright: string | null;
                notice_text: string | null;
                source_packages: unknown[];
                repository_homepage_url: string;
                repository_download_url: string;
                api_data_url: string;
                holder: string | null;
                declared_license_expression: string | null;
                declared_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                        matched_text: string;
                    }[];
                    identifier: string;
                }[];
                other_license_expression: string | null;
                other_license_expression_spdx: string | null;
                other_license_detections: unknown[];
                extracted_license_statement: string | null;
                package_uid: string;
                datafile_paths: string[];
                datasource_ids: string[];
            }[];
            license_detections: {
                license_expression: string;
                identifier: string;
                detection_count: number;
            }[];
        } | undefined;
    }>;
    errors: [{
        status: 500;
        description: "Internal server error";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 400;
        description: "Bad request";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 401;
        description: "No token provided";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 403;
        description: "Token is invalid";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 404;
        description: "No such job in the work queue";
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }];
}];

export { CreateCopyrightFindingInput, CreateFileInput, CreateFileTreeInput, CreateLicenseFindingInput, CreatePackageInput, CreateScannerJobInput, DBFileSchema, DBScannerJobSchema, DBScannerJobType, ScannerJobOnlyIdOutput, ScannerJobResultSchema, UpdateFileInput, UpdatePackageInput, UpdateScannerJobInput, dosApi, scannerAgentApi };
