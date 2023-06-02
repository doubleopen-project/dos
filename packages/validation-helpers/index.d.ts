// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as zod from 'zod';
import { z } from 'zod';

declare const dosApi: [{
    method: "post";
    path: "/scan-results";
    description: "Get scan results";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
    }];
    response: zod.ZodObject<{
        Message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        Message: string;
    }, {
        Message: string;
    }>;
    errors: [{
        status: 500;
        description: string;
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: string;
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
    description: "Get presigned upload URL for S3 object storage";
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
        description: string;
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: string;
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
    description: "Add scanner job";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            directory: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            directory: string;
        }, {
            directory: string;
        }>;
    }];
    response: zod.ZodObject<{
        scannerJob: zod.ZodObject<{
            id: zod.ZodString;
            createdAt: zod.ZodDate;
            updatedAt: zod.ZodDate;
            state: zod.ZodString;
            ortVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            scancodeVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            duration: zod.ZodNullable<zod.ZodOptional<zod.ZodNumber>>;
            scanStartTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            scanEndTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            spdxLicenseListVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        }, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        }>;
        message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        message: string;
        scannerJob: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        };
    }, {
        message: string;
        scannerJob: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        };
    }>;
    errors: [{
        status: 500;
        description: string;
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: string;
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
    path: "/job-state";
    description: "Edit scanner job state";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            id: zod.ZodString;
            state: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            state: string;
        }, {
            id: string;
            state: string;
        }>;
    }];
    response: zod.ZodObject<{
        editedScannerJob: zod.ZodObject<{
            id: zod.ZodString;
            createdAt: zod.ZodDate;
            updatedAt: zod.ZodDate;
            state: zod.ZodString;
            ortVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            scancodeVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            duration: zod.ZodNullable<zod.ZodOptional<zod.ZodNumber>>;
            scanStartTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            scanEndTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            spdxLicenseListVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        }, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        }>;
        message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        message: string;
        editedScannerJob: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        };
    }, {
        message: string;
        editedScannerJob: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
            ortVersion?: string | null | undefined;
            scancodeVersion?: string | null | undefined;
            duration?: number | null | undefined;
            scanStartTS?: Date | null | undefined;
            scanEndTS?: Date | null | undefined;
            spdxLicenseListVersion?: string | null | undefined;
        };
    }>;
    errors: [{
        status: 500;
        description: string;
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: string;
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
                        "--json": zod.ZodString;
                        "--license": zod.ZodBoolean;
                        "--package": zod.ZodBoolean;
                    }, "strip", zod.ZodTypeAny, {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
                    }, {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
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
                    duration: number;
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
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
                    duration: number;
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
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
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }, {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }, {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                    license_expression: zod.ZodNullable<zod.ZodString>;
                    declared_license: zod.ZodArray<zod.ZodString, "many">;
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
                    sha256: string | null;
                    copyright: string | null;
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
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    license_expression: string | null;
                    declared_license: string[];
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }, {
                    type: string;
                    sha256: string | null;
                    copyright: string | null;
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
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    license_expression: string | null;
                    declared_license: string[];
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
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
                    licenses: zod.ZodArray<zod.ZodObject<{
                        key: zod.ZodString;
                        score: zod.ZodNumber;
                        name: zod.ZodString;
                        short_name: zod.ZodString;
                        category: zod.ZodString;
                        is_exception: zod.ZodBoolean;
                        is_unknown: zod.ZodBoolean;
                        owner: zod.ZodString;
                        homepage_url: zod.ZodNullable<zod.ZodString>;
                        text_url: zod.ZodString;
                        reference_url: zod.ZodString;
                        scancode_text_url: zod.ZodString;
                        scancode_data_url: zod.ZodString;
                        spdx_license_key: zod.ZodString;
                        spdx_url: zod.ZodString;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                        matched_rule: zod.ZodObject<{
                            identifier: zod.ZodString;
                            license_expression: zod.ZodString;
                            licenses: zod.ZodArray<zod.ZodString, "many">;
                            referenced_filenames: zod.ZodArray<zod.ZodUnknown, "many">;
                            is_license_text: zod.ZodBoolean;
                            is_license_notice: zod.ZodBoolean;
                            is_license_reference: zod.ZodBoolean;
                            is_license_tag: zod.ZodBoolean;
                            is_license_intro: zod.ZodBoolean;
                            has_unknown: zod.ZodBoolean;
                            matcher: zod.ZodString;
                            rule_length: zod.ZodNumber;
                            matched_length: zod.ZodNumber;
                            match_coverage: zod.ZodNumber;
                            rule_relevance: zod.ZodNumber;
                        }, "strip", zod.ZodTypeAny, {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        }, {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        }>;
                    }, "strip", zod.ZodTypeAny, {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }, {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }>, "many">;
                    license_expressions: zod.ZodArray<zod.ZodUnknown, "many">;
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
                        start_line: number;
                        end_line: number;
                        holder: string;
                    }, {
                        start_line: number;
                        end_line: number;
                        holder: string;
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
                        license_expression: zod.ZodNullable<zod.ZodString>;
                        declared_license: zod.ZodNullable<zod.ZodArray<zod.ZodString, "many">>;
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
                        repository_homepage_url: zod.ZodNullable<zod.ZodString>;
                        repository_download_url: zod.ZodNullable<zod.ZodString>;
                        api_data_url: zod.ZodNullable<zod.ZodString>;
                        datasource_id: zod.ZodString;
                        purl: zod.ZodNullable<zod.ZodString>;
                    }, "strip", zod.ZodTypeAny, {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }, {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }>, "many">;
                    for_packages: zod.ZodArray<zod.ZodUnknown, "many">;
                    files_count: zod.ZodNumber;
                    dirs_count: zod.ZodNumber;
                    size_count: zod.ZodNumber;
                    scan_errors: zod.ZodArray<zod.ZodUnknown, "many">;
                }, "strip", zod.ZodTypeAny, {
                    path: string;
                    type: string;
                    sha256: string | null;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
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
                    licenses: {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }[];
                    license_expressions: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        start_line: number;
                        end_line: number;
                        holder: string;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    package_data: {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }[];
                    for_packages: unknown[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }, {
                    path: string;
                    type: string;
                    sha256: string | null;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
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
                    licenses: {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }[];
                    license_expressions: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        start_line: number;
                        end_line: number;
                        holder: string;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    package_data: {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }[];
                    for_packages: unknown[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }>, "many">;
            }, "strip", zod.ZodTypeAny, {
                headers: {
                    duration: number;
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
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
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                    sha256: string | null;
                    copyright: string | null;
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
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    license_expression: string | null;
                    declared_license: string[];
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
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
                    licenses: {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }[];
                    license_expressions: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        start_line: number;
                        end_line: number;
                        holder: string;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    package_data: {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }[];
                    for_packages: unknown[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }[];
            }, {
                headers: {
                    duration: number;
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
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
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                    sha256: string | null;
                    copyright: string | null;
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
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    license_expression: string | null;
                    declared_license: string[];
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
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
                    licenses: {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }[];
                    license_expressions: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        start_line: number;
                        end_line: number;
                        holder: string;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    package_data: {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }[];
                    for_packages: unknown[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }[];
            }>;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            result: {
                headers: {
                    duration: number;
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
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
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                    sha256: string | null;
                    copyright: string | null;
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
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    license_expression: string | null;
                    declared_license: string[];
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
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
                    licenses: {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }[];
                    license_expressions: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        start_line: number;
                        end_line: number;
                        holder: string;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    package_data: {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }[];
                    for_packages: unknown[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
                }[];
            };
        }, {
            id: string;
            result: {
                headers: {
                    duration: number;
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--json": string;
                        "--license": boolean;
                        "--package": boolean;
                    };
                    tool_name: string;
                    tool_version: string;
                    notice: string;
                    start_timestamp: string;
                    end_timestamp: string;
                    output_format_version: string;
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
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
                            sha512: string | null;
                        }[][];
                        repository_homepage_url: string;
                        repository_download_url: string | null;
                        api_data_url: string;
                        datasource_id: string;
                    }) & ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: {
                            path: string;
                            sha256: string | null;
                            extra_data: {};
                            size: number;
                            sha1: string | null;
                            md5: string | null;
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
                    sha256: string | null;
                    copyright: string | null;
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
                    sha512: string | null;
                    bug_tracking_url: string | null;
                    code_view_url: string | null;
                    vcs_url: string | null;
                    license_expression: string | null;
                    declared_license: string[];
                    notice_text: string | null;
                    source_packages: unknown[];
                    repository_homepage_url: string;
                    repository_download_url: string;
                    api_data_url: string;
                    package_uid: string;
                    datafile_paths: string[];
                    datasource_ids: string[];
                }[];
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    date: string | null;
                    files_count: number;
                    name: string;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
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
                    licenses: {
                        score: number;
                        name: string;
                        homepage_url: string | null;
                        key: string;
                        short_name: string;
                        category: string;
                        is_exception: boolean;
                        is_unknown: boolean;
                        owner: string;
                        text_url: string;
                        reference_url: string;
                        scancode_text_url: string;
                        scancode_data_url: string;
                        spdx_license_key: string;
                        spdx_url: string;
                        start_line: number;
                        end_line: number;
                        matched_rule: {
                            license_expression: string;
                            licenses: string[];
                            identifier: string;
                            referenced_filenames: unknown[];
                            is_license_text: boolean;
                            is_license_notice: boolean;
                            is_license_reference: boolean;
                            is_license_tag: boolean;
                            is_license_intro: boolean;
                            has_unknown: boolean;
                            matcher: string;
                            rule_length: number;
                            matched_length: number;
                            match_coverage: number;
                            rule_relevance: number;
                        };
                    }[];
                    license_expressions: unknown[];
                    percentage_of_license_text: number;
                    copyrights: {
                        copyright: string;
                        start_line: number;
                        end_line: number;
                    }[];
                    holders: {
                        start_line: number;
                        end_line: number;
                        holder: string;
                    }[];
                    authors: {
                        start_line: number;
                        end_line: number;
                        author: string;
                    }[];
                    package_data: {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
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
                        sha512: string | null;
                        bug_tracking_url: string | null;
                        code_view_url: string | null;
                        vcs_url: string | null;
                        license_expression: string | null;
                        declared_license: string[] | null;
                        notice_text: string | null;
                        source_packages: unknown[];
                        file_references: unknown[];
                        repository_homepage_url: string | null;
                        repository_download_url: string | null;
                        api_data_url: string | null;
                        datasource_id: string;
                    }[];
                    for_packages: unknown[];
                    dirs_count: number;
                    size_count: number;
                    scan_errors: unknown[];
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
        description: string;
        schema: zod.ZodObject<{
            message: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            message: string;
        }, {
            message: string;
        }>;
    }, {
        status: 400;
        description: string;
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
    ortVersion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    scancodeVersion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    scanStartTS: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    scanEndTS: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    spdxLicenseListVersion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    state: string;
    ortVersion?: string | null | undefined;
    scancodeVersion?: string | null | undefined;
    duration?: number | null | undefined;
    scanStartTS?: Date | null | undefined;
    scanEndTS?: Date | null | undefined;
    spdxLicenseListVersion?: string | null | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    state: string;
    ortVersion?: string | null | undefined;
    scancodeVersion?: string | null | undefined;
    duration?: number | null | undefined;
    scanStartTS?: Date | null | undefined;
    scanEndTS?: Date | null | undefined;
    spdxLicenseListVersion?: string | null | undefined;
}>;
type DBScannerJobType = z.infer<typeof CreateScannerJobSchema>;
declare const CreateScannerJobSchema: z.ZodObject<{
    state: z.ZodString;
}, "strip", z.ZodTypeAny, {
    state: string;
}, {
    state: string;
}>;
type CreateScannerJobInput = z.infer<typeof CreateScannerJobSchema>;
declare const DBFileSchema: z.ZodObject<{
    id: z.ZodNumber;
    sha256: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    scanned: z.ZodOptional<z.ZodBoolean>;
    scannerJobId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    sha256: string;
    scanned?: boolean | undefined;
    scannerJobId?: string | undefined;
}, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    sha256: string;
    scanned?: boolean | undefined;
    scannerJobId?: string | undefined;
}>;
declare const CreateFileSchema: z.ZodObject<{
    data: z.ZodObject<{
        sha256: z.ZodString;
        scanned: z.ZodOptional<z.ZodBoolean>;
        scannerJobId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    }, {
        sha256: string;
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        sha256: string;
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    };
}, {
    data: {
        sha256: string;
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    };
}>;
type CreateFileInput = z.infer<typeof CreateFileSchema>;
declare const EditScannerJobSchema: z.ZodObject<{
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
    id: string;
    data: {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        duration?: number | undefined;
        scanStartTS?: Date | undefined;
        scanEndTS?: Date | undefined;
        spdxLicenseListVersion?: string | undefined;
    };
}, {
    id: string;
    data: {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        duration?: number | undefined;
        scanStartTS?: Date | undefined;
        scanEndTS?: Date | undefined;
        spdxLicenseListVersion?: string | undefined;
    };
}>;
type EditScannerJobInput = z.infer<typeof EditScannerJobSchema>;
declare const EditFileSchema: z.ZodObject<{
    id: z.ZodNumber;
    data: z.ZodObject<{
        scanned: z.ZodOptional<z.ZodBoolean>;
        scannerJobId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    }, {
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: number;
    data: {
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    };
}, {
    id: number;
    data: {
        scanned?: boolean | undefined;
        scannerJobId?: string | undefined;
    };
}>;
type EditFileInput = z.infer<typeof EditFileSchema>;
declare const CreateLicenseFindingSchema: z.ZodObject<{
    data: z.ZodObject<{
        scanner: z.ZodString;
        licenseExpression: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        score: z.ZodNumber;
        sha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
        score: number;
    }, {
        sha256: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
        score: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        sha256: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
        score: number;
    };
}, {
    data: {
        sha256: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
        score: number;
    };
}>;
type CreateLicenseFindingInput = z.infer<typeof CreateLicenseFindingSchema>;
declare const CreateCopyrightFindingSchema: z.ZodObject<{
    data: z.ZodObject<{
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        copyright: z.ZodString;
        sha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
    }, {
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
    };
}, {
    data: {
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
    };
}>;
type CreateCopyrightFindingInput = z.infer<typeof CreateCopyrightFindingSchema>;

export { CreateCopyrightFindingInput, CreateFileInput, CreateLicenseFindingInput, CreateScannerJobInput, DBFileSchema, DBScannerJobSchema, DBScannerJobType, EditFileInput, EditScannerJobInput, dosApi };
