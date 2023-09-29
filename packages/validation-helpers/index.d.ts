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
            "--package": z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
            "--package"?: boolean | undefined;
        }, {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
            "--package"?: boolean | undefined;
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
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
            "--package"?: boolean | undefined;
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
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
            "--package"?: boolean | undefined;
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
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        type: z.ZodString;
        sha256: z.ZodNullable<z.ZodString>;
        detected_license_expression: z.ZodNullable<z.ZodString>;
        detected_license_expression_spdx: z.ZodNullable<z.ZodString>;
        license_detections: z.ZodArray<z.ZodObject<{
            license_expression: z.ZodString;
            matches: z.ZodArray<z.ZodObject<{
                score: z.ZodNumber;
                start_line: z.ZodNumber;
                end_line: z.ZodNumber;
                license_expression: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }, {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }[];
        }, {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }[];
        }>, "many">;
        copyrights: z.ZodArray<z.ZodObject<{
            copyright: z.ZodString;
            start_line: z.ZodNumber;
            end_line: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            start_line: number;
            end_line: number;
            copyright: string;
        }, {
            start_line: number;
            end_line: number;
            copyright: string;
        }>, "many">;
        scan_errors: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: string;
        sha256: string | null;
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }[];
        }[];
        copyrights: {
            start_line: number;
            end_line: number;
            copyright: string;
        }[];
        scan_errors: string[];
    }, {
        path: string;
        type: string;
        sha256: string | null;
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }[];
        }[];
        copyrights: {
            start_line: number;
            end_line: number;
            copyright: string;
        }[];
        scan_errors: string[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    files: {
        path: string;
        type: string;
        sha256: string | null;
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }[];
        }[];
        copyrights: {
            start_line: number;
            end_line: number;
            copyright: string;
        }[];
        scan_errors: string[];
    }[];
    headers: {
        message: string | null;
        options: {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
            "--package"?: boolean | undefined;
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
}, {
    files: {
        path: string;
        type: string;
        sha256: string | null;
        detected_license_expression: string | null;
        detected_license_expression_spdx: string | null;
        license_detections: {
            license_expression: string;
            matches: {
                license_expression: string;
                score: number;
                start_line: number;
                end_line: number;
            }[];
        }[];
        copyrights: {
            start_line: number;
            end_line: number;
            copyright: string;
        }[];
        scan_errors: string[];
    }[];
    headers: {
        message: string | null;
        options: {
            input: string[];
            "--copyright": boolean;
            "--info": boolean;
            "--license": boolean;
            "--json"?: string | undefined;
            "--json-pp"?: string | undefined;
            "--package"?: boolean | undefined;
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
            options: zod.ZodOptional<zod.ZodObject<{
                fetchConcluded: zod.ZodOptional<zod.ZodBoolean>;
            }, "strip", zod.ZodTypeAny, {
                fetchConcluded?: boolean | undefined;
            }, {
                fetchConcluded?: boolean | undefined;
            }>>;
        }, "strip", zod.ZodTypeAny, {
            purl: string;
            options?: {
                fetchConcluded?: boolean | undefined;
            } | undefined;
        }, {
            purl: string;
            options?: {
                fetchConcluded?: boolean | undefined;
            } | undefined;
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
            issues: zod.ZodArray<zod.ZodObject<{
                timestamp: zod.ZodDate;
                source: zod.ZodString;
                message: zod.ZodString;
                severity: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                message: string;
                timestamp: Date;
                source: string;
                severity: string;
            }, {
                message: string;
                timestamp: Date;
                source: string;
                severity: string;
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
            issues: {
                message: string;
                timestamp: Date;
                source: string;
                severity: string;
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
            issues: {
                message: string;
                timestamp: Date;
                source: string;
                severity: string;
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
            issues: {
                message: string;
                timestamp: Date;
                source: string;
                severity: string;
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
            issues: {
                message: string;
                timestamp: Date;
                source: string;
                severity: string;
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
                        "--package": zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
                    }, {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
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
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
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
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
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
                files: zod.ZodArray<zod.ZodObject<{
                    path: zod.ZodString;
                    type: zod.ZodString;
                    sha256: zod.ZodNullable<zod.ZodString>;
                    detected_license_expression: zod.ZodNullable<zod.ZodString>;
                    detected_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                    license_detections: zod.ZodArray<zod.ZodObject<{
                        license_expression: zod.ZodString;
                        matches: zod.ZodArray<zod.ZodObject<{
                            score: zod.ZodNumber;
                            start_line: zod.ZodNumber;
                            end_line: zod.ZodNumber;
                            license_expression: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }, {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }>, "many">;
                    }, "strip", zod.ZodTypeAny, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }, {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }>, "many">;
                    copyrights: zod.ZodArray<zod.ZodObject<{
                        copyright: zod.ZodString;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }, {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }>, "many">;
                    scan_errors: zod.ZodArray<zod.ZodString, "many">;
                }, "strip", zod.ZodTypeAny, {
                    path: string;
                    type: string;
                    sha256: string | null;
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                }, {
                    path: string;
                    type: string;
                    sha256: string | null;
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                }>, "many">;
            }, "strip", zod.ZodTypeAny, {
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
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
            }, {
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
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
            }>;
        }, "strip", zod.ZodTypeAny, {
            id: string;
            result: {
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
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
            };
        }, {
            id: string;
            result: {
                files: {
                    path: string;
                    type: string;
                    sha256: string | null;
                    detected_license_expression: string | null;
                    detected_license_expression_spdx: string | null;
                    license_detections: {
                        license_expression: string;
                        matches: {
                            license_expression: string;
                            score: number;
                            start_line: number;
                            end_line: number;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                }[];
                headers: {
                    message: string | null;
                    options: {
                        input: string[];
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--package"?: boolean | undefined;
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
}, {
    method: "post";
    path: "/user";
    description: "Add user";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            username: zod.ZodString;
            password: zod.ZodString;
            role: zod.ZodOptional<zod.ZodEnum<["ADMIN", "USER"]>>;
            subscription: zod.ZodOptional<zod.ZodEnum<["SILVER", "GOLD"]>>;
            token: zod.ZodOptional<zod.ZodString>;
        }, "strip", zod.ZodTypeAny, {
            username: string;
            password: string;
            role?: "ADMIN" | "USER" | undefined;
            subscription?: "SILVER" | "GOLD" | undefined;
            token?: string | undefined;
        }, {
            username: string;
            password: string;
            role?: "ADMIN" | "USER" | undefined;
            subscription?: "SILVER" | "GOLD" | undefined;
            token?: string | undefined;
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
    method: "delete";
    path: "/user";
    description: "Delete user";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            id: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            id: number;
        }, {
            id: number;
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
    path: "/license-conclusion";
    description: "Add a new license conclusion";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            concludedLicenseExpressionSPDX: zod.ZodString;
            detectedLicenseExpressionSPDX: zod.ZodString;
            comment: zod.ZodString;
            reason: zod.ZodString;
            startLine: zod.ZodNumber;
            endLine: zod.ZodNumber;
            fileSha256: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            concludedLicenseExpressionSPDX: string;
            detectedLicenseExpressionSPDX: string;
            comment: string;
            reason: string;
            startLine: number;
            endLine: number;
            fileSha256: string;
        }, {
            concludedLicenseExpressionSPDX: string;
            detectedLicenseExpressionSPDX: string;
            comment: string;
            reason: string;
            startLine: number;
            endLine: number;
            fileSha256: string;
        }>;
    }];
    response: zod.ZodObject<{
        licenseConclusionId: zod.ZodNumber;
        message: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        message: string;
        licenseConclusionId: number;
    }, {
        message: string;
        licenseConclusionId: number;
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
    path: "/license-conclusion/:id";
    description: "Update a license conclusion";
    parameters: [{
        name: "id";
        type: "Path";
        schema: zod.ZodString;
    }, {
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            concludedLicenseExpressionSPDX: zod.ZodOptional<zod.ZodString>;
            detectedLicenseExpressionSPDX: zod.ZodOptional<zod.ZodString>;
            comment: zod.ZodOptional<zod.ZodString>;
            reason: zod.ZodOptional<zod.ZodString>;
            startLine: zod.ZodOptional<zod.ZodNumber>;
            endLine: zod.ZodOptional<zod.ZodNumber>;
        }, "strip", zod.ZodTypeAny, {
            concludedLicenseExpressionSPDX?: string | undefined;
            detectedLicenseExpressionSPDX?: string | undefined;
            comment?: string | undefined;
            reason?: string | undefined;
            startLine?: number | undefined;
            endLine?: number | undefined;
        }, {
            concludedLicenseExpressionSPDX?: string | undefined;
            detectedLicenseExpressionSPDX?: string | undefined;
            comment?: string | undefined;
            reason?: string | undefined;
            startLine?: number | undefined;
            endLine?: number | undefined;
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
    method: "delete";
    path: "/license-conclusion/:id";
    description: "Delete a license conclusion";
    parameters: [{
        name: "id";
        type: "Path";
        schema: zod.ZodString;
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
    path: "/filetree";
    alias: "GetFileTree";
    description: "Get file tree for specified purl";
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
        filetrees: zod.ZodArray<zod.ZodObject<{
            path: zod.ZodString;
            packageId: zod.ZodNumber;
            fileSha256: zod.ZodString;
            file: zod.ZodObject<{
                licenseFindings: zod.ZodArray<zod.ZodObject<{
                    licenseExpressionSPDX: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    licenseExpressionSPDX: string;
                }, {
                    licenseExpressionSPDX: string;
                }>, "many">;
            }, "strip", zod.ZodTypeAny, {
                licenseFindings: {
                    licenseExpressionSPDX: string;
                }[];
            }, {
                licenseFindings: {
                    licenseExpressionSPDX: string;
                }[];
            }>;
        }, "strip", zod.ZodTypeAny, {
            path: string;
            fileSha256: string;
            packageId: number;
            file: {
                licenseFindings: {
                    licenseExpressionSPDX: string;
                }[];
            };
        }, {
            path: string;
            fileSha256: string;
            packageId: number;
            file: {
                licenseFindings: {
                    licenseExpressionSPDX: string;
                }[];
            };
        }>, "many">;
    }, "strip", zod.ZodTypeAny, {
        filetrees: {
            path: string;
            fileSha256: string;
            packageId: number;
            file: {
                licenseFindings: {
                    licenseExpressionSPDX: string;
                }[];
            };
        }[];
    }, {
        filetrees: {
            path: string;
            fileSha256: string;
            packageId: number;
            file: {
                licenseFindings: {
                    licenseExpressionSPDX: string;
                }[];
            };
        }[];
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
    path: "/packages";
    description: "Get packages";
    response: zod.ZodObject<{
        packages: zod.ZodArray<zod.ZodObject<{
            purl: zod.ZodString;
            updatedAt: zod.ZodDate;
        }, "strip", zod.ZodTypeAny, {
            purl: string;
            updatedAt: Date;
        }, {
            purl: string;
            updatedAt: Date;
        }>, "many">;
    }, "strip", zod.ZodTypeAny, {
        packages: {
            purl: string;
            updatedAt: Date;
        }[];
    }, {
        packages: {
            purl: string;
            updatedAt: Date;
        }[];
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
            options: zod.ZodObject<{
                timeout: zod.ZodOptional<zod.ZodString>;
            }, "strip", zod.ZodTypeAny, {
                timeout?: string | undefined;
            }, {
                timeout?: string | undefined;
            }>;
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
            options: {
                timeout?: string | undefined;
            };
            jobId: string;
            files: {
                path: string;
                hash: string;
            }[];
        }, {
            options: {
                timeout?: string | undefined;
            };
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
                    "--package": zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
                }, {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
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
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
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
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
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
            files: zod.ZodArray<zod.ZodObject<{
                path: zod.ZodString;
                type: zod.ZodString;
                sha256: zod.ZodNullable<zod.ZodString>;
                detected_license_expression: zod.ZodNullable<zod.ZodString>;
                detected_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                license_detections: zod.ZodArray<zod.ZodObject<{
                    license_expression: zod.ZodString;
                    matches: zod.ZodArray<zod.ZodObject<{
                        score: zod.ZodNumber;
                        start_line: zod.ZodNumber;
                        end_line: zod.ZodNumber;
                        license_expression: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }, {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }>, "many">;
                }, "strip", zod.ZodTypeAny, {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }, {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }>, "many">;
                copyrights: zod.ZodArray<zod.ZodObject<{
                    copyright: zod.ZodString;
                    start_line: zod.ZodNumber;
                    end_line: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }, {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }>, "many">;
                scan_errors: zod.ZodArray<zod.ZodString, "many">;
            }, "strip", zod.ZodTypeAny, {
                path: string;
                type: string;
                sha256: string | null;
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }[];
                copyrights: {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }[];
                scan_errors: string[];
            }, {
                path: string;
                type: string;
                sha256: string | null;
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }[];
                copyrights: {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }[];
                scan_errors: string[];
            }>, "many">;
        }, "strip", zod.ZodTypeAny, {
            files: {
                path: string;
                type: string;
                sha256: string | null;
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }[];
                copyrights: {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }[];
                scan_errors: string[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
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
        }, {
            files: {
                path: string;
                type: string;
                sha256: string | null;
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }[];
                copyrights: {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }[];
                scan_errors: string[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
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
                sha256: string | null;
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }[];
                copyrights: {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }[];
                scan_errors: string[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
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
                sha256: string | null;
                detected_license_expression: string | null;
                detected_license_expression_spdx: string | null;
                license_detections: {
                    license_expression: string;
                    matches: {
                        license_expression: string;
                        score: number;
                        start_line: number;
                        end_line: number;
                    }[];
                }[];
                copyrights: {
                    start_line: number;
                    end_line: number;
                    copyright: string;
                }[];
                scan_errors: string[];
            }[];
            headers: {
                message: string | null;
                options: {
                    input: string[];
                    "--copyright": boolean;
                    "--info": boolean;
                    "--license": boolean;
                    "--json"?: string | undefined;
                    "--json-pp"?: string | undefined;
                    "--package"?: boolean | undefined;
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
}, {
    method: "post";
    path: "/result-state/:id";
    description: "Set scanner job result state";
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
    packageId: number;
    updatedAt: Date;
    createdAt: Date;
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
    packageId: number;
    updatedAt: Date;
    createdAt: Date;
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
        scannerConfig: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodNumber>;
        scanStartTS: z.ZodOptional<z.ZodDate>;
        scanEndTS: z.ZodOptional<z.ZodDate>;
        spdxLicenseListVersion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        scannerConfig?: string | undefined;
        duration?: number | undefined;
        scanStartTS?: Date | undefined;
        scanEndTS?: Date | undefined;
        spdxLicenseListVersion?: string | undefined;
    }, {
        state?: string | undefined;
        scannerName?: string | undefined;
        scannerVersion?: string | undefined;
        scannerConfig?: string | undefined;
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
        scannerConfig?: string | undefined;
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
        scannerConfig?: string | undefined;
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
    updatedAt: Date;
    createdAt: Date;
    scanStatus: string;
}, {
    id: number;
    sha256: string;
    updatedAt: Date;
    createdAt: Date;
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
        scannerConfig: z.ZodString;
        licenseExpressionSPDX: z.ZodString;
        fileSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fileSha256: string;
        licenseExpressionSPDX: string;
        scannerConfig: string;
        scanner: string;
    }, {
        fileSha256: string;
        licenseExpressionSPDX: string;
        scannerConfig: string;
        scanner: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        fileSha256: string;
        licenseExpressionSPDX: string;
        scannerConfig: string;
        scanner: string;
    };
}, {
    data: {
        fileSha256: string;
        licenseExpressionSPDX: string;
        scannerConfig: string;
        scanner: string;
    };
}>;
type CreateLicenseFindingInput = z.infer<typeof CreateLicenseFindingSchema>;
declare const CreateLicenseFindingMatchSchema: z.ZodObject<{
    data: z.ZodObject<{
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        score: z.ZodNumber;
        licenseExpression: z.ZodString;
        licenseFindingId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        score: number;
        startLine: number;
        endLine: number;
        licenseExpression: string;
        licenseFindingId: number;
    }, {
        score: number;
        startLine: number;
        endLine: number;
        licenseExpression: string;
        licenseFindingId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        score: number;
        startLine: number;
        endLine: number;
        licenseExpression: string;
        licenseFindingId: number;
    };
}, {
    data: {
        score: number;
        startLine: number;
        endLine: number;
        licenseExpression: string;
        licenseFindingId: number;
    };
}>;
type CreateLicenseFindingMatchInput = z.infer<typeof CreateLicenseFindingMatchSchema>;
declare const CreateLicenseConclusionSchema: z.ZodObject<{
    data: z.ZodObject<{
        concludedLicenseExpressionSPDX: z.ZodString;
        detectedLicenseExpressionSPDX: z.ZodString;
        comment: z.ZodString;
        reason: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        score: z.ZodNumber;
        fileSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        score: number;
        concludedLicenseExpressionSPDX: string;
        detectedLicenseExpressionSPDX: string;
        comment: string;
        reason: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
    }, {
        score: number;
        concludedLicenseExpressionSPDX: string;
        detectedLicenseExpressionSPDX: string;
        comment: string;
        reason: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        score: number;
        concludedLicenseExpressionSPDX: string;
        detectedLicenseExpressionSPDX: string;
        comment: string;
        reason: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
    };
}, {
    data: {
        score: number;
        concludedLicenseExpressionSPDX: string;
        detectedLicenseExpressionSPDX: string;
        comment: string;
        reason: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
    };
}>;
type CreateLicenseConclusionInput = z.infer<typeof CreateLicenseConclusionSchema>;
declare const CreateCopyrightFindingSchema: z.ZodObject<{
    data: z.ZodObject<{
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        copyright: z.ZodString;
        scanner: z.ZodString;
        scannerConfig: z.ZodString;
        fileSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        copyright: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    }, {
        copyright: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        copyright: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    };
}, {
    data: {
        copyright: string;
        startLine: number;
        endLine: number;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    };
}>;
type CreateCopyrightFindingInput = z.infer<typeof CreateCopyrightFindingSchema>;
declare const CreateScanIssueSchema: z.ZodObject<{
    data: z.ZodObject<{
        severity: z.ZodString;
        message: z.ZodString;
        scanner: z.ZodString;
        scannerConfig: z.ZodString;
        fileSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        severity: string;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    }, {
        message: string;
        severity: string;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        message: string;
        severity: string;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    };
}, {
    data: {
        message: string;
        severity: string;
        fileSha256: string;
        scannerConfig: string;
        scanner: string;
    };
}>;
type CreateScanIssueInput = z.infer<typeof CreateScanIssueSchema>;
declare const CreatePackageSchema: z.ZodObject<{
    data: z.ZodObject<{
        purl: z.ZodString;
        name: z.ZodString;
        version: z.ZodString;
        scanStatus: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purl: string;
        name: string;
        scanStatus: string;
        version: string;
    }, {
        purl: string;
        name: string;
        scanStatus: string;
        version: string;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        purl: string;
        name: string;
        scanStatus: string;
        version: string;
    };
}, {
    data: {
        purl: string;
        name: string;
        scanStatus: string;
        version: string;
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
        fileSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        fileSha256: string;
        packageId: number;
    }, {
        path: string;
        fileSha256: string;
        packageId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        path: string;
        fileSha256: string;
        packageId: number;
    };
}, {
    data: {
        path: string;
        fileSha256: string;
        packageId: number;
    };
}>;
type CreateFileTreeInput = z.infer<typeof CreateFileTreeSchema>;

declare const loginFormSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
type LoginFormType = z.infer<typeof loginFormSchema>;

declare const authAPI: [{
    method: "post";
    path: "/login/password";
    description: "Login with password";
    alias: "PostLoginPassword";
    parameters: [{
        name: "body";
        type: "Body";
        schema: zod.ZodObject<{
            username: zod.ZodString;
            password: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            username: string;
            password: string;
        }, {
            username: string;
            password: string;
        }>;
    }];
    response: zod.ZodObject<{}, "strip", zod.ZodTypeAny, {}, {}>;
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
    path: "/logout";
    description: "Logout";
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

declare const userAPI: [{
    method: "get";
    path: "/user";
    description: "Get user";
    alias: "GetUser";
    response: zod.ZodObject<{
        username: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        username: string;
    }, {
        username: string;
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

declare const FileTree: z.ZodObject<{
    path: z.ZodString;
    packageId: z.ZodNumber;
    fileSha256: z.ZodString;
    file: z.ZodObject<{
        licenseFindings: z.ZodArray<z.ZodObject<{
            licenseExpressionSPDX: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            licenseExpressionSPDX: string;
        }, {
            licenseExpressionSPDX: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        licenseFindings: {
            licenseExpressionSPDX: string;
        }[];
    }, {
        licenseFindings: {
            licenseExpressionSPDX: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    path: string;
    fileSha256: string;
    packageId: number;
    file: {
        licenseFindings: {
            licenseExpressionSPDX: string;
        }[];
    };
}, {
    path: string;
    fileSha256: string;
    packageId: number;
    file: {
        licenseFindings: {
            licenseExpressionSPDX: string;
        }[];
    };
}>;
type FileTreeType = z.infer<typeof FileTree>;
declare const PostFileTreeRes: z.ZodObject<{
    filetrees: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        packageId: z.ZodNumber;
        fileSha256: z.ZodString;
        file: z.ZodObject<{
            licenseFindings: z.ZodArray<z.ZodObject<{
                licenseExpressionSPDX: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                licenseExpressionSPDX: string;
            }, {
                licenseExpressionSPDX: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            licenseFindings: {
                licenseExpressionSPDX: string;
            }[];
        }, {
            licenseFindings: {
                licenseExpressionSPDX: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        fileSha256: string;
        packageId: number;
        file: {
            licenseFindings: {
                licenseExpressionSPDX: string;
            }[];
        };
    }, {
        path: string;
        fileSha256: string;
        packageId: number;
        file: {
            licenseFindings: {
                licenseExpressionSPDX: string;
            }[];
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filetrees: {
        path: string;
        fileSha256: string;
        packageId: number;
        file: {
            licenseFindings: {
                licenseExpressionSPDX: string;
            }[];
        };
    }[];
}, {
    filetrees: {
        path: string;
        fileSha256: string;
        packageId: number;
        file: {
            licenseFindings: {
                licenseExpressionSPDX: string;
            }[];
        };
    }[];
}>;
type PostFileTreeResType = z.infer<typeof PostFileTreeRes>;
declare const GetPackagesRes: z.ZodObject<{
    packages: z.ZodArray<z.ZodObject<{
        purl: z.ZodString;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        purl: string;
        updatedAt: Date;
    }, {
        purl: string;
        updatedAt: Date;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    packages: {
        purl: string;
        updatedAt: Date;
    }[];
}, {
    packages: {
        purl: string;
        updatedAt: Date;
    }[];
}>;
type GetPackagesResType = z.infer<typeof GetPackagesRes>;

export { CreateCopyrightFindingInput, CreateFileInput, CreateFileTreeInput, CreateLicenseConclusionInput, CreateLicenseFindingInput, CreateLicenseFindingMatchInput, CreatePackageInput, CreateScanIssueInput, CreateScannerJobInput, DBFileSchema, DBScannerJobSchema, DBScannerJobType, FileTreeType, GetPackagesResType, LoginFormType, PostFileTreeResType, ScannerJobOnlyIdOutput, ScannerJobResultSchema, UpdateFileInput, UpdatePackageInput, UpdateScannerJobInput, authAPI, dosApi, loginFormSchema, scannerAgentApi, userAPI };
