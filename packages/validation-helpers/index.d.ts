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
        schema: zod.ZodObject<{
            purl: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            purl: string;
        }, {
            purl: string;
        }>;
    }];
    response: zod.ZodObject<{
        results: zod.ZodUnion<[zod.ZodString, zod.ZodNull, zod.ZodObject<{
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
        results: ((string | {
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
        }) & (string | {
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
        } | undefined)) | null;
    }, {
        results: ((string | {
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
        }) & (string | {
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
        } | undefined)) | null;
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
    path: "/package";
    description: "";
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
        folderName: zod.ZodString;
        packageId: zod.ZodNumber;
    }, "strip", zod.ZodTypeAny, {
        packageId: number;
        folderName: string;
    }, {
        packageId: number;
        folderName: string;
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
            packageId: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            packageId: number;
            directory: string;
        }, {
            packageId: number;
            directory: string;
        }>;
    }];
    response: zod.ZodObject<{
        scannerJob: zod.ZodObject<{
            id: zod.ZodString;
            createdAt: zod.ZodDate;
            updatedAt: zod.ZodDate;
            state: zod.ZodString;
            scannerName: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            scannerVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            scannerConfig: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            duration: zod.ZodNullable<zod.ZodOptional<zod.ZodNumber>>;
            scanStartTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            scanEndTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            spdxLicenseListVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            packageId: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
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
            createdAt: Date;
            updatedAt: Date;
            state: string;
            packageId: number;
            scannerName?: string | null | undefined;
            scannerVersion?: string | null | undefined;
            scannerConfig?: string | null | undefined;
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
            packageId: number;
            scannerName?: string | null | undefined;
            scannerVersion?: string | null | undefined;
            scannerConfig?: string | null | undefined;
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
            packageId: number;
            scannerName?: string | null | undefined;
            scannerVersion?: string | null | undefined;
            scannerConfig?: string | null | undefined;
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
            scannerName: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            scannerVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            scannerConfig: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            duration: zod.ZodNullable<zod.ZodOptional<zod.ZodNumber>>;
            scanStartTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            scanEndTS: zod.ZodNullable<zod.ZodOptional<zod.ZodDate>>;
            spdxLicenseListVersion: zod.ZodNullable<zod.ZodOptional<zod.ZodString>>;
            packageId: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            state: string;
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
            createdAt: Date;
            updatedAt: Date;
            state: string;
            packageId: number;
            scannerName?: string | null | undefined;
            scannerVersion?: string | null | undefined;
            scannerConfig?: string | null | undefined;
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
            packageId: number;
            scannerName?: string | null | undefined;
            scannerVersion?: string | null | undefined;
            scannerConfig?: string | null | undefined;
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
            packageId: number;
            scannerName?: string | null | undefined;
            scannerVersion?: string | null | undefined;
            scannerConfig?: string | null | undefined;
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
                    duration: number;
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
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }, {
                            purl: string;
                            extra_data: {};
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                    purl: string;
                    extra_data: {};
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                    purl: string;
                    extra_data: {};
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                            score: number;
                            license_expression: string;
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
                            score: number;
                            license_expression: string;
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
                            score: number;
                            license_expression: string;
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
                            score: number;
                            license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string;
                    extra_data: {};
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string;
                    extra_data: {};
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                                score: number;
                                license_expression: string;
                                start_line: number;
                                end_line: number;
                                matched_length: number;
                                match_coverage: number;
                                matcher: string;
                                rule_identifier: string;
                                rule_relevance: number;
                                rule_url: string | null;
                            }, {
                                score: number;
                                license_expression: string;
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
                                score: number;
                                license_expression: string;
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
                                score: number;
                                license_expression: string;
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
                                version: zod.ZodOptional<zod.ZodString>;
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
                                        score: number;
                                        license_expression: string;
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
                                        score: number;
                                        license_expression: string;
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
                                        score: number;
                                        license_expression: string;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }, {
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }>, "many">>;
                                repository_homepage_url: zod.ZodOptional<zod.ZodString>;
                                repository_download_url: zod.ZodOptional<zod.ZodString>;
                                api_data_url: zod.ZodOptional<zod.ZodString>;
                                datasource_id: zod.ZodOptional<zod.ZodString>;
                                purl: zod.ZodOptional<zod.ZodString>;
                            }, "strip", zod.ZodTypeAny, {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            }, {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            }>;
                            extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                        }, "strip", zod.ZodTypeAny, {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }, {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
                            score: number;
                            license_expression: string;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }, {
                            score: number;
                            license_expression: string;
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
                            score: number;
                            license_expression: string;
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
                            score: number;
                            license_expression: string;
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
                    sha256: string | null;
                    name: string;
                    files_count: number;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            score: number;
                            license_expression: string;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
                    sha256: string | null;
                    name: string;
                    files_count: number;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            score: number;
                            license_expression: string;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
                headers: {
                    duration: number;
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
                    purl: string;
                    extra_data: {};
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                    purl: string;
                    name: string;
                    version: string;
                    extra_data: {};
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    sha256: string | null;
                    name: string;
                    files_count: number;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            score: number;
                            license_expression: string;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
            }, {
                headers: {
                    duration: number;
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
                    purl: string;
                    extra_data: {};
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                    purl: string;
                    name: string;
                    version: string;
                    extra_data: {};
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    sha256: string | null;
                    name: string;
                    files_count: number;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            score: number;
                            license_expression: string;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
                    purl: string;
                    extra_data: {};
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                    purl: string;
                    name: string;
                    version: string;
                    extra_data: {};
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    sha256: string | null;
                    name: string;
                    files_count: number;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            score: number;
                            license_expression: string;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
                    purl: string;
                    extra_data: {};
                    extracted_requirement: string | null;
                    scope: string;
                    is_runtime: boolean;
                    is_optional: boolean;
                    is_resolved: boolean;
                    resolved_package: ({} | {
                        type: string;
                        sha256: string | null;
                        copyright: string | null;
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                        purl: string;
                        name: string;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {};
                        }[];
                        namespace: string;
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
                    purl: string;
                    name: string;
                    version: string;
                    extra_data: {};
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                files: {
                    path: string;
                    type: string;
                    date: string | null;
                    sha256: string | null;
                    name: string;
                    files_count: number;
                    size: number;
                    sha1: string | null;
                    md5: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            score: number;
                            license_expression: string;
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
                        sha256: string | null;
                        copyright: string | null;
                        purl: string | null;
                        name: string | null;
                        version: string | null;
                        extra_data: {};
                        dependencies: {
                            purl: string;
                            extra_data: {};
                            extracted_requirement: string | null;
                            scope: string;
                            is_runtime: boolean;
                            is_optional: boolean;
                            is_resolved: boolean;
                            resolved_package: {
                                type?: string | undefined;
                                namespace?: string | undefined;
                                name?: string | undefined;
                                version?: string | undefined;
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
                                        score: number;
                                        license_expression: string;
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
                                    purl: string;
                                    extra_data: {};
                                    extracted_requirement: string;
                                    scope: string;
                                    is_runtime: boolean;
                                    is_optional: boolean;
                                    is_resolved: boolean;
                                    resolved_package: {};
                                }[] | undefined;
                                repository_homepage_url?: string | undefined;
                                repository_download_url?: string | undefined;
                                api_data_url?: string | undefined;
                                datasource_id?: string | undefined;
                                purl?: string | undefined;
                            };
                        }[];
                        namespace: string | null;
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
                                score: number;
                                license_expression: string;
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
        state: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        state: string;
    }, {
        state: string;
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
    createdAt: Date;
    updatedAt: Date;
    state: string;
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
    createdAt: Date;
    updatedAt: Date;
    state: string;
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
declare const DBFileSchema: z.ZodObject<{
    id: z.ZodNumber;
    sha256: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    scanStatus: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    sha256: string;
    scanStatus: string;
}, {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    sha256: string;
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
type UpdateScannerJobInput = z.infer<typeof UpdateScannerJobSchema>;
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
    id: number;
    data: {
        scanStatus?: string | undefined;
    };
}, {
    id: number;
    data: {
        scanStatus?: string | undefined;
    };
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
        scannerName: z.ZodString;
        scannerVersion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scannerName: string;
        scannerVersion: string;
        sha256: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
        score: number;
    }, {
        scannerName: string;
        scannerVersion: string;
        sha256: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
        score: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        scannerName: string;
        scannerVersion: string;
        sha256: string;
        scanner: string;
        licenseExpression: string;
        startLine: number;
        endLine: number;
        score: number;
    };
}, {
    data: {
        scannerName: string;
        scannerVersion: string;
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
        scannerName: z.ZodString;
        scannerVersion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        scannerName: string;
        scannerVersion: string;
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
    }, {
        scannerName: string;
        scannerVersion: string;
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        scannerName: string;
        scannerVersion: string;
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
    };
}, {
    data: {
        scannerName: string;
        scannerVersion: string;
        sha256: string;
        startLine: number;
        endLine: number;
        copyright: string;
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
        scanStatus: string;
        purl: string;
        name: string;
        version: string;
    }, {
        scanStatus: string;
        purl: string;
        name: string;
        version: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        scanStatus: string;
        purl: string;
        name: string;
        version: string;
    };
}, {
    data: {
        scanStatus: string;
        purl: string;
        name: string;
        version: string;
    };
}>;
type CreatePackageInput = z.infer<typeof CreatePackageSchema>;
declare const CreateFileTreeSchema: z.ZodObject<{
    data: z.ZodObject<{
        path: z.ZodString;
        packageId: z.ZodNumber;
        sha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        packageId: number;
        path: string;
        sha256: string;
    }, {
        packageId: number;
        path: string;
        sha256: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        packageId: number;
        path: string;
        sha256: string;
    };
}, {
    data: {
        packageId: number;
        path: string;
        sha256: string;
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
        description: string;
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
        data: zod.ZodObject<{
            directory: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            directory: string;
        }, {
            directory: string;
        }>;
        finishedOn: zod.ZodOptional<zod.ZodNumber>;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        state: string;
        data: {
            directory: string;
        };
        finishedOn?: number | undefined;
    }, {
        id: string;
        state: string;
        data: {
            directory: string;
        };
        finishedOn?: number | undefined;
    }>, "many">;
    errors: [{
        status: 500;
        description: string;
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
            directory: zod.ZodString;
            opts: zod.ZodObject<{
                jobId: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                jobId: string;
            }, {
                jobId: string;
            }>;
        }, "strip", zod.ZodTypeAny, {
            directory: string;
            opts: {
                jobId: string;
            };
        }, {
            directory: string;
            opts: {
                jobId: string;
            };
        }>;
    }];
    response: zod.ZodObject<{
        id: zod.ZodString;
        data: zod.ZodObject<{
            directory: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            directory: string;
        }, {
            directory: string;
        }>;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        data: {
            directory: string;
        };
    }, {
        id: string;
        data: {
            directory: string;
        };
    }>;
    errors: [{
        status: 500;
        description: string;
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 400;
        description: string;
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
                duration: number;
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
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }, {
                        purl: string;
                        extra_data: {};
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                purl: string;
                extra_data: {};
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                purl: string;
                extra_data: {};
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                        score: number;
                        license_expression: string;
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
                        score: number;
                        license_expression: string;
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
                        score: number;
                        license_expression: string;
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
                        score: number;
                        license_expression: string;
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
                sha256: string | null;
                copyright: string | null;
                purl: string;
                name: string;
                version: string;
                extra_data: {};
                namespace: string | null;
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
                        score: number;
                        license_expression: string;
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
                sha256: string | null;
                copyright: string | null;
                purl: string;
                name: string;
                version: string;
                extra_data: {};
                namespace: string | null;
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
                        score: number;
                        license_expression: string;
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
                            score: number;
                            license_expression: string;
                            start_line: number;
                            end_line: number;
                            matched_length: number;
                            match_coverage: number;
                            matcher: string;
                            rule_identifier: string;
                            rule_relevance: number;
                            rule_url: string | null;
                        }, {
                            score: number;
                            license_expression: string;
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
                            score: number;
                            license_expression: string;
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
                            score: number;
                            license_expression: string;
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
                            version: zod.ZodOptional<zod.ZodString>;
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
                                    score: number;
                                    license_expression: string;
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
                                    score: number;
                                    license_expression: string;
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
                                    score: number;
                                    license_expression: string;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }, {
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }>, "many">>;
                            repository_homepage_url: zod.ZodOptional<zod.ZodString>;
                            repository_download_url: zod.ZodOptional<zod.ZodString>;
                            api_data_url: zod.ZodOptional<zod.ZodString>;
                            datasource_id: zod.ZodOptional<zod.ZodString>;
                            purl: zod.ZodOptional<zod.ZodString>;
                        }, "strip", zod.ZodTypeAny, {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        }, {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        }>;
                        extra_data: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
                    }, "strip", zod.ZodTypeAny, {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }, {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                        score: number;
                        license_expression: string;
                        start_line: number;
                        end_line: number;
                        matched_length: number;
                        match_coverage: number;
                        matcher: string;
                        rule_identifier: string;
                        rule_relevance: number;
                        rule_url: string | null;
                    }, {
                        score: number;
                        license_expression: string;
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
                        score: number;
                        license_expression: string;
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
                        score: number;
                        license_expression: string;
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
                sha256: string | null;
                name: string;
                files_count: number;
                size: number;
                sha1: string | null;
                md5: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        score: number;
                        license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
                sha256: string | null;
                name: string;
                files_count: number;
                size: number;
                sha1: string | null;
                md5: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        score: number;
                        license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
            headers: {
                duration: number;
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
                purl: string;
                extra_data: {};
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                purl: string;
                name: string;
                version: string;
                extra_data: {};
                namespace: string | null;
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
                        score: number;
                        license_expression: string;
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
            files: {
                path: string;
                type: string;
                date: string | null;
                sha256: string | null;
                name: string;
                files_count: number;
                size: number;
                sha1: string | null;
                md5: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        score: number;
                        license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
        }, {
            headers: {
                duration: number;
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
                purl: string;
                extra_data: {};
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                purl: string;
                name: string;
                version: string;
                extra_data: {};
                namespace: string | null;
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
                        score: number;
                        license_expression: string;
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
            files: {
                path: string;
                type: string;
                date: string | null;
                sha256: string | null;
                name: string;
                files_count: number;
                size: number;
                sha1: string | null;
                md5: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        score: number;
                        license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
        }>>;
    }, "strip", zod.ZodTypeAny, {
        id: string;
        state?: string | undefined;
        data?: {
            directory: string;
        } | undefined;
        finishedOn?: number | undefined;
        result?: {
            headers: {
                duration: number;
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
                purl: string;
                extra_data: {};
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                purl: string;
                name: string;
                version: string;
                extra_data: {};
                namespace: string | null;
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
                        score: number;
                        license_expression: string;
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
            files: {
                path: string;
                type: string;
                date: string | null;
                sha256: string | null;
                name: string;
                files_count: number;
                size: number;
                sha1: string | null;
                md5: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        score: number;
                        license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
        } | undefined;
    }, {
        id: string;
        state?: string | undefined;
        data?: {
            directory: string;
        } | undefined;
        finishedOn?: number | undefined;
        result?: {
            headers: {
                duration: number;
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
                purl: string;
                extra_data: {};
                extracted_requirement: string | null;
                scope: string;
                is_runtime: boolean;
                is_optional: boolean;
                is_resolved: boolean;
                resolved_package: ({} | {
                    type: string;
                    sha256: string | null;
                    copyright: string | null;
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                    purl: string;
                    name: string;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {};
                    }[];
                    namespace: string;
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
                purl: string;
                name: string;
                version: string;
                extra_data: {};
                namespace: string | null;
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
                        score: number;
                        license_expression: string;
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
            files: {
                path: string;
                type: string;
                date: string | null;
                sha256: string | null;
                name: string;
                files_count: number;
                size: number;
                sha1: string | null;
                md5: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        score: number;
                        license_expression: string;
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
                    sha256: string | null;
                    copyright: string | null;
                    purl: string | null;
                    name: string | null;
                    version: string | null;
                    extra_data: {};
                    dependencies: {
                        purl: string;
                        extra_data: {};
                        extracted_requirement: string | null;
                        scope: string;
                        is_runtime: boolean;
                        is_optional: boolean;
                        is_resolved: boolean;
                        resolved_package: {
                            type?: string | undefined;
                            namespace?: string | undefined;
                            name?: string | undefined;
                            version?: string | undefined;
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
                                    score: number;
                                    license_expression: string;
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
                                purl: string;
                                extra_data: {};
                                extracted_requirement: string;
                                scope: string;
                                is_runtime: boolean;
                                is_optional: boolean;
                                is_resolved: boolean;
                                resolved_package: {};
                            }[] | undefined;
                            repository_homepage_url?: string | undefined;
                            repository_download_url?: string | undefined;
                            api_data_url?: string | undefined;
                            datasource_id?: string | undefined;
                            purl?: string | undefined;
                        };
                    }[];
                    namespace: string | null;
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
                            score: number;
                            license_expression: string;
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
        } | undefined;
    }>;
    errors: [{
        status: 500;
        description: string;
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 400;
        description: string;
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }, {
        status: 404;
        description: string;
        schema: zod.ZodObject<{
            error: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            error: string;
        }, {
            error: string;
        }>;
    }];
}];

export { CreateCopyrightFindingInput, CreateFileInput, CreateFileTreeInput, CreateLicenseFindingInput, CreatePackageInput, CreateScannerJobInput, DBFileSchema, DBScannerJobSchema, DBScannerJobType, UpdateFileInput, UpdateScannerJobInput, dosApi, scannerAgentApi };
