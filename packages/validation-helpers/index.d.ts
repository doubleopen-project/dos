// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as zod from "zod";
import { z } from "zod";

declare const ScannerJobResultSchema: z.ZodObject<
    {
        headers: z.ZodArray<
            z.ZodObject<
                {
                    tool_name: z.ZodString;
                    tool_version: z.ZodString;
                    options: z.ZodObject<
                        {
                            "--copyright": z.ZodBoolean;
                            "--info": z.ZodBoolean;
                            "--json": z.ZodOptional<z.ZodString>;
                            "--json-pp": z.ZodOptional<z.ZodString>;
                            "--license": z.ZodBoolean;
                            "--license-references": z.ZodOptional<z.ZodBoolean>;
                            "--package": z.ZodOptional<z.ZodBoolean>;
                            "--processes": z.ZodOptional<z.ZodString>;
                            "--quiet": z.ZodOptional<z.ZodBoolean>;
                            "--strip-root": z.ZodOptional<z.ZodBoolean>;
                        },
                        "strip",
                        z.ZodTypeAny,
                        {
                            "--copyright": boolean;
                            "--info": boolean;
                            "--license": boolean;
                            "--json"?: string | undefined;
                            "--json-pp"?: string | undefined;
                            "--license-references"?: boolean | undefined;
                            "--package"?: boolean | undefined;
                            "--processes"?: string | undefined;
                            "--quiet"?: boolean | undefined;
                            "--strip-root"?: boolean | undefined;
                        },
                        {
                            "--copyright": boolean;
                            "--info": boolean;
                            "--license": boolean;
                            "--json"?: string | undefined;
                            "--json-pp"?: string | undefined;
                            "--license-references"?: boolean | undefined;
                            "--package"?: boolean | undefined;
                            "--processes"?: string | undefined;
                            "--quiet"?: boolean | undefined;
                            "--strip-root"?: boolean | undefined;
                        }
                    >;
                    notice: z.ZodString;
                    start_timestamp: z.ZodString;
                    end_timestamp: z.ZodString;
                    output_format_version: z.ZodString;
                    duration: z.ZodNumber;
                    message: z.ZodNullable<z.ZodString>;
                    errors: z.ZodArray<z.ZodUnknown, "many">;
                    warnings: z.ZodArray<z.ZodUnknown, "many">;
                    extra_data: z.ZodObject<
                        {
                            system_environment: z.ZodObject<
                                {
                                    operating_system: z.ZodString;
                                    cpu_architecture: z.ZodString;
                                    platform: z.ZodString;
                                    platform_version: z.ZodString;
                                    python_version: z.ZodString;
                                },
                                "strip",
                                z.ZodTypeAny,
                                {
                                    operating_system: string;
                                    cpu_architecture: string;
                                    platform: string;
                                    platform_version: string;
                                    python_version: string;
                                },
                                {
                                    operating_system: string;
                                    cpu_architecture: string;
                                    platform: string;
                                    platform_version: string;
                                    python_version: string;
                                }
                            >;
                            spdx_license_list_version: z.ZodString;
                            files_count: z.ZodNumber;
                        },
                        "strip",
                        z.ZodTypeAny,
                        {
                            system_environment: {
                                operating_system: string;
                                cpu_architecture: string;
                                platform: string;
                                platform_version: string;
                                python_version: string;
                            };
                            spdx_license_list_version: string;
                            files_count: number;
                        },
                        {
                            system_environment: {
                                operating_system: string;
                                cpu_architecture: string;
                                platform: string;
                                platform_version: string;
                                python_version: string;
                            };
                            spdx_license_list_version: string;
                            files_count: number;
                        }
                    >;
                },
                "strip",
                z.ZodTypeAny,
                {
                    message: string | null;
                    options: {
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--license-references"?: boolean | undefined;
                        "--package"?: boolean | undefined;
                        "--processes"?: string | undefined;
                        "--quiet"?: boolean | undefined;
                        "--strip-root"?: boolean | undefined;
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
                },
                {
                    message: string | null;
                    options: {
                        "--copyright": boolean;
                        "--info": boolean;
                        "--license": boolean;
                        "--json"?: string | undefined;
                        "--json-pp"?: string | undefined;
                        "--license-references"?: boolean | undefined;
                        "--package"?: boolean | undefined;
                        "--processes"?: string | undefined;
                        "--quiet"?: boolean | undefined;
                        "--strip-root"?: boolean | undefined;
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
                }
            >,
            "many"
        >;
        license_references: z.ZodArray<
            z.ZodObject<
                {
                    key: z.ZodString;
                    spdx_license_key: z.ZodString;
                },
                "strip",
                z.ZodTypeAny,
                {
                    key: string;
                    spdx_license_key: string;
                },
                {
                    key: string;
                    spdx_license_key: string;
                }
            >,
            "many"
        >;
        files: z.ZodArray<
            z.ZodObject<
                {
                    path: z.ZodString;
                    type: z.ZodString;
                    sha256: z.ZodNullable<z.ZodString>;
                    detected_license_expression: z.ZodNullable<z.ZodString>;
                    detected_license_expression_spdx: z.ZodNullable<z.ZodString>;
                    license_detections: z.ZodArray<
                        z.ZodObject<
                            {
                                license_expression: z.ZodString;
                                matches: z.ZodArray<
                                    z.ZodObject<
                                        {
                                            score: z.ZodNumber;
                                            start_line: z.ZodNumber;
                                            end_line: z.ZodNumber;
                                            license_expression: z.ZodString;
                                            spdx_license_expression: z.ZodNullable<z.ZodString>;
                                        },
                                        "strip",
                                        z.ZodTypeAny,
                                        {
                                            license_expression: string;
                                            score: number;
                                            start_line: number;
                                            end_line: number;
                                            spdx_license_expression:
                                                | string
                                                | null;
                                        },
                                        {
                                            license_expression: string;
                                            score: number;
                                            start_line: number;
                                            end_line: number;
                                            spdx_license_expression:
                                                | string
                                                | null;
                                        }
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            z.ZodTypeAny,
                            {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    spdx_license_expression: string | null;
                                }[];
                            },
                            {
                                license_expression: string;
                                matches: {
                                    license_expression: string;
                                    score: number;
                                    start_line: number;
                                    end_line: number;
                                    spdx_license_expression: string | null;
                                }[];
                            }
                        >,
                        "many"
                    >;
                    copyrights: z.ZodArray<
                        z.ZodObject<
                            {
                                copyright: z.ZodString;
                                start_line: z.ZodNumber;
                                end_line: z.ZodNumber;
                            },
                            "strip",
                            z.ZodTypeAny,
                            {
                                start_line: number;
                                end_line: number;
                                copyright: string;
                            },
                            {
                                start_line: number;
                                end_line: number;
                                copyright: string;
                            }
                        >,
                        "many"
                    >;
                    scan_errors: z.ZodArray<z.ZodString, "many">;
                },
                "strip",
                z.ZodTypeAny,
                {
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
                            spdx_license_expression: string | null;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                },
                {
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
                            spdx_license_expression: string | null;
                        }[];
                    }[];
                    copyrights: {
                        start_line: number;
                        end_line: number;
                        copyright: string;
                    }[];
                    scan_errors: string[];
                }
            >,
            "many"
        >;
    },
    "strip",
    z.ZodTypeAny,
    {
        headers: {
            message: string | null;
            options: {
                "--copyright": boolean;
                "--info": boolean;
                "--license": boolean;
                "--json"?: string | undefined;
                "--json-pp"?: string | undefined;
                "--license-references"?: boolean | undefined;
                "--package"?: boolean | undefined;
                "--processes"?: string | undefined;
                "--quiet"?: boolean | undefined;
                "--strip-root"?: boolean | undefined;
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
        license_references: {
            key: string;
            spdx_license_key: string;
        }[];
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
                    spdx_license_expression: string | null;
                }[];
            }[];
            copyrights: {
                start_line: number;
                end_line: number;
                copyright: string;
            }[];
            scan_errors: string[];
        }[];
    },
    {
        headers: {
            message: string | null;
            options: {
                "--copyright": boolean;
                "--info": boolean;
                "--license": boolean;
                "--json"?: string | undefined;
                "--json-pp"?: string | undefined;
                "--license-references"?: boolean | undefined;
                "--package"?: boolean | undefined;
                "--processes"?: string | undefined;
                "--quiet"?: boolean | undefined;
                "--strip-root"?: boolean | undefined;
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
        license_references: {
            key: string;
            spdx_license_key: string;
        }[];
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
                    spdx_license_expression: string | null;
                }[];
            }[];
            copyrights: {
                start_line: number;
                end_line: number;
                copyright: string;
            }[];
            scan_errors: string[];
        }[];
    }
>;
type ScannerJobResultType = z.infer<typeof ScannerJobResultSchema>;

declare const adminAPI: [
    {
        method: "delete";
        path: "/scan-results";
        description: "Delete scan results and other data for specified purl. Doesn't delete files and related data if files are in other packages";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        purl: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        purl: string;
                    },
                    {
                        purl: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/users";
        description: "Create user";
        alias: "CreateUser";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        username: zod.ZodEffects<
                            zod.ZodEffects<
                                zod.ZodEffects<zod.ZodString, string, string>,
                                string,
                                string
                            >,
                            string,
                            string
                        >;
                        password: zod.ZodEffects<zod.ZodString, string, string>;
                        passwordIsTemporary: zod.ZodOptional<zod.ZodBoolean>;
                        role: zod.ZodOptional<zod.ZodEnum<["ADMIN", "USER"]>>;
                        firstName: zod.ZodOptional<zod.ZodString>;
                        lastName: zod.ZodOptional<zod.ZodString>;
                        email: zod.ZodOptional<zod.ZodString>;
                        emailVerified: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        username: string;
                        password: string;
                        passwordIsTemporary?: boolean | undefined;
                        role?: "ADMIN" | "USER" | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    },
                    {
                        username: string;
                        password: string;
                        passwordIsTemporary?: boolean | undefined;
                        role?: "ADMIN" | "USER" | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                id: zod.ZodString;
                username: zod.ZodString;
                realmRoles: zod.ZodArray<zod.ZodString, "many">;
                firstName: zod.ZodOptional<zod.ZodString>;
                lastName: zod.ZodOptional<zod.ZodString>;
                email: zod.ZodOptional<zod.ZodString>;
                emailVerified: zod.ZodOptional<zod.ZodBoolean>;
                requiredActions: zod.ZodOptional<
                    zod.ZodArray<zod.ZodString, "many">
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                username: string;
                id: string;
                realmRoles: string[];
                firstName?: string | undefined;
                lastName?: string | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                requiredActions?: string[] | undefined;
            },
            {
                username: string;
                id: string;
                realmRoles: string[];
                firstName?: string | undefined;
                lastName?: string | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                requiredActions?: string[] | undefined;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/users/:id";
        description: "Delete user";
        alias: "DeleteUser";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/purl-cleanup";
        description: "Remove old purl bookmarks. Get detailed descriptions of options by making this query with an empty body.";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        options: zod.ZodOptional<
                            zod.ZodObject<
                                {
                                    dryRun: zod.ZodOptional<zod.ZodBoolean>;
                                    pkgNameStartsWith: zod.ZodOptional<zod.ZodString>;
                                    allPhases: zod.ZodOptional<zod.ZodBoolean>;
                                    transferPathExclusions: zod.ZodOptional<zod.ZodBoolean>;
                                    transferBulkConclusions: zod.ZodOptional<zod.ZodBoolean>;
                                    changeContextPurls: zod.ZodOptional<zod.ZodBoolean>;
                                    deleteOldPurlBookmarks: zod.ZodOptional<zod.ZodBoolean>;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    dryRun?: boolean | undefined;
                                    pkgNameStartsWith?: string | undefined;
                                    allPhases?: boolean | undefined;
                                    transferPathExclusions?:
                                        | boolean
                                        | undefined;
                                    transferBulkConclusions?:
                                        | boolean
                                        | undefined;
                                    changeContextPurls?: boolean | undefined;
                                    deleteOldPurlBookmarks?:
                                        | boolean
                                        | undefined;
                                },
                                {
                                    dryRun?: boolean | undefined;
                                    pkgNameStartsWith?: string | undefined;
                                    allPhases?: boolean | undefined;
                                    transferPathExclusions?:
                                        | boolean
                                        | undefined;
                                    transferBulkConclusions?:
                                        | boolean
                                        | undefined;
                                    changeContextPurls?: boolean | undefined;
                                    deleteOldPurlBookmarks?:
                                        | boolean
                                        | undefined;
                                }
                            >
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        options?:
                            | {
                                  dryRun?: boolean | undefined;
                                  pkgNameStartsWith?: string | undefined;
                                  allPhases?: boolean | undefined;
                                  transferPathExclusions?: boolean | undefined;
                                  transferBulkConclusions?: boolean | undefined;
                                  changeContextPurls?: boolean | undefined;
                                  deleteOldPurlBookmarks?: boolean | undefined;
                              }
                            | undefined;
                    },
                    {
                        options?:
                            | {
                                  dryRun?: boolean | undefined;
                                  pkgNameStartsWith?: string | undefined;
                                  allPhases?: boolean | undefined;
                                  transferPathExclusions?: boolean | undefined;
                                  transferBulkConclusions?: boolean | undefined;
                                  changeContextPurls?: boolean | undefined;
                                  deleteOldPurlBookmarks?: boolean | undefined;
                              }
                            | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
                optionDescriptions: zod.ZodObject<
                    {
                        dryRun: zod.ZodString;
                        pkgNameStartsWith: zod.ZodString;
                        allPhases: zod.ZodString;
                        transferPathExclusions: zod.ZodString;
                        transferBulkConclusions: zod.ZodString;
                        changeContextPurls: zod.ZodString;
                        deleteOldPurlBookmarks: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        dryRun: string;
                        pkgNameStartsWith: string;
                        allPhases: string;
                        transferPathExclusions: string;
                        transferBulkConclusions: string;
                        changeContextPurls: string;
                        deleteOldPurlBookmarks: string;
                    },
                    {
                        dryRun: string;
                        pkgNameStartsWith: string;
                        allPhases: string;
                        transferPathExclusions: string;
                        transferBulkConclusions: string;
                        changeContextPurls: string;
                        deleteOldPurlBookmarks: string;
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                optionDescriptions: {
                    dryRun: string;
                    pkgNameStartsWith: string;
                    allPhases: string;
                    transferPathExclusions: string;
                    transferBulkConclusions: string;
                    changeContextPurls: string;
                    deleteOldPurlBookmarks: string;
                };
            },
            {
                message: string;
                optionDescriptions: {
                    dryRun: string;
                    pkgNameStartsWith: string;
                    allPhases: string;
                    transferPathExclusions: string;
                    transferBulkConclusions: string;
                    changeContextPurls: string;
                    deleteOldPurlBookmarks: string;
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages";
        description: "Get packages. Alias: GetPackages";
        alias: "GetPackages";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "purl",
                            "name",
                            "version",
                            "type",
                            "namespace",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "name";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "namespace";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "version";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "type";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                packages: zod.ZodArray<
                    zod.ZodObject<
                        {
                            purl: zod.ZodString;
                            updatedAt: zod.ZodDate;
                            name: zod.ZodString;
                            version: zod.ZodNullable<zod.ZodString>;
                            type: zod.ZodString;
                            namespace: zod.ZodNullable<zod.ZodString>;
                            qualifiers: zod.ZodNullable<zod.ZodString>;
                            subpath: zod.ZodNullable<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            type: string;
                            purl: string;
                            name: string;
                            version: string | null;
                            namespace: string | null;
                            updatedAt: Date;
                            qualifiers: string | null;
                            subpath: string | null;
                        },
                        {
                            type: string;
                            purl: string;
                            name: string;
                            version: string | null;
                            namespace: string | null;
                            updatedAt: Date;
                            qualifiers: string | null;
                            subpath: string | null;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                packages: {
                    type: string;
                    purl: string;
                    name: string;
                    version: string | null;
                    namespace: string | null;
                    updatedAt: Date;
                    qualifiers: string | null;
                    subpath: string | null;
                }[];
            },
            {
                packages: {
                    type: string;
                    purl: string;
                    name: string;
                    version: string | null;
                    namespace: string | null;
                    updatedAt: Date;
                    qualifiers: string | null;
                    subpath: string | null;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/count";
        description: "Get packages count. Alias: GetPackagesCount";
        alias: "GetPackagesCount";
        parameters: [
            {
                name: "name";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "namespace";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "version";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "type";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/clearance-items/distinct-users";
        description: "Get information about the distinct users that have made clearance items";
        response: zod.ZodObject<
            {
                users: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodString;
                            username: zod.ZodOptional<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: string;
                            username?: string | undefined;
                        },
                        {
                            id: string;
                            username?: string | undefined;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                users: {
                    id: string;
                    username?: string | undefined;
                }[];
            },
            {
                users: {
                    id: string;
                    username?: string | undefined;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/clearance-items/reassign";
        description: "Reassign clearance items to a new user ID";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        userId: zod.ZodString;
                        newUserId: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        userId: string;
                        newUserId: string;
                    },
                    {
                        userId: string;
                        newUserId: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
                counts: zod.ZodObject<
                    {
                        pathExclusions: zod.ZodNumber;
                        bulkConclusions: zod.ZodNumber;
                        licenseConclusions: zod.ZodNumber;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pathExclusions: number;
                        bulkConclusions: number;
                        licenseConclusions: number;
                    },
                    {
                        pathExclusions: number;
                        bulkConclusions: number;
                        licenseConclusions: number;
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                counts: {
                    pathExclusions: number;
                    bulkConclusions: number;
                    licenseConclusions: number;
                };
            },
            {
                message: string;
                counts: {
                    pathExclusions: number;
                    bulkConclusions: number;
                    licenseConclusions: number;
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
];

declare const authAPI: [
    {
        method: "post";
        path: "/logout";
        description: "Logout";
        alias: "PostLogout";
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
];

declare const scannerAPI: [
    {
        method: "get";
        path: "/health";
        description: "Get health status of the API";
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/scan-results";
        description: string;
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodUnion<
                    [
                        zod.ZodObject<
                            {
                                purls: zod.ZodArray<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                purls: string[];
                            },
                            {
                                purls: string[];
                            }
                        >,
                        zod.ZodObject<
                            {
                                packages: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            purl: zod.ZodEffects<
                                                zod.ZodString,
                                                string,
                                                string
                                            >;
                                            declaredLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        },
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        }
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                            },
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                            }
                        >,
                    ]
                >;
            },
        ];
        response: zod.ZodObject<
            {
                purls: zod.ZodArray<
                    zod.ZodEffects<zod.ZodString, string, string>,
                    "many"
                >;
                state: zod.ZodObject<
                    {
                        status: zod.ZodEnum<["no-results", "pending", "ready"]>;
                        jobId: zod.ZodNullable<zod.ZodString>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        status: "no-results" | "pending" | "ready";
                        jobId: string | null;
                    },
                    {
                        status: "no-results" | "pending" | "ready";
                        jobId: string | null;
                    }
                >;
                results: zod.ZodUnion<
                    [
                        zod.ZodNull,
                        zod.ZodObject<
                            {
                                licenses: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            license: zod.ZodString;
                                            location: zod.ZodObject<
                                                {
                                                    path: zod.ZodString;
                                                    start_line: zod.ZodOptional<zod.ZodNumber>;
                                                    end_line: zod.ZodOptional<zod.ZodNumber>;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    path: string;
                                                    start_line?:
                                                        | number
                                                        | undefined;
                                                    end_line?:
                                                        | number
                                                        | undefined;
                                                },
                                                {
                                                    path: string;
                                                    start_line?:
                                                        | number
                                                        | undefined;
                                                    end_line?:
                                                        | number
                                                        | undefined;
                                                }
                                            >;
                                            score: zod.ZodOptional<zod.ZodNumber>;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            license: string;
                                            location: {
                                                path: string;
                                                start_line?: number | undefined;
                                                end_line?: number | undefined;
                                            };
                                            score?: number | undefined;
                                        },
                                        {
                                            license: string;
                                            location: {
                                                path: string;
                                                start_line?: number | undefined;
                                                end_line?: number | undefined;
                                            };
                                            score?: number | undefined;
                                        }
                                    >,
                                    "many"
                                >;
                                copyrights: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            statement: zod.ZodString;
                                            location: zod.ZodObject<
                                                {
                                                    path: zod.ZodString;
                                                    start_line: zod.ZodNumber;
                                                    end_line: zod.ZodNumber;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    path: string;
                                                    start_line: number;
                                                    end_line: number;
                                                },
                                                {
                                                    path: string;
                                                    start_line: number;
                                                    end_line: number;
                                                }
                                            >;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            location: {
                                                path: string;
                                                start_line: number;
                                                end_line: number;
                                            };
                                            statement: string;
                                        },
                                        {
                                            location: {
                                                path: string;
                                                start_line: number;
                                                end_line: number;
                                            };
                                            statement: string;
                                        }
                                    >,
                                    "many"
                                >;
                                issues: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            timestamp: zod.ZodDate;
                                            source: zod.ZodString;
                                            message: zod.ZodString;
                                            severity: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            message: string;
                                            timestamp: Date;
                                            source: string;
                                            severity: string;
                                        },
                                        {
                                            message: string;
                                            timestamp: Date;
                                            source: string;
                                            severity: string;
                                        }
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                copyrights: {
                                    location: {
                                        path: string;
                                        start_line: number;
                                        end_line: number;
                                    };
                                    statement: string;
                                }[];
                                licenses: {
                                    license: string;
                                    location: {
                                        path: string;
                                        start_line?: number | undefined;
                                        end_line?: number | undefined;
                                    };
                                    score?: number | undefined;
                                }[];
                                issues: {
                                    message: string;
                                    timestamp: Date;
                                    source: string;
                                    severity: string;
                                }[];
                            },
                            {
                                copyrights: {
                                    location: {
                                        path: string;
                                        start_line: number;
                                        end_line: number;
                                    };
                                    statement: string;
                                }[];
                                licenses: {
                                    license: string;
                                    location: {
                                        path: string;
                                        start_line?: number | undefined;
                                        end_line?: number | undefined;
                                    };
                                    score?: number | undefined;
                                }[];
                                issues: {
                                    message: string;
                                    timestamp: Date;
                                    source: string;
                                    severity: string;
                                }[];
                            }
                        >,
                    ]
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                purls: string[];
                state: {
                    status: "no-results" | "pending" | "ready";
                    jobId: string | null;
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
                        license: string;
                        location: {
                            path: string;
                            start_line?: number | undefined;
                            end_line?: number | undefined;
                        };
                        score?: number | undefined;
                    }[];
                    issues: {
                        message: string;
                        timestamp: Date;
                        source: string;
                        severity: string;
                    }[];
                } | null;
            },
            {
                purls: string[];
                state: {
                    status: "no-results" | "pending" | "ready";
                    jobId: string | null;
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
                        license: string;
                        location: {
                            path: string;
                            start_line?: number | undefined;
                            end_line?: number | undefined;
                        };
                        score?: number | undefined;
                    }[];
                    issues: {
                        message: string;
                        timestamp: Date;
                        source: string;
                        severity: string;
                    }[];
                } | null;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/package-configuration";
        description: "Get package configuration for specified purl";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        purl: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        purl: string;
                    },
                    {
                        purl: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            path: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            path: string;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                        },
                        {
                            path: string;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                        }
                    >,
                    "many"
                >;
                pathExclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            pattern: zod.ZodString;
                            reason: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            comment: string | null;
                            pattern: string;
                            reason: string;
                        },
                        {
                            comment: string | null;
                            pattern: string;
                            reason: string;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                pathExclusions: {
                    comment: string | null;
                    pattern: string;
                    reason: string;
                }[];
                licenseConclusions: {
                    path: string;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                }[];
            },
            {
                pathExclusions: {
                    comment: string | null;
                    pattern: string;
                    reason: string;
                }[];
                licenseConclusions: {
                    path: string;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/upload-url";
        description: "Get presigned upload URL for S3 object storage with specified object key";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        key: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        key: string;
                    },
                    {
                        key: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                success: zod.ZodBoolean;
                presignedUrl: zod.ZodOptional<zod.ZodString>;
                message: zod.ZodOptional<zod.ZodString>;
            },
            "strip",
            zod.ZodTypeAny,
            {
                success: boolean;
                presignedUrl?: string | undefined;
                message?: string | undefined;
            },
            {
                success: boolean;
                presignedUrl?: string | undefined;
                message?: string | undefined;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/job";
        description: "Add new scanner job for specified purl(s). Give multiple purls in the case where these purls are all part of the same source.";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodUnion<
                    [
                        zod.ZodObject<
                            {
                                zipFileKey: zod.ZodString;
                                purls: zod.ZodArray<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                purls: string[];
                                zipFileKey: string;
                            },
                            {
                                purls: string[];
                                zipFileKey: string;
                            }
                        >,
                        zod.ZodObject<
                            {
                                zipFileKey: zod.ZodString;
                                packages: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            purl: zod.ZodEffects<
                                                zod.ZodString,
                                                string,
                                                string
                                            >;
                                            declaredLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        },
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        }
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                                zipFileKey: string;
                            },
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                                zipFileKey: string;
                            }
                        >,
                    ]
                >;
            },
        ];
        response: zod.ZodObject<
            {
                scannerJobId: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                scannerJobId: string;
            },
            {
                scannerJobId: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/job-state/:id";
        description: "Get state for scanner job with given id";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                state: zod.ZodObject<
                    {
                        status: zod.ZodString;
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        status: string;
                        message: string;
                    },
                    {
                        status: string;
                        message: string;
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                state: {
                    status: string;
                    message: string;
                };
            },
            {
                state: {
                    status: string;
                    message: string;
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/work-queue/jobs";
        description: "List all jobs in the work queue. Alias: GetWorkQueueJobs";
        alias: "GetWorkQueueJobs";
        parameters: [
            {
                name: "status";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodPipeline<
                        zod.ZodEffects<zod.ZodString, string[], string>,
                        zod.ZodArray<
                            zod.ZodEnum<
                                [
                                    "completed",
                                    "waiting",
                                    "active",
                                    "delayed",
                                    "failed",
                                    "paused",
                                ]
                            >,
                            "many"
                        >
                    >
                >;
                description: string;
            },
        ];
        response: zod.ZodArray<
            zod.ZodObject<
                {
                    id: zod.ZodString;
                    state: zod.ZodString;
                    finishedOn: zod.ZodOptional<zod.ZodDate>;
                },
                "strip",
                zod.ZodTypeAny,
                {
                    id: string;
                    state: string;
                    finishedOn?: Date | undefined;
                },
                {
                    id: string;
                    state: string;
                    finishedOn?: Date | undefined;
                }
            >,
            "many"
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/work-queue/jobs/:id";
        description: "Get details for job with given id from the work queue";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                id: zod.ZodString;
                state: zod.ZodString;
                data: zod.ZodOptional<
                    zod.ZodObject<
                        {
                            jobId: zod.ZodString;
                            options: zod.ZodOptional<
                                zod.ZodObject<
                                    {
                                        timeout: zod.ZodOptional<zod.ZodNumber>;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        timeout?: number | undefined;
                                    },
                                    {
                                        timeout?: number | undefined;
                                    }
                                >
                            >;
                            files: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        hash: zod.ZodString;
                                        path: zod.ZodString;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        path: string;
                                        hash: string;
                                    },
                                    {
                                        path: string;
                                        hash: string;
                                    }
                                >,
                                "many"
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            files: {
                                path: string;
                                hash: string;
                            }[];
                            jobId: string;
                            options?:
                                | {
                                      timeout?: number | undefined;
                                  }
                                | undefined;
                        },
                        {
                            files: {
                                path: string;
                                hash: string;
                            }[];
                            jobId: string;
                            options?:
                                | {
                                      timeout?: number | undefined;
                                  }
                                | undefined;
                        }
                    >
                >;
                finishedOn: zod.ZodOptional<zod.ZodDate>;
                result: zod.ZodOptional<
                    zod.ZodObject<
                        {
                            headers: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        tool_name: zod.ZodString;
                                        tool_version: zod.ZodString;
                                        options: zod.ZodObject<
                                            {
                                                "--copyright": zod.ZodBoolean;
                                                "--info": zod.ZodBoolean;
                                                "--json": zod.ZodOptional<zod.ZodString>;
                                                "--json-pp": zod.ZodOptional<zod.ZodString>;
                                                "--license": zod.ZodBoolean;
                                                "--license-references": zod.ZodOptional<zod.ZodBoolean>;
                                                "--package": zod.ZodOptional<zod.ZodBoolean>;
                                                "--processes": zod.ZodOptional<zod.ZodString>;
                                                "--quiet": zod.ZodOptional<zod.ZodBoolean>;
                                                "--strip-root": zod.ZodOptional<zod.ZodBoolean>;
                                            },
                                            "strip",
                                            zod.ZodTypeAny,
                                            {
                                                "--copyright": boolean;
                                                "--info": boolean;
                                                "--license": boolean;
                                                "--json"?: string | undefined;
                                                "--json-pp"?:
                                                    | string
                                                    | undefined;
                                                "--license-references"?:
                                                    | boolean
                                                    | undefined;
                                                "--package"?:
                                                    | boolean
                                                    | undefined;
                                                "--processes"?:
                                                    | string
                                                    | undefined;
                                                "--quiet"?: boolean | undefined;
                                                "--strip-root"?:
                                                    | boolean
                                                    | undefined;
                                            },
                                            {
                                                "--copyright": boolean;
                                                "--info": boolean;
                                                "--license": boolean;
                                                "--json"?: string | undefined;
                                                "--json-pp"?:
                                                    | string
                                                    | undefined;
                                                "--license-references"?:
                                                    | boolean
                                                    | undefined;
                                                "--package"?:
                                                    | boolean
                                                    | undefined;
                                                "--processes"?:
                                                    | string
                                                    | undefined;
                                                "--quiet"?: boolean | undefined;
                                                "--strip-root"?:
                                                    | boolean
                                                    | undefined;
                                            }
                                        >;
                                        notice: zod.ZodString;
                                        start_timestamp: zod.ZodString;
                                        end_timestamp: zod.ZodString;
                                        output_format_version: zod.ZodString;
                                        duration: zod.ZodNumber;
                                        message: zod.ZodNullable<zod.ZodString>;
                                        errors: zod.ZodArray<
                                            zod.ZodUnknown,
                                            "many"
                                        >;
                                        warnings: zod.ZodArray<
                                            zod.ZodUnknown,
                                            "many"
                                        >;
                                        extra_data: zod.ZodObject<
                                            {
                                                system_environment: zod.ZodObject<
                                                    {
                                                        operating_system: zod.ZodString;
                                                        cpu_architecture: zod.ZodString;
                                                        platform: zod.ZodString;
                                                        platform_version: zod.ZodString;
                                                        python_version: zod.ZodString;
                                                    },
                                                    "strip",
                                                    zod.ZodTypeAny,
                                                    {
                                                        operating_system: string;
                                                        cpu_architecture: string;
                                                        platform: string;
                                                        platform_version: string;
                                                        python_version: string;
                                                    },
                                                    {
                                                        operating_system: string;
                                                        cpu_architecture: string;
                                                        platform: string;
                                                        platform_version: string;
                                                        python_version: string;
                                                    }
                                                >;
                                                spdx_license_list_version: zod.ZodString;
                                                files_count: zod.ZodNumber;
                                            },
                                            "strip",
                                            zod.ZodTypeAny,
                                            {
                                                system_environment: {
                                                    operating_system: string;
                                                    cpu_architecture: string;
                                                    platform: string;
                                                    platform_version: string;
                                                    python_version: string;
                                                };
                                                spdx_license_list_version: string;
                                                files_count: number;
                                            },
                                            {
                                                system_environment: {
                                                    operating_system: string;
                                                    cpu_architecture: string;
                                                    platform: string;
                                                    platform_version: string;
                                                    python_version: string;
                                                };
                                                spdx_license_list_version: string;
                                                files_count: number;
                                            }
                                        >;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        message: string | null;
                                        options: {
                                            "--copyright": boolean;
                                            "--info": boolean;
                                            "--license": boolean;
                                            "--json"?: string | undefined;
                                            "--json-pp"?: string | undefined;
                                            "--license-references"?:
                                                | boolean
                                                | undefined;
                                            "--package"?: boolean | undefined;
                                            "--processes"?: string | undefined;
                                            "--quiet"?: boolean | undefined;
                                            "--strip-root"?:
                                                | boolean
                                                | undefined;
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
                                    },
                                    {
                                        message: string | null;
                                        options: {
                                            "--copyright": boolean;
                                            "--info": boolean;
                                            "--license": boolean;
                                            "--json"?: string | undefined;
                                            "--json-pp"?: string | undefined;
                                            "--license-references"?:
                                                | boolean
                                                | undefined;
                                            "--package"?: boolean | undefined;
                                            "--processes"?: string | undefined;
                                            "--quiet"?: boolean | undefined;
                                            "--strip-root"?:
                                                | boolean
                                                | undefined;
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
                                    }
                                >,
                                "many"
                            >;
                            license_references: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        key: zod.ZodString;
                                        spdx_license_key: zod.ZodString;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        key: string;
                                        spdx_license_key: string;
                                    },
                                    {
                                        key: string;
                                        spdx_license_key: string;
                                    }
                                >,
                                "many"
                            >;
                            files: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        path: zod.ZodString;
                                        type: zod.ZodString;
                                        sha256: zod.ZodNullable<zod.ZodString>;
                                        detected_license_expression: zod.ZodNullable<zod.ZodString>;
                                        detected_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                                        license_detections: zod.ZodArray<
                                            zod.ZodObject<
                                                {
                                                    license_expression: zod.ZodString;
                                                    matches: zod.ZodArray<
                                                        zod.ZodObject<
                                                            {
                                                                score: zod.ZodNumber;
                                                                start_line: zod.ZodNumber;
                                                                end_line: zod.ZodNumber;
                                                                license_expression: zod.ZodString;
                                                                spdx_license_expression: zod.ZodNullable<zod.ZodString>;
                                                            },
                                                            "strip",
                                                            zod.ZodTypeAny,
                                                            {
                                                                license_expression: string;
                                                                score: number;
                                                                start_line: number;
                                                                end_line: number;
                                                                spdx_license_expression:
                                                                    | string
                                                                    | null;
                                                            },
                                                            {
                                                                license_expression: string;
                                                                score: number;
                                                                start_line: number;
                                                                end_line: number;
                                                                spdx_license_expression:
                                                                    | string
                                                                    | null;
                                                            }
                                                        >,
                                                        "many"
                                                    >;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    license_expression: string;
                                                    matches: {
                                                        license_expression: string;
                                                        score: number;
                                                        start_line: number;
                                                        end_line: number;
                                                        spdx_license_expression:
                                                            | string
                                                            | null;
                                                    }[];
                                                },
                                                {
                                                    license_expression: string;
                                                    matches: {
                                                        license_expression: string;
                                                        score: number;
                                                        start_line: number;
                                                        end_line: number;
                                                        spdx_license_expression:
                                                            | string
                                                            | null;
                                                    }[];
                                                }
                                            >,
                                            "many"
                                        >;
                                        copyrights: zod.ZodArray<
                                            zod.ZodObject<
                                                {
                                                    copyright: zod.ZodString;
                                                    start_line: zod.ZodNumber;
                                                    end_line: zod.ZodNumber;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    start_line: number;
                                                    end_line: number;
                                                    copyright: string;
                                                },
                                                {
                                                    start_line: number;
                                                    end_line: number;
                                                    copyright: string;
                                                }
                                            >,
                                            "many"
                                        >;
                                        scan_errors: zod.ZodArray<
                                            zod.ZodString,
                                            "many"
                                        >;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        path: string;
                                        type: string;
                                        sha256: string | null;
                                        detected_license_expression:
                                            | string
                                            | null;
                                        detected_license_expression_spdx:
                                            | string
                                            | null;
                                        license_detections: {
                                            license_expression: string;
                                            matches: {
                                                license_expression: string;
                                                score: number;
                                                start_line: number;
                                                end_line: number;
                                                spdx_license_expression:
                                                    | string
                                                    | null;
                                            }[];
                                        }[];
                                        copyrights: {
                                            start_line: number;
                                            end_line: number;
                                            copyright: string;
                                        }[];
                                        scan_errors: string[];
                                    },
                                    {
                                        path: string;
                                        type: string;
                                        sha256: string | null;
                                        detected_license_expression:
                                            | string
                                            | null;
                                        detected_license_expression_spdx:
                                            | string
                                            | null;
                                        license_detections: {
                                            license_expression: string;
                                            matches: {
                                                license_expression: string;
                                                score: number;
                                                start_line: number;
                                                end_line: number;
                                                spdx_license_expression:
                                                    | string
                                                    | null;
                                            }[];
                                        }[];
                                        copyrights: {
                                            start_line: number;
                                            end_line: number;
                                            copyright: string;
                                        }[];
                                        scan_errors: string[];
                                    }
                                >,
                                "many"
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            headers: {
                                message: string | null;
                                options: {
                                    "--copyright": boolean;
                                    "--info": boolean;
                                    "--license": boolean;
                                    "--json"?: string | undefined;
                                    "--json-pp"?: string | undefined;
                                    "--license-references"?:
                                        | boolean
                                        | undefined;
                                    "--package"?: boolean | undefined;
                                    "--processes"?: string | undefined;
                                    "--quiet"?: boolean | undefined;
                                    "--strip-root"?: boolean | undefined;
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
                            license_references: {
                                key: string;
                                spdx_license_key: string;
                            }[];
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
                                        spdx_license_expression: string | null;
                                    }[];
                                }[];
                                copyrights: {
                                    start_line: number;
                                    end_line: number;
                                    copyright: string;
                                }[];
                                scan_errors: string[];
                            }[];
                        },
                        {
                            headers: {
                                message: string | null;
                                options: {
                                    "--copyright": boolean;
                                    "--info": boolean;
                                    "--license": boolean;
                                    "--json"?: string | undefined;
                                    "--json-pp"?: string | undefined;
                                    "--license-references"?:
                                        | boolean
                                        | undefined;
                                    "--package"?: boolean | undefined;
                                    "--processes"?: string | undefined;
                                    "--quiet"?: boolean | undefined;
                                    "--strip-root"?: boolean | undefined;
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
                            license_references: {
                                key: string;
                                spdx_license_key: string;
                            }[];
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
                                        spdx_license_expression: string | null;
                                    }[];
                                }[];
                                copyrights: {
                                    start_line: number;
                                    end_line: number;
                                    copyright: string;
                                }[];
                                scan_errors: string[];
                            }[];
                        }
                    >
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                id: string;
                state: string;
                data?:
                    | {
                          files: {
                              path: string;
                              hash: string;
                          }[];
                          jobId: string;
                          options?:
                              | {
                                    timeout?: number | undefined;
                                }
                              | undefined;
                      }
                    | undefined;
                finishedOn?: Date | undefined;
                result?:
                    | {
                          headers: {
                              message: string | null;
                              options: {
                                  "--copyright": boolean;
                                  "--info": boolean;
                                  "--license": boolean;
                                  "--json"?: string | undefined;
                                  "--json-pp"?: string | undefined;
                                  "--license-references"?: boolean | undefined;
                                  "--package"?: boolean | undefined;
                                  "--processes"?: string | undefined;
                                  "--quiet"?: boolean | undefined;
                                  "--strip-root"?: boolean | undefined;
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
                          license_references: {
                              key: string;
                              spdx_license_key: string;
                          }[];
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
                                      spdx_license_expression: string | null;
                                  }[];
                              }[];
                              copyrights: {
                                  start_line: number;
                                  end_line: number;
                                  copyright: string;
                              }[];
                              scan_errors: string[];
                          }[];
                      }
                    | undefined;
            },
            {
                id: string;
                state: string;
                data?:
                    | {
                          files: {
                              path: string;
                              hash: string;
                          }[];
                          jobId: string;
                          options?:
                              | {
                                    timeout?: number | undefined;
                                }
                              | undefined;
                      }
                    | undefined;
                finishedOn?: Date | undefined;
                result?:
                    | {
                          headers: {
                              message: string | null;
                              options: {
                                  "--copyright": boolean;
                                  "--info": boolean;
                                  "--license": boolean;
                                  "--json"?: string | undefined;
                                  "--json-pp"?: string | undefined;
                                  "--license-references"?: boolean | undefined;
                                  "--package"?: boolean | undefined;
                                  "--processes"?: string | undefined;
                                  "--quiet"?: boolean | undefined;
                                  "--strip-root"?: boolean | undefined;
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
                          license_references: {
                              key: string;
                              spdx_license_key: string;
                          }[];
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
                                      spdx_license_expression: string | null;
                                  }[];
                              }[];
                              copyrights: {
                                  start_line: number;
                                  end_line: number;
                                  copyright: string;
                              }[];
                              scan_errors: string[];
                          }[];
                      }
                    | undefined;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
];

declare const userAPI: [
    {
        method: "get";
        path: "/user";
        description: "Get user";
        alias: "GetUser";
        response: zod.ZodObject<
            {
                username: zod.ZodString;
                role: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                username: string;
                role: string;
            },
            {
                username: string;
                role: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/user";
        description: "Update user data (for users to update their own data)";
        alias: "PutUser";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        username: zod.ZodOptional<
                            zod.ZodEffects<
                                zod.ZodEffects<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    string,
                                    string
                                >,
                                string,
                                string
                            >
                        >;
                        password: zod.ZodOptional<
                            zod.ZodEffects<zod.ZodString, string, string>
                        >;
                        firstName: zod.ZodOptional<zod.ZodString>;
                        lastName: zod.ZodOptional<zod.ZodString>;
                        email: zod.ZodOptional<zod.ZodString>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        username?: string | undefined;
                        password?: string | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                    },
                    {
                        username?: string | undefined;
                        password?: string | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/license-conclusions";
        alias: "GetLicenseConclusions";
        description: "Get license conclusions. Alias: GetLicenseConclusions";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "contextPurl",
                            "username",
                            "detectedLicenseExpressionSPDX",
                            "concludedLicenseExpressionSPDX",
                            "comment",
                            "local",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "bulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
                description: string;
            },
            {
                name: "hasBulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                            bulkConclusionId: zod.ZodNullable<zod.ZodNumber>;
                            fileSha256: zod.ZodString;
                            contextPurl: zod.ZodString;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                            fileSha256: string;
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                            fileSha256: string;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                    fileSha256: string;
                }[];
            },
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                    fileSha256: string;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/license-conclusions/count";
        alias: "GetLicenseConclusionsCount";
        description: "Get count of license conclusions. Alias: GetLicenseConclusionsCount";
        parameters: [
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "bulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
                description: string;
            },
            {
                name: "hasBulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/license-conclusions/:id/affected-files";
        description: "Get affected files for specified license conclusion. Alias: GetAffectedFilesForLicenseConclusion";
        alias: "GetAffectedFilesForLicenseConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                affectedFiles: zod.ZodObject<
                    {
                        inContextPurl: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    package: zod.ZodObject<
                                        {
                                            purl: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                        },
                                        {
                                            purl: string;
                                        }
                                    >;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                },
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                }
                            >,
                            "many"
                        >;
                        additionalMatches: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    package: zod.ZodObject<
                                        {
                                            purl: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                        },
                                        {
                                            purl: string;
                                        }
                                    >;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                },
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                }
                            >,
                            "many"
                        >;
                        inQueryPurl: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    package: zod.ZodObject<
                                        {
                                            purl: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                        },
                                        {
                                            purl: string;
                                        }
                                    >;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                },
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                }
                            >,
                            "many"
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        inContextPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        additionalMatches: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        inQueryPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                    },
                    {
                        inContextPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        additionalMatches: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        inQueryPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                affectedFiles: {
                    inContextPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    additionalMatches: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    inQueryPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                };
            },
            {
                affectedFiles: {
                    inContextPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    additionalMatches: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    inQueryPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl/files/:sha256/license-conclusions/";
        description: "Get license conclusions for specified file in specified package. Alias: GetLicenseConclusionsForFileInPackage";
        alias: "GetLicenseConclusionsForFileInPackage";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "sha256";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            contextPurl: zod.ZodString;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                            bulkConclusionId: zod.ZodNullable<zod.ZodNumber>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                }[];
            },
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/packages/:purl/files/:sha256/license-conclusions";
        description: "Add a new license conclusion. Alias: PostLicenseConclusion";
        alias: "PostLicenseConclusion";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "sha256";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        concludedLicenseExpressionSPDX: zod.ZodUnion<
                            [
                                zod.ZodEffects<zod.ZodString, string, string>,
                                zod.ZodEnum<["NONE", "NOASSERTION"]>,
                            ]
                        >;
                        detectedLicenseExpressionSPDX: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                        comment: zod.ZodOptional<zod.ZodString>;
                        local: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        concludedLicenseExpressionSPDX: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        concludedLicenseExpressionSPDX: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusionId: zod.ZodNumber;
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                licenseConclusionId: number;
            },
            {
                message: string;
                licenseConclusionId: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/license-conclusions/:id";
        description: "Edit a license conclusion. Alias: PutLicenseConclusion";
        alias: "PutLicenseConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodEffects<
                    zod.ZodObject<
                        {
                            concludedLicenseExpressionSPDX: zod.ZodOptional<
                                zod.ZodUnion<
                                    [
                                        zod.ZodEffects<
                                            zod.ZodString,
                                            string,
                                            string
                                        >,
                                        zod.ZodEnum<["NONE", "NOASSERTION"]>,
                                    ]
                                >
                            >;
                            detectedLicenseExpressionSPDX: zod.ZodOptional<zod.ZodString>;
                            comment: zod.ZodOptional<
                                zod.ZodNullable<zod.ZodString>
                            >;
                            local: zod.ZodOptional<zod.ZodBoolean>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            concludedLicenseExpressionSPDX?: string | undefined;
                            detectedLicenseExpressionSPDX?: string | undefined;
                            comment?: string | null | undefined;
                            local?: boolean | undefined;
                        },
                        {
                            concludedLicenseExpressionSPDX?: string | undefined;
                            detectedLicenseExpressionSPDX?: string | undefined;
                            comment?: string | null | undefined;
                            local?: boolean | undefined;
                        }
                    >,
                    {
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/license-conclusions/:id";
        description: "Delete a license conclusion. Alias: DeleteLicenseConclusion";
        alias: "DeleteLicenseConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl/bulk-conclusions";
        description: "Get bulk conclusions for specified purl. Returns both bulk conclusions made in this package, and bulk conclusions made in other packages, that affect files in this package. Alias: GetBulkConclusionsByPurl";
        alias: "GetBulkConclusionsByPurl";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                bulkConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            package: zod.ZodObject<
                                {
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    purl: string;
                                },
                                {
                                    purl: string;
                                }
                            >;
                            licenseConclusions: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        id: zod.ZodNumber;
                                        file: zod.ZodObject<
                                            {
                                                sha256: zod.ZodString;
                                                filetrees: zod.ZodArray<
                                                    zod.ZodObject<
                                                        {
                                                            path: zod.ZodString;
                                                        },
                                                        "strip",
                                                        zod.ZodTypeAny,
                                                        {
                                                            path: string;
                                                        },
                                                        {
                                                            path: string;
                                                        }
                                                    >,
                                                    "many"
                                                >;
                                            },
                                            "strip",
                                            zod.ZodTypeAny,
                                            {
                                                sha256: string;
                                                filetrees: {
                                                    path: string;
                                                }[];
                                            },
                                            {
                                                sha256: string;
                                                filetrees: {
                                                    path: string;
                                                }[];
                                            }
                                        >;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        id: number;
                                        file: {
                                            sha256: string;
                                            filetrees: {
                                                path: string;
                                            }[];
                                        };
                                    },
                                    {
                                        id: number;
                                        file: {
                                            sha256: string;
                                            filetrees: {
                                                path: string;
                                            }[];
                                        };
                                    }
                                >,
                                "many"
                            >;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            licenseConclusions: {
                                id: number;
                                file: {
                                    sha256: string;
                                    filetrees: {
                                        path: string;
                                    }[];
                                };
                            }[];
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            licenseConclusions: {
                                id: number;
                                file: {
                                    sha256: string;
                                    filetrees: {
                                        path: string;
                                    }[];
                                };
                            }[];
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    licenseConclusions: {
                        id: number;
                        file: {
                            sha256: string;
                            filetrees: {
                                path: string;
                            }[];
                        };
                    }[];
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            },
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    licenseConclusions: {
                        id: number;
                        file: {
                            sha256: string;
                            filetrees: {
                                path: string;
                            }[];
                        };
                    }[];
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl/bulk-conclusions/count";
        description: "Get count of bulk conclusions for specified purl. Returns count of both bulk conclusions made in this package, and bulk conclusions made in other packages, that affect files in this package. Alias: GetBulkConclusionsCountByPurl";
        alias: "GetBulkConclusionsCountByPurl";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/packages/:purl/bulk-conclusions";
        description: "Add a new bulk conclusion. Alias: PostBulkConclusion";
        alias: "PostBulkConclusion";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodEffects<
                            zod.ZodEffects<zod.ZodString, string, string>,
                            string,
                            string
                        >;
                        concludedLicenseExpressionSPDX: zod.ZodUnion<
                            [
                                zod.ZodEffects<zod.ZodString, string, string>,
                                zod.ZodEnum<["NONE", "NOASSERTION"]>,
                            ]
                        >;
                        detectedLicenseExpressionSPDX: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                        comment: zod.ZodOptional<zod.ZodString>;
                        local: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        concludedLicenseExpressionSPDX: string;
                        pattern: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        concludedLicenseExpressionSPDX: string;
                        pattern: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                bulkConclusionId: zod.ZodNumber;
                matchedPathsCount: zod.ZodNumber;
                addedLicenseConclusionsCount: zod.ZodNumber;
                affectedFilesInPackageCount: zod.ZodNumber;
                affectedFilesAcrossAllPackagesCount: zod.ZodNumber;
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                bulkConclusionId: number;
                matchedPathsCount: number;
                addedLicenseConclusionsCount: number;
                affectedFilesInPackageCount: number;
                affectedFilesAcrossAllPackagesCount: number;
            },
            {
                message: string;
                bulkConclusionId: number;
                matchedPathsCount: number;
                addedLicenseConclusionsCount: number;
                affectedFilesInPackageCount: number;
                affectedFilesAcrossAllPackagesCount: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/bulk-conclusions";
        description: "Get bulk conclusions. Alias: GetBulkConclusions";
        alias: "GetBulkConclusions";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "pkg",
                            "username",
                            "pattern",
                            "detectedLicenseExpressionSPDX",
                            "concludedLicenseExpressionSPDX",
                            "comment",
                            "local",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                bulkConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodNullable<zod.ZodString>;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            package: zod.ZodObject<
                                {
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    purl: string;
                                },
                                {
                                    purl: string;
                                }
                            >;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            },
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/bulk-conclusions/count";
        description: "Get count of bulk conclusions. Alias: GetBulkConclusionsCount";
        alias: "GetBulkConclusionsCount";
        parameters: [
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/bulk-conclusions/:id/affected-files";
        description: "Get affected files for specified bulk conclusion. Alias: GetAffectedFilesForBulkConclusion";
        alias: "GetAffectedFilesForBulkConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                affectedFiles: zod.ZodObject<
                    {
                        inContextPurl: zod.ZodArray<zod.ZodString, "many">;
                        additionalMatches: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    purl: string;
                                },
                                {
                                    path: string;
                                    purl: string;
                                }
                            >,
                            "many"
                        >;
                        inQueryPurl: zod.ZodArray<zod.ZodString, "many">;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        inContextPurl: string[];
                        additionalMatches: {
                            path: string;
                            purl: string;
                        }[];
                        inQueryPurl: string[];
                    },
                    {
                        inContextPurl: string[];
                        additionalMatches: {
                            path: string;
                            purl: string;
                        }[];
                        inQueryPurl: string[];
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                affectedFiles: {
                    inContextPurl: string[];
                    additionalMatches: {
                        path: string;
                        purl: string;
                    }[];
                    inQueryPurl: string[];
                };
            },
            {
                affectedFiles: {
                    inContextPurl: string[];
                    additionalMatches: {
                        path: string;
                        purl: string;
                    }[];
                    inQueryPurl: string[];
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/bulk-conclusions/:id";
        description: "Get bulk conclusion by id. Alias: GetBulkConclusionById";
        alias: "GetBulkConclusionById";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                pattern: zod.ZodNullable<zod.ZodString>;
                concludedLicenseExpressionSPDX: zod.ZodString;
                detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                comment: zod.ZodNullable<zod.ZodString>;
                local: zod.ZodBoolean;
                filePaths: zod.ZodArray<zod.ZodString, "many">;
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                        },
                        {
                            id: number;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseConclusions: {
                    id: number;
                }[];
                detectedLicenseExpressionSPDX: string | null;
                concludedLicenseExpressionSPDX: string;
                comment: string | null;
                pattern: string | null;
                local: boolean;
                filePaths: string[];
            },
            {
                licenseConclusions: {
                    id: number;
                }[];
                detectedLicenseExpressionSPDX: string | null;
                concludedLicenseExpressionSPDX: string;
                comment: string | null;
                pattern: string | null;
                local: boolean;
                filePaths: string[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/bulk-conclusions/:id";
        description: "Edit bulk conclusion. Alias: PutBulkConclusion";
        alias: "PutBulkConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodOptional<
                            zod.ZodEffects<
                                zod.ZodEffects<zod.ZodString, string, string>,
                                string,
                                string
                            >
                        >;
                        concludedLicenseExpressionSPDX: zod.ZodOptional<
                            zod.ZodUnion<
                                [
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    zod.ZodEnum<["NONE", "NOASSERTION"]>,
                                ]
                            >
                        >;
                        detectedLicenseExpressionSPDX: zod.ZodOptional<zod.ZodString>;
                        comment: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                        local: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pattern?: string | undefined;
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        pattern?: string | undefined;
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/bulk-conclusions/:id";
        description: "Delete a bulk conclusion. Alias: DeleteBulkConclusion";
        alias: "DeleteBulkConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/path-exclusions";
        description: "Get path exclusions. Alias: GetPathExclusions";
        alias: "GetPathExclusions";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "pkg",
                            "pattern",
                            "reason",
                            "comment",
                            "username",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "reason";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                pathExclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodString;
                            reason: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                            package: zod.ZodObject<
                                {
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    purl: string;
                                },
                                {
                                    purl: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            },
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/path-exclusions/count";
        description: "Get count of path exclusions. Alias: GetPathExclusionsCount";
        alias: "GetPathExclusionsCount";
        parameters: [
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "reason";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/path-exclusions/:id/affected-files";
        description: "Get affected files for specified path exclusion. Alias: GetAffectedFilesForPathExclusion";
        alias: "GetAffectedFilesForPathExclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                affectedFiles: zod.ZodArray<zod.ZodString, "many">;
            },
            "strip",
            zod.ZodTypeAny,
            {
                affectedFiles: string[];
            },
            {
                affectedFiles: string[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/path-exclusions/:id";
        description: "Edit a path exclusion. Alias: PutPathExclusion";
        alias: "PutPathExclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodOptional<
                            zod.ZodEffects<
                                zod.ZodEffects<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    string,
                                    string
                                >,
                                string,
                                string
                            >
                        >;
                        reason: zod.ZodOptional<
                            zod.ZodEffects<zod.ZodString, string, string>
                        >;
                        comment: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pattern?: string | undefined;
                        reason?: string | undefined;
                        comment?: string | null | undefined;
                    },
                    {
                        pattern?: string | undefined;
                        reason?: string | undefined;
                        comment?: string | null | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/packages/:purl/path-exclusions";
        description: "Add a new path exclusion. Alias: PostPathExclusion";
        alias: "PostPathExclusion";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodEffects<
                            zod.ZodEffects<
                                zod.ZodEffects<zod.ZodString, string, string>,
                                string,
                                string
                            >,
                            string,
                            string
                        >;
                        reason: zod.ZodEffects<zod.ZodString, string, string>;
                        comment: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pattern: string;
                        reason: string;
                        comment?: string | null | undefined;
                    },
                    {
                        pattern: string;
                        reason: string;
                        comment?: string | null | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                pathExclusionId: zod.ZodNumber;
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                pathExclusionId: number;
            },
            {
                message: string;
                pathExclusionId: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/path-exclusions/:id";
        description: "Delete a path exclusion. Alias: DeletePathExclusion";
        alias: "DeletePathExclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl/path-exclusions";
        description: "Get path exclusions for specified purl. Alias: GetPathExclusionsByPurl";
        alias: "GetPathExclusionsByPurl";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                pathExclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodString;
                            reason: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                }[];
            },
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl/filetrees";
        alias: "GetFileTree";
        description: "Get file tree for specified purl. Alias: GetFileTree";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                filetrees: zod.ZodArray<
                    zod.ZodObject<
                        {
                            path: zod.ZodString;
                            packageId: zod.ZodNumber;
                            fileSha256: zod.ZodString;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            path: string;
                            fileSha256: string;
                            packageId: number;
                        },
                        {
                            path: string;
                            fileSha256: string;
                            packageId: number;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                filetrees: {
                    path: string;
                    fileSha256: string;
                    packageId: number;
                }[];
            },
            {
                filetrees: {
                    path: string;
                    fileSha256: string;
                    packageId: number;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl";
        description: "Get package information by purl. Alias: GetPackage";
        alias: "GetPackage";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                declaredLicenseSPDX: zod.ZodNullable<zod.ZodString>;
            },
            "strip",
            zod.ZodTypeAny,
            {
                declaredLicenseSPDX: string | null;
            },
            {
                declaredLicenseSPDX: string | null;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl/filetrees/:path/files";
        alias: "GetFile";
        description: "Get file sha256 and S3 download url for file in path in package. Alias: GetFile";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "path";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                sha256: zod.ZodString;
                downloadUrl: zod.ZodString;
                scanner: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                sha256: string;
                downloadUrl: string;
                scanner: string;
            },
            {
                sha256: string;
                downloadUrl: string;
                scanner: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/packages/:purl/license-findings";
        alias: "GetLicenseFindingsForPackage";
        description: "Get license findings for specified package. Alias: GetLicenseFindingsForPackage";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                licenseFindings: zod.ZodArray<
                    zod.ZodObject<
                        {
                            licenseExpressionSPDX: zod.ZodString;
                            fileSha256: zod.ZodString;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            fileSha256: string;
                            licenseExpressionSPDX: string;
                        },
                        {
                            fileSha256: string;
                            licenseExpressionSPDX: string;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseFindings: {
                    fileSha256: string;
                    licenseExpressionSPDX: string;
                }[];
            },
            {
                licenseFindings: {
                    fileSha256: string;
                    licenseExpressionSPDX: string;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/files/:sha256/license-findings";
        alias: "GetLicenseFindingsForFile";
        description: "Get license findings for specified file. Alias: GetLicenseFindingsForFile";
        parameters: [
            {
                name: "sha256";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                licenseFindings: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            createdAt: zod.ZodDate;
                            updatedAt: zod.ZodDate;
                            licenseExpressionSPDX: zod.ZodString;
                            scanner: zod.ZodString;
                            scannerConfig: zod.ZodString;
                            licenseFindingMatches: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        id: zod.ZodNumber;
                                        createdAt: zod.ZodDate;
                                        updatedAt: zod.ZodDate;
                                        licenseExpression: zod.ZodNullable<zod.ZodString>;
                                        startLine: zod.ZodNumber;
                                        endLine: zod.ZodNumber;
                                        score: zod.ZodNumber;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        score: number;
                                        id: number;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        licenseExpression: string | null;
                                        startLine: number;
                                        endLine: number;
                                    },
                                    {
                                        score: number;
                                        id: number;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        licenseExpression: string | null;
                                        startLine: number;
                                        endLine: number;
                                    }
                                >,
                                "many"
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            createdAt: Date;
                            updatedAt: Date;
                            scanner: string;
                            licenseExpressionSPDX: string;
                            scannerConfig: string;
                            licenseFindingMatches: {
                                score: number;
                                id: number;
                                createdAt: Date;
                                updatedAt: Date;
                                licenseExpression: string | null;
                                startLine: number;
                                endLine: number;
                            }[];
                        },
                        {
                            id: number;
                            createdAt: Date;
                            updatedAt: Date;
                            scanner: string;
                            licenseExpressionSPDX: string;
                            scannerConfig: string;
                            licenseFindingMatches: {
                                score: number;
                                id: number;
                                createdAt: Date;
                                updatedAt: Date;
                                licenseExpression: string | null;
                                startLine: number;
                                endLine: number;
                            }[];
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseFindings: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    scanner: string;
                    licenseExpressionSPDX: string;
                    scannerConfig: string;
                    licenseFindingMatches: {
                        score: number;
                        id: number;
                        createdAt: Date;
                        updatedAt: Date;
                        licenseExpression: string | null;
                        startLine: number;
                        endLine: number;
                    }[];
                }[];
            },
            {
                licenseFindings: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    scanner: string;
                    licenseExpressionSPDX: string;
                    scannerConfig: string;
                    licenseFindingMatches: {
                        score: number;
                        id: number;
                        createdAt: Date;
                        updatedAt: Date;
                        licenseExpression: string | null;
                        startLine: number;
                        endLine: number;
                    }[];
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
];

declare const dosAPI: [
    {
        method: "get";
        path: "/health";
        description: "Get health status of the API";
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/scan-results";
        description: string;
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodUnion<
                    [
                        zod.ZodObject<
                            {
                                purls: zod.ZodArray<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                purls: string[];
                            },
                            {
                                purls: string[];
                            }
                        >,
                        zod.ZodObject<
                            {
                                packages: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            purl: zod.ZodEffects<
                                                zod.ZodString,
                                                string,
                                                string
                                            >;
                                            declaredLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        },
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        }
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                            },
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                            }
                        >,
                    ]
                >;
            },
        ];
        response: zod.ZodObject<
            {
                purls: zod.ZodArray<
                    zod.ZodEffects<zod.ZodString, string, string>,
                    "many"
                >;
                state: zod.ZodObject<
                    {
                        status: zod.ZodEnum<["no-results", "pending", "ready"]>;
                        jobId: zod.ZodNullable<zod.ZodString>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        status: "no-results" | "pending" | "ready";
                        jobId: string | null;
                    },
                    {
                        status: "no-results" | "pending" | "ready";
                        jobId: string | null;
                    }
                >;
                results: zod.ZodUnion<
                    [
                        zod.ZodNull,
                        zod.ZodObject<
                            {
                                licenses: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            license: zod.ZodString;
                                            location: zod.ZodObject<
                                                {
                                                    path: zod.ZodString;
                                                    start_line: zod.ZodOptional<zod.ZodNumber>;
                                                    end_line: zod.ZodOptional<zod.ZodNumber>;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    path: string;
                                                    start_line?:
                                                        | number
                                                        | undefined;
                                                    end_line?:
                                                        | number
                                                        | undefined;
                                                },
                                                {
                                                    path: string;
                                                    start_line?:
                                                        | number
                                                        | undefined;
                                                    end_line?:
                                                        | number
                                                        | undefined;
                                                }
                                            >;
                                            score: zod.ZodOptional<zod.ZodNumber>;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            license: string;
                                            location: {
                                                path: string;
                                                start_line?: number | undefined;
                                                end_line?: number | undefined;
                                            };
                                            score?: number | undefined;
                                        },
                                        {
                                            license: string;
                                            location: {
                                                path: string;
                                                start_line?: number | undefined;
                                                end_line?: number | undefined;
                                            };
                                            score?: number | undefined;
                                        }
                                    >,
                                    "many"
                                >;
                                copyrights: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            statement: zod.ZodString;
                                            location: zod.ZodObject<
                                                {
                                                    path: zod.ZodString;
                                                    start_line: zod.ZodNumber;
                                                    end_line: zod.ZodNumber;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    path: string;
                                                    start_line: number;
                                                    end_line: number;
                                                },
                                                {
                                                    path: string;
                                                    start_line: number;
                                                    end_line: number;
                                                }
                                            >;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            location: {
                                                path: string;
                                                start_line: number;
                                                end_line: number;
                                            };
                                            statement: string;
                                        },
                                        {
                                            location: {
                                                path: string;
                                                start_line: number;
                                                end_line: number;
                                            };
                                            statement: string;
                                        }
                                    >,
                                    "many"
                                >;
                                issues: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            timestamp: zod.ZodDate;
                                            source: zod.ZodString;
                                            message: zod.ZodString;
                                            severity: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            message: string;
                                            timestamp: Date;
                                            source: string;
                                            severity: string;
                                        },
                                        {
                                            message: string;
                                            timestamp: Date;
                                            source: string;
                                            severity: string;
                                        }
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                copyrights: {
                                    location: {
                                        path: string;
                                        start_line: number;
                                        end_line: number;
                                    };
                                    statement: string;
                                }[];
                                licenses: {
                                    license: string;
                                    location: {
                                        path: string;
                                        start_line?: number | undefined;
                                        end_line?: number | undefined;
                                    };
                                    score?: number | undefined;
                                }[];
                                issues: {
                                    message: string;
                                    timestamp: Date;
                                    source: string;
                                    severity: string;
                                }[];
                            },
                            {
                                copyrights: {
                                    location: {
                                        path: string;
                                        start_line: number;
                                        end_line: number;
                                    };
                                    statement: string;
                                }[];
                                licenses: {
                                    license: string;
                                    location: {
                                        path: string;
                                        start_line?: number | undefined;
                                        end_line?: number | undefined;
                                    };
                                    score?: number | undefined;
                                }[];
                                issues: {
                                    message: string;
                                    timestamp: Date;
                                    source: string;
                                    severity: string;
                                }[];
                            }
                        >,
                    ]
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                purls: string[];
                state: {
                    status: "no-results" | "pending" | "ready";
                    jobId: string | null;
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
                        license: string;
                        location: {
                            path: string;
                            start_line?: number | undefined;
                            end_line?: number | undefined;
                        };
                        score?: number | undefined;
                    }[];
                    issues: {
                        message: string;
                        timestamp: Date;
                        source: string;
                        severity: string;
                    }[];
                } | null;
            },
            {
                purls: string[];
                state: {
                    status: "no-results" | "pending" | "ready";
                    jobId: string | null;
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
                        license: string;
                        location: {
                            path: string;
                            start_line?: number | undefined;
                            end_line?: number | undefined;
                        };
                        score?: number | undefined;
                    }[];
                    issues: {
                        message: string;
                        timestamp: Date;
                        source: string;
                        severity: string;
                    }[];
                } | null;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/package-configuration";
        description: "Get package configuration for specified purl";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        purl: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        purl: string;
                    },
                    {
                        purl: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            path: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            path: string;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                        },
                        {
                            path: string;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                        }
                    >,
                    "many"
                >;
                pathExclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            pattern: zod.ZodString;
                            reason: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            comment: string | null;
                            pattern: string;
                            reason: string;
                        },
                        {
                            comment: string | null;
                            pattern: string;
                            reason: string;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                pathExclusions: {
                    comment: string | null;
                    pattern: string;
                    reason: string;
                }[];
                licenseConclusions: {
                    path: string;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                }[];
            },
            {
                pathExclusions: {
                    comment: string | null;
                    pattern: string;
                    reason: string;
                }[];
                licenseConclusions: {
                    path: string;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/upload-url";
        description: "Get presigned upload URL for S3 object storage with specified object key";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        key: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        key: string;
                    },
                    {
                        key: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                success: zod.ZodBoolean;
                presignedUrl: zod.ZodOptional<zod.ZodString>;
                message: zod.ZodOptional<zod.ZodString>;
            },
            "strip",
            zod.ZodTypeAny,
            {
                success: boolean;
                presignedUrl?: string | undefined;
                message?: string | undefined;
            },
            {
                success: boolean;
                presignedUrl?: string | undefined;
                message?: string | undefined;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/job";
        description: "Add new scanner job for specified purl(s). Give multiple purls in the case where these purls are all part of the same source.";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodUnion<
                    [
                        zod.ZodObject<
                            {
                                zipFileKey: zod.ZodString;
                                purls: zod.ZodArray<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                purls: string[];
                                zipFileKey: string;
                            },
                            {
                                purls: string[];
                                zipFileKey: string;
                            }
                        >,
                        zod.ZodObject<
                            {
                                zipFileKey: zod.ZodString;
                                packages: zod.ZodArray<
                                    zod.ZodObject<
                                        {
                                            purl: zod.ZodEffects<
                                                zod.ZodString,
                                                string,
                                                string
                                            >;
                                            declaredLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        },
                                        {
                                            purl: string;
                                            declaredLicenseExpressionSPDX:
                                                | string
                                                | null;
                                        }
                                    >,
                                    "many"
                                >;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                                zipFileKey: string;
                            },
                            {
                                packages: {
                                    purl: string;
                                    declaredLicenseExpressionSPDX:
                                        | string
                                        | null;
                                }[];
                                zipFileKey: string;
                            }
                        >,
                    ]
                >;
            },
        ];
        response: zod.ZodObject<
            {
                scannerJobId: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                scannerJobId: string;
            },
            {
                scannerJobId: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/job-state/:id";
        description: "Get state for scanner job with given id";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                state: zod.ZodObject<
                    {
                        status: zod.ZodString;
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        status: string;
                        message: string;
                    },
                    {
                        status: string;
                        message: string;
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                state: {
                    status: string;
                    message: string;
                };
            },
            {
                state: {
                    status: string;
                    message: string;
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/work-queue/jobs";
        description: "List all jobs in the work queue. Alias: GetWorkQueueJobs";
        alias: "GetWorkQueueJobs";
        parameters: [
            {
                name: "status";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodPipeline<
                        zod.ZodEffects<zod.ZodString, string[], string>,
                        zod.ZodArray<
                            zod.ZodEnum<
                                [
                                    "completed",
                                    "waiting",
                                    "active",
                                    "delayed",
                                    "failed",
                                    "paused",
                                ]
                            >,
                            "many"
                        >
                    >
                >;
                description: string;
            },
        ];
        response: zod.ZodArray<
            zod.ZodObject<
                {
                    id: zod.ZodString;
                    state: zod.ZodString;
                    finishedOn: zod.ZodOptional<zod.ZodDate>;
                },
                "strip",
                zod.ZodTypeAny,
                {
                    id: string;
                    state: string;
                    finishedOn?: Date | undefined;
                },
                {
                    id: string;
                    state: string;
                    finishedOn?: Date | undefined;
                }
            >,
            "many"
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/work-queue/jobs/:id";
        description: "Get details for job with given id from the work queue";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                id: zod.ZodString;
                state: zod.ZodString;
                data: zod.ZodOptional<
                    zod.ZodObject<
                        {
                            jobId: zod.ZodString;
                            options: zod.ZodOptional<
                                zod.ZodObject<
                                    {
                                        timeout: zod.ZodOptional<zod.ZodNumber>;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        timeout?: number | undefined;
                                    },
                                    {
                                        timeout?: number | undefined;
                                    }
                                >
                            >;
                            files: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        hash: zod.ZodString;
                                        path: zod.ZodString;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        path: string;
                                        hash: string;
                                    },
                                    {
                                        path: string;
                                        hash: string;
                                    }
                                >,
                                "many"
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            files: {
                                path: string;
                                hash: string;
                            }[];
                            jobId: string;
                            options?:
                                | {
                                      timeout?: number | undefined;
                                  }
                                | undefined;
                        },
                        {
                            files: {
                                path: string;
                                hash: string;
                            }[];
                            jobId: string;
                            options?:
                                | {
                                      timeout?: number | undefined;
                                  }
                                | undefined;
                        }
                    >
                >;
                finishedOn: zod.ZodOptional<zod.ZodDate>;
                result: zod.ZodOptional<
                    zod.ZodObject<
                        {
                            headers: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        tool_name: zod.ZodString;
                                        tool_version: zod.ZodString;
                                        options: zod.ZodObject<
                                            {
                                                "--copyright": zod.ZodBoolean;
                                                "--info": zod.ZodBoolean;
                                                "--json": zod.ZodOptional<zod.ZodString>;
                                                "--json-pp": zod.ZodOptional<zod.ZodString>;
                                                "--license": zod.ZodBoolean;
                                                "--license-references": zod.ZodOptional<zod.ZodBoolean>;
                                                "--package": zod.ZodOptional<zod.ZodBoolean>;
                                                "--processes": zod.ZodOptional<zod.ZodString>;
                                                "--quiet": zod.ZodOptional<zod.ZodBoolean>;
                                                "--strip-root": zod.ZodOptional<zod.ZodBoolean>;
                                            },
                                            "strip",
                                            zod.ZodTypeAny,
                                            {
                                                "--copyright": boolean;
                                                "--info": boolean;
                                                "--license": boolean;
                                                "--json"?: string | undefined;
                                                "--json-pp"?:
                                                    | string
                                                    | undefined;
                                                "--license-references"?:
                                                    | boolean
                                                    | undefined;
                                                "--package"?:
                                                    | boolean
                                                    | undefined;
                                                "--processes"?:
                                                    | string
                                                    | undefined;
                                                "--quiet"?: boolean | undefined;
                                                "--strip-root"?:
                                                    | boolean
                                                    | undefined;
                                            },
                                            {
                                                "--copyright": boolean;
                                                "--info": boolean;
                                                "--license": boolean;
                                                "--json"?: string | undefined;
                                                "--json-pp"?:
                                                    | string
                                                    | undefined;
                                                "--license-references"?:
                                                    | boolean
                                                    | undefined;
                                                "--package"?:
                                                    | boolean
                                                    | undefined;
                                                "--processes"?:
                                                    | string
                                                    | undefined;
                                                "--quiet"?: boolean | undefined;
                                                "--strip-root"?:
                                                    | boolean
                                                    | undefined;
                                            }
                                        >;
                                        notice: zod.ZodString;
                                        start_timestamp: zod.ZodString;
                                        end_timestamp: zod.ZodString;
                                        output_format_version: zod.ZodString;
                                        duration: zod.ZodNumber;
                                        message: zod.ZodNullable<zod.ZodString>;
                                        errors: zod.ZodArray<
                                            zod.ZodUnknown,
                                            "many"
                                        >;
                                        warnings: zod.ZodArray<
                                            zod.ZodUnknown,
                                            "many"
                                        >;
                                        extra_data: zod.ZodObject<
                                            {
                                                system_environment: zod.ZodObject<
                                                    {
                                                        operating_system: zod.ZodString;
                                                        cpu_architecture: zod.ZodString;
                                                        platform: zod.ZodString;
                                                        platform_version: zod.ZodString;
                                                        python_version: zod.ZodString;
                                                    },
                                                    "strip",
                                                    zod.ZodTypeAny,
                                                    {
                                                        operating_system: string;
                                                        cpu_architecture: string;
                                                        platform: string;
                                                        platform_version: string;
                                                        python_version: string;
                                                    },
                                                    {
                                                        operating_system: string;
                                                        cpu_architecture: string;
                                                        platform: string;
                                                        platform_version: string;
                                                        python_version: string;
                                                    }
                                                >;
                                                spdx_license_list_version: zod.ZodString;
                                                files_count: zod.ZodNumber;
                                            },
                                            "strip",
                                            zod.ZodTypeAny,
                                            {
                                                system_environment: {
                                                    operating_system: string;
                                                    cpu_architecture: string;
                                                    platform: string;
                                                    platform_version: string;
                                                    python_version: string;
                                                };
                                                spdx_license_list_version: string;
                                                files_count: number;
                                            },
                                            {
                                                system_environment: {
                                                    operating_system: string;
                                                    cpu_architecture: string;
                                                    platform: string;
                                                    platform_version: string;
                                                    python_version: string;
                                                };
                                                spdx_license_list_version: string;
                                                files_count: number;
                                            }
                                        >;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        message: string | null;
                                        options: {
                                            "--copyright": boolean;
                                            "--info": boolean;
                                            "--license": boolean;
                                            "--json"?: string | undefined;
                                            "--json-pp"?: string | undefined;
                                            "--license-references"?:
                                                | boolean
                                                | undefined;
                                            "--package"?: boolean | undefined;
                                            "--processes"?: string | undefined;
                                            "--quiet"?: boolean | undefined;
                                            "--strip-root"?:
                                                | boolean
                                                | undefined;
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
                                    },
                                    {
                                        message: string | null;
                                        options: {
                                            "--copyright": boolean;
                                            "--info": boolean;
                                            "--license": boolean;
                                            "--json"?: string | undefined;
                                            "--json-pp"?: string | undefined;
                                            "--license-references"?:
                                                | boolean
                                                | undefined;
                                            "--package"?: boolean | undefined;
                                            "--processes"?: string | undefined;
                                            "--quiet"?: boolean | undefined;
                                            "--strip-root"?:
                                                | boolean
                                                | undefined;
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
                                    }
                                >,
                                "many"
                            >;
                            license_references: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        key: zod.ZodString;
                                        spdx_license_key: zod.ZodString;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        key: string;
                                        spdx_license_key: string;
                                    },
                                    {
                                        key: string;
                                        spdx_license_key: string;
                                    }
                                >,
                                "many"
                            >;
                            files: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        path: zod.ZodString;
                                        type: zod.ZodString;
                                        sha256: zod.ZodNullable<zod.ZodString>;
                                        detected_license_expression: zod.ZodNullable<zod.ZodString>;
                                        detected_license_expression_spdx: zod.ZodNullable<zod.ZodString>;
                                        license_detections: zod.ZodArray<
                                            zod.ZodObject<
                                                {
                                                    license_expression: zod.ZodString;
                                                    matches: zod.ZodArray<
                                                        zod.ZodObject<
                                                            {
                                                                score: zod.ZodNumber;
                                                                start_line: zod.ZodNumber;
                                                                end_line: zod.ZodNumber;
                                                                license_expression: zod.ZodString;
                                                                spdx_license_expression: zod.ZodNullable<zod.ZodString>;
                                                            },
                                                            "strip",
                                                            zod.ZodTypeAny,
                                                            {
                                                                license_expression: string;
                                                                score: number;
                                                                start_line: number;
                                                                end_line: number;
                                                                spdx_license_expression:
                                                                    | string
                                                                    | null;
                                                            },
                                                            {
                                                                license_expression: string;
                                                                score: number;
                                                                start_line: number;
                                                                end_line: number;
                                                                spdx_license_expression:
                                                                    | string
                                                                    | null;
                                                            }
                                                        >,
                                                        "many"
                                                    >;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    license_expression: string;
                                                    matches: {
                                                        license_expression: string;
                                                        score: number;
                                                        start_line: number;
                                                        end_line: number;
                                                        spdx_license_expression:
                                                            | string
                                                            | null;
                                                    }[];
                                                },
                                                {
                                                    license_expression: string;
                                                    matches: {
                                                        license_expression: string;
                                                        score: number;
                                                        start_line: number;
                                                        end_line: number;
                                                        spdx_license_expression:
                                                            | string
                                                            | null;
                                                    }[];
                                                }
                                            >,
                                            "many"
                                        >;
                                        copyrights: zod.ZodArray<
                                            zod.ZodObject<
                                                {
                                                    copyright: zod.ZodString;
                                                    start_line: zod.ZodNumber;
                                                    end_line: zod.ZodNumber;
                                                },
                                                "strip",
                                                zod.ZodTypeAny,
                                                {
                                                    start_line: number;
                                                    end_line: number;
                                                    copyright: string;
                                                },
                                                {
                                                    start_line: number;
                                                    end_line: number;
                                                    copyright: string;
                                                }
                                            >,
                                            "many"
                                        >;
                                        scan_errors: zod.ZodArray<
                                            zod.ZodString,
                                            "many"
                                        >;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        path: string;
                                        type: string;
                                        sha256: string | null;
                                        detected_license_expression:
                                            | string
                                            | null;
                                        detected_license_expression_spdx:
                                            | string
                                            | null;
                                        license_detections: {
                                            license_expression: string;
                                            matches: {
                                                license_expression: string;
                                                score: number;
                                                start_line: number;
                                                end_line: number;
                                                spdx_license_expression:
                                                    | string
                                                    | null;
                                            }[];
                                        }[];
                                        copyrights: {
                                            start_line: number;
                                            end_line: number;
                                            copyright: string;
                                        }[];
                                        scan_errors: string[];
                                    },
                                    {
                                        path: string;
                                        type: string;
                                        sha256: string | null;
                                        detected_license_expression:
                                            | string
                                            | null;
                                        detected_license_expression_spdx:
                                            | string
                                            | null;
                                        license_detections: {
                                            license_expression: string;
                                            matches: {
                                                license_expression: string;
                                                score: number;
                                                start_line: number;
                                                end_line: number;
                                                spdx_license_expression:
                                                    | string
                                                    | null;
                                            }[];
                                        }[];
                                        copyrights: {
                                            start_line: number;
                                            end_line: number;
                                            copyright: string;
                                        }[];
                                        scan_errors: string[];
                                    }
                                >,
                                "many"
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            headers: {
                                message: string | null;
                                options: {
                                    "--copyright": boolean;
                                    "--info": boolean;
                                    "--license": boolean;
                                    "--json"?: string | undefined;
                                    "--json-pp"?: string | undefined;
                                    "--license-references"?:
                                        | boolean
                                        | undefined;
                                    "--package"?: boolean | undefined;
                                    "--processes"?: string | undefined;
                                    "--quiet"?: boolean | undefined;
                                    "--strip-root"?: boolean | undefined;
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
                            license_references: {
                                key: string;
                                spdx_license_key: string;
                            }[];
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
                                        spdx_license_expression: string | null;
                                    }[];
                                }[];
                                copyrights: {
                                    start_line: number;
                                    end_line: number;
                                    copyright: string;
                                }[];
                                scan_errors: string[];
                            }[];
                        },
                        {
                            headers: {
                                message: string | null;
                                options: {
                                    "--copyright": boolean;
                                    "--info": boolean;
                                    "--license": boolean;
                                    "--json"?: string | undefined;
                                    "--json-pp"?: string | undefined;
                                    "--license-references"?:
                                        | boolean
                                        | undefined;
                                    "--package"?: boolean | undefined;
                                    "--processes"?: string | undefined;
                                    "--quiet"?: boolean | undefined;
                                    "--strip-root"?: boolean | undefined;
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
                            license_references: {
                                key: string;
                                spdx_license_key: string;
                            }[];
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
                                        spdx_license_expression: string | null;
                                    }[];
                                }[];
                                copyrights: {
                                    start_line: number;
                                    end_line: number;
                                    copyright: string;
                                }[];
                                scan_errors: string[];
                            }[];
                        }
                    >
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                id: string;
                state: string;
                data?:
                    | {
                          files: {
                              path: string;
                              hash: string;
                          }[];
                          jobId: string;
                          options?:
                              | {
                                    timeout?: number | undefined;
                                }
                              | undefined;
                      }
                    | undefined;
                finishedOn?: Date | undefined;
                result?:
                    | {
                          headers: {
                              message: string | null;
                              options: {
                                  "--copyright": boolean;
                                  "--info": boolean;
                                  "--license": boolean;
                                  "--json"?: string | undefined;
                                  "--json-pp"?: string | undefined;
                                  "--license-references"?: boolean | undefined;
                                  "--package"?: boolean | undefined;
                                  "--processes"?: string | undefined;
                                  "--quiet"?: boolean | undefined;
                                  "--strip-root"?: boolean | undefined;
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
                          license_references: {
                              key: string;
                              spdx_license_key: string;
                          }[];
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
                                      spdx_license_expression: string | null;
                                  }[];
                              }[];
                              copyrights: {
                                  start_line: number;
                                  end_line: number;
                                  copyright: string;
                              }[];
                              scan_errors: string[];
                          }[];
                      }
                    | undefined;
            },
            {
                id: string;
                state: string;
                data?:
                    | {
                          files: {
                              path: string;
                              hash: string;
                          }[];
                          jobId: string;
                          options?:
                              | {
                                    timeout?: number | undefined;
                                }
                              | undefined;
                      }
                    | undefined;
                finishedOn?: Date | undefined;
                result?:
                    | {
                          headers: {
                              message: string | null;
                              options: {
                                  "--copyright": boolean;
                                  "--info": boolean;
                                  "--license": boolean;
                                  "--json"?: string | undefined;
                                  "--json-pp"?: string | undefined;
                                  "--license-references"?: boolean | undefined;
                                  "--package"?: boolean | undefined;
                                  "--processes"?: string | undefined;
                                  "--quiet"?: boolean | undefined;
                                  "--strip-root"?: boolean | undefined;
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
                          license_references: {
                              key: string;
                              spdx_license_key: string;
                          }[];
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
                                      spdx_license_expression: string | null;
                                  }[];
                              }[];
                              copyrights: {
                                  start_line: number;
                                  end_line: number;
                                  copyright: string;
                              }[];
                              scan_errors: string[];
                          }[];
                      }
                    | undefined;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/user";
        description: "Get user";
        alias: "GetUser";
        response: zod.ZodObject<
            {
                username: zod.ZodString;
                role: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                username: string;
                role: string;
            },
            {
                username: string;
                role: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/user/user";
        description: "Update user data (for users to update their own data)";
        alias: "PutUser";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        username: zod.ZodOptional<
                            zod.ZodEffects<
                                zod.ZodEffects<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    string,
                                    string
                                >,
                                string,
                                string
                            >
                        >;
                        password: zod.ZodOptional<
                            zod.ZodEffects<zod.ZodString, string, string>
                        >;
                        firstName: zod.ZodOptional<zod.ZodString>;
                        lastName: zod.ZodOptional<zod.ZodString>;
                        email: zod.ZodOptional<zod.ZodString>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        username?: string | undefined;
                        password?: string | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                    },
                    {
                        username?: string | undefined;
                        password?: string | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/license-conclusions";
        alias: "GetLicenseConclusions";
        description: "Get license conclusions. Alias: GetLicenseConclusions";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "contextPurl",
                            "username",
                            "detectedLicenseExpressionSPDX",
                            "concludedLicenseExpressionSPDX",
                            "comment",
                            "local",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "bulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
                description: string;
            },
            {
                name: "hasBulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                            bulkConclusionId: zod.ZodNullable<zod.ZodNumber>;
                            fileSha256: zod.ZodString;
                            contextPurl: zod.ZodString;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                            fileSha256: string;
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                            fileSha256: string;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                    fileSha256: string;
                }[];
            },
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                    fileSha256: string;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/license-conclusions/count";
        alias: "GetLicenseConclusionsCount";
        description: "Get count of license conclusions. Alias: GetLicenseConclusionsCount";
        parameters: [
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "contextPurlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "bulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
                description: string;
            },
            {
                name: "hasBulkConclusionId";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/license-conclusions/:id/affected-files";
        description: "Get affected files for specified license conclusion. Alias: GetAffectedFilesForLicenseConclusion";
        alias: "GetAffectedFilesForLicenseConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                affectedFiles: zod.ZodObject<
                    {
                        inContextPurl: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    package: zod.ZodObject<
                                        {
                                            purl: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                        },
                                        {
                                            purl: string;
                                        }
                                    >;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                },
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                }
                            >,
                            "many"
                        >;
                        additionalMatches: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    package: zod.ZodObject<
                                        {
                                            purl: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                        },
                                        {
                                            purl: string;
                                        }
                                    >;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                },
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                }
                            >,
                            "many"
                        >;
                        inQueryPurl: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    package: zod.ZodObject<
                                        {
                                            purl: zod.ZodString;
                                        },
                                        "strip",
                                        zod.ZodTypeAny,
                                        {
                                            purl: string;
                                        },
                                        {
                                            purl: string;
                                        }
                                    >;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                },
                                {
                                    path: string;
                                    package: {
                                        purl: string;
                                    };
                                }
                            >,
                            "many"
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        inContextPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        additionalMatches: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        inQueryPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                    },
                    {
                        inContextPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        additionalMatches: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                        inQueryPurl: {
                            path: string;
                            package: {
                                purl: string;
                            };
                        }[];
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                affectedFiles: {
                    inContextPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    additionalMatches: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    inQueryPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                };
            },
            {
                affectedFiles: {
                    inContextPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    additionalMatches: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                    inQueryPurl: {
                        path: string;
                        package: {
                            purl: string;
                        };
                    }[];
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl/files/:sha256/license-conclusions";
        description: "Get license conclusions for specified file in specified package. Alias: GetLicenseConclusionsForFileInPackage";
        alias: "GetLicenseConclusionsForFileInPackage";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "sha256";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            contextPurl: zod.ZodString;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                            bulkConclusionId: zod.ZodNullable<zod.ZodNumber>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            contextPurl: string;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            bulkConclusionId: number | null;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                }[];
            },
            {
                licenseConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    contextPurl: string;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    bulkConclusionId: number | null;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/user/packages/:purl/files/:sha256/license-conclusions";
        description: "Add a new license conclusion. Alias: PostLicenseConclusion";
        alias: "PostLicenseConclusion";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "sha256";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        concludedLicenseExpressionSPDX: zod.ZodUnion<
                            [
                                zod.ZodEffects<zod.ZodString, string, string>,
                                zod.ZodEnum<["NONE", "NOASSERTION"]>,
                            ]
                        >;
                        detectedLicenseExpressionSPDX: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                        comment: zod.ZodOptional<zod.ZodString>;
                        local: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        concludedLicenseExpressionSPDX: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        concludedLicenseExpressionSPDX: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                licenseConclusionId: zod.ZodNumber;
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                licenseConclusionId: number;
            },
            {
                message: string;
                licenseConclusionId: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/user/license-conclusions/:id";
        description: "Edit a license conclusion. Alias: PutLicenseConclusion";
        alias: "PutLicenseConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodEffects<
                    zod.ZodObject<
                        {
                            concludedLicenseExpressionSPDX: zod.ZodOptional<
                                zod.ZodUnion<
                                    [
                                        zod.ZodEffects<
                                            zod.ZodString,
                                            string,
                                            string
                                        >,
                                        zod.ZodEnum<["NONE", "NOASSERTION"]>,
                                    ]
                                >
                            >;
                            detectedLicenseExpressionSPDX: zod.ZodOptional<zod.ZodString>;
                            comment: zod.ZodOptional<
                                zod.ZodNullable<zod.ZodString>
                            >;
                            local: zod.ZodOptional<zod.ZodBoolean>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            concludedLicenseExpressionSPDX?: string | undefined;
                            detectedLicenseExpressionSPDX?: string | undefined;
                            comment?: string | null | undefined;
                            local?: boolean | undefined;
                        },
                        {
                            concludedLicenseExpressionSPDX?: string | undefined;
                            detectedLicenseExpressionSPDX?: string | undefined;
                            comment?: string | null | undefined;
                            local?: boolean | undefined;
                        }
                    >,
                    {
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/user/license-conclusions/:id";
        description: "Delete a license conclusion. Alias: DeleteLicenseConclusion";
        alias: "DeleteLicenseConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl/bulk-conclusions";
        description: "Get bulk conclusions for specified purl. Returns both bulk conclusions made in this package, and bulk conclusions made in other packages, that affect files in this package. Alias: GetBulkConclusionsByPurl";
        alias: "GetBulkConclusionsByPurl";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                bulkConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            package: zod.ZodObject<
                                {
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    purl: string;
                                },
                                {
                                    purl: string;
                                }
                            >;
                            licenseConclusions: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        id: zod.ZodNumber;
                                        file: zod.ZodObject<
                                            {
                                                sha256: zod.ZodString;
                                                filetrees: zod.ZodArray<
                                                    zod.ZodObject<
                                                        {
                                                            path: zod.ZodString;
                                                        },
                                                        "strip",
                                                        zod.ZodTypeAny,
                                                        {
                                                            path: string;
                                                        },
                                                        {
                                                            path: string;
                                                        }
                                                    >,
                                                    "many"
                                                >;
                                            },
                                            "strip",
                                            zod.ZodTypeAny,
                                            {
                                                sha256: string;
                                                filetrees: {
                                                    path: string;
                                                }[];
                                            },
                                            {
                                                sha256: string;
                                                filetrees: {
                                                    path: string;
                                                }[];
                                            }
                                        >;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        id: number;
                                        file: {
                                            sha256: string;
                                            filetrees: {
                                                path: string;
                                            }[];
                                        };
                                    },
                                    {
                                        id: number;
                                        file: {
                                            sha256: string;
                                            filetrees: {
                                                path: string;
                                            }[];
                                        };
                                    }
                                >,
                                "many"
                            >;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            licenseConclusions: {
                                id: number;
                                file: {
                                    sha256: string;
                                    filetrees: {
                                        path: string;
                                    }[];
                                };
                            }[];
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            licenseConclusions: {
                                id: number;
                                file: {
                                    sha256: string;
                                    filetrees: {
                                        path: string;
                                    }[];
                                };
                            }[];
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    licenseConclusions: {
                        id: number;
                        file: {
                            sha256: string;
                            filetrees: {
                                path: string;
                            }[];
                        };
                    }[];
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            },
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    licenseConclusions: {
                        id: number;
                        file: {
                            sha256: string;
                            filetrees: {
                                path: string;
                            }[];
                        };
                    }[];
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl/bulk-conclusions/count";
        description: "Get count of bulk conclusions for specified purl. Returns count of both bulk conclusions made in this package, and bulk conclusions made in other packages, that affect files in this package. Alias: GetBulkConclusionsCountByPurl";
        alias: "GetBulkConclusionsCountByPurl";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/user/packages/:purl/bulk-conclusions";
        description: "Add a new bulk conclusion. Alias: PostBulkConclusion";
        alias: "PostBulkConclusion";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodEffects<
                            zod.ZodEffects<zod.ZodString, string, string>,
                            string,
                            string
                        >;
                        concludedLicenseExpressionSPDX: zod.ZodUnion<
                            [
                                zod.ZodEffects<zod.ZodString, string, string>,
                                zod.ZodEnum<["NONE", "NOASSERTION"]>,
                            ]
                        >;
                        detectedLicenseExpressionSPDX: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                        comment: zod.ZodOptional<zod.ZodString>;
                        local: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        concludedLicenseExpressionSPDX: string;
                        pattern: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        concludedLicenseExpressionSPDX: string;
                        pattern: string;
                        detectedLicenseExpressionSPDX?:
                            | string
                            | null
                            | undefined;
                        comment?: string | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                bulkConclusionId: zod.ZodNumber;
                matchedPathsCount: zod.ZodNumber;
                addedLicenseConclusionsCount: zod.ZodNumber;
                affectedFilesInPackageCount: zod.ZodNumber;
                affectedFilesAcrossAllPackagesCount: zod.ZodNumber;
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                bulkConclusionId: number;
                matchedPathsCount: number;
                addedLicenseConclusionsCount: number;
                affectedFilesInPackageCount: number;
                affectedFilesAcrossAllPackagesCount: number;
            },
            {
                message: string;
                bulkConclusionId: number;
                matchedPathsCount: number;
                addedLicenseConclusionsCount: number;
                affectedFilesInPackageCount: number;
                affectedFilesAcrossAllPackagesCount: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/bulk-conclusions";
        description: "Get bulk conclusions. Alias: GetBulkConclusions";
        alias: "GetBulkConclusions";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "pkg",
                            "username",
                            "pattern",
                            "detectedLicenseExpressionSPDX",
                            "concludedLicenseExpressionSPDX",
                            "comment",
                            "local",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                bulkConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodNullable<zod.ZodString>;
                            concludedLicenseExpressionSPDX: zod.ZodString;
                            detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                            comment: zod.ZodNullable<zod.ZodString>;
                            local: zod.ZodBoolean;
                            package: zod.ZodObject<
                                {
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    purl: string;
                                },
                                {
                                    purl: string;
                                }
                            >;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            detectedLicenseExpressionSPDX: string | null;
                            concludedLicenseExpressionSPDX: string;
                            comment: string | null;
                            pattern: string | null;
                            local: boolean;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            },
            {
                bulkConclusions: {
                    id: number;
                    updatedAt: Date;
                    detectedLicenseExpressionSPDX: string | null;
                    concludedLicenseExpressionSPDX: string;
                    comment: string | null;
                    pattern: string | null;
                    local: boolean;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/bulk-conclusions/count";
        description: "Get count of bulk conclusions. Alias: GetBulkConclusionsCount";
        alias: "GetBulkConclusionsCount";
        parameters: [
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "detectedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "concludedLicense";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "local";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/bulk-conclusions/:id/affected-files";
        description: "Get affected files for specified bulk conclusion. Alias: GetAffectedFilesForBulkConclusion";
        alias: "GetAffectedFilesForBulkConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                affectedFiles: zod.ZodObject<
                    {
                        inContextPurl: zod.ZodArray<zod.ZodString, "many">;
                        additionalMatches: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    path: zod.ZodString;
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    path: string;
                                    purl: string;
                                },
                                {
                                    path: string;
                                    purl: string;
                                }
                            >,
                            "many"
                        >;
                        inQueryPurl: zod.ZodArray<zod.ZodString, "many">;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        inContextPurl: string[];
                        additionalMatches: {
                            path: string;
                            purl: string;
                        }[];
                        inQueryPurl: string[];
                    },
                    {
                        inContextPurl: string[];
                        additionalMatches: {
                            path: string;
                            purl: string;
                        }[];
                        inQueryPurl: string[];
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                affectedFiles: {
                    inContextPurl: string[];
                    additionalMatches: {
                        path: string;
                        purl: string;
                    }[];
                    inQueryPurl: string[];
                };
            },
            {
                affectedFiles: {
                    inContextPurl: string[];
                    additionalMatches: {
                        path: string;
                        purl: string;
                    }[];
                    inQueryPurl: string[];
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/bulk-conclusions/:id";
        description: "Get bulk conclusion by id. Alias: GetBulkConclusionById";
        alias: "GetBulkConclusionById";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                pattern: zod.ZodNullable<zod.ZodString>;
                concludedLicenseExpressionSPDX: zod.ZodString;
                detectedLicenseExpressionSPDX: zod.ZodNullable<zod.ZodString>;
                comment: zod.ZodNullable<zod.ZodString>;
                local: zod.ZodBoolean;
                filePaths: zod.ZodArray<zod.ZodString, "many">;
                licenseConclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                        },
                        {
                            id: number;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseConclusions: {
                    id: number;
                }[];
                detectedLicenseExpressionSPDX: string | null;
                concludedLicenseExpressionSPDX: string;
                comment: string | null;
                pattern: string | null;
                local: boolean;
                filePaths: string[];
            },
            {
                licenseConclusions: {
                    id: number;
                }[];
                detectedLicenseExpressionSPDX: string | null;
                concludedLicenseExpressionSPDX: string;
                comment: string | null;
                pattern: string | null;
                local: boolean;
                filePaths: string[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/user/bulk-conclusions/:id";
        description: "Edit bulk conclusion. Alias: PutBulkConclusion";
        alias: "PutBulkConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodOptional<
                            zod.ZodEffects<
                                zod.ZodEffects<zod.ZodString, string, string>,
                                string,
                                string
                            >
                        >;
                        concludedLicenseExpressionSPDX: zod.ZodOptional<
                            zod.ZodUnion<
                                [
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    zod.ZodEnum<["NONE", "NOASSERTION"]>,
                                ]
                            >
                        >;
                        detectedLicenseExpressionSPDX: zod.ZodOptional<zod.ZodString>;
                        comment: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                        local: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pattern?: string | undefined;
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    },
                    {
                        pattern?: string | undefined;
                        concludedLicenseExpressionSPDX?: string | undefined;
                        detectedLicenseExpressionSPDX?: string | undefined;
                        comment?: string | null | undefined;
                        local?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/user/bulk-conclusions/:id";
        description: "Delete a bulk conclusion. Alias: DeleteBulkConclusion";
        alias: "DeleteBulkConclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/path-exclusions";
        description: "Get path exclusions. Alias: GetPathExclusions";
        alias: "GetPathExclusions";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "pkg",
                            "pattern",
                            "reason",
                            "comment",
                            "username",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "reason";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                pathExclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodString;
                            reason: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                            package: zod.ZodObject<
                                {
                                    purl: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    purl: string;
                                },
                                {
                                    purl: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                            package: {
                                purl: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            },
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                    package: {
                        purl: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/path-exclusions/count";
        description: "Get count of path exclusions. Alias: GetPathExclusionsCount";
        alias: "GetPathExclusionsCount";
        parameters: [
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purlStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "usernameStrict";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
                description: string;
            },
            {
                name: "pattern";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "reason";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "comment";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/path-exclusions/:id/affected-files";
        description: "Get affected files for specified path exclusion. Alias: GetAffectedFilesForPathExclusion";
        alias: "GetAffectedFilesForPathExclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                affectedFiles: zod.ZodArray<zod.ZodString, "many">;
            },
            "strip",
            zod.ZodTypeAny,
            {
                affectedFiles: string[];
            },
            {
                affectedFiles: string[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/user/path-exclusions/:id";
        description: "Edit a path exclusion. Alias: PutPathExclusion";
        alias: "PutPathExclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodOptional<
                            zod.ZodEffects<
                                zod.ZodEffects<
                                    zod.ZodEffects<
                                        zod.ZodString,
                                        string,
                                        string
                                    >,
                                    string,
                                    string
                                >,
                                string,
                                string
                            >
                        >;
                        reason: zod.ZodOptional<
                            zod.ZodEffects<zod.ZodString, string, string>
                        >;
                        comment: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pattern?: string | undefined;
                        reason?: string | undefined;
                        comment?: string | null | undefined;
                    },
                    {
                        pattern?: string | undefined;
                        reason?: string | undefined;
                        comment?: string | null | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/user/packages/:purl/path-exclusions";
        description: "Add a new path exclusion. Alias: PostPathExclusion";
        alias: "PostPathExclusion";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        pattern: zod.ZodEffects<
                            zod.ZodEffects<
                                zod.ZodEffects<zod.ZodString, string, string>,
                                string,
                                string
                            >,
                            string,
                            string
                        >;
                        reason: zod.ZodEffects<zod.ZodString, string, string>;
                        comment: zod.ZodOptional<
                            zod.ZodNullable<zod.ZodString>
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pattern: string;
                        reason: string;
                        comment?: string | null | undefined;
                    },
                    {
                        pattern: string;
                        reason: string;
                        comment?: string | null | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                pathExclusionId: zod.ZodNumber;
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                pathExclusionId: number;
            },
            {
                message: string;
                pathExclusionId: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/user/path-exclusions/:id";
        description: "Delete a path exclusion. Alias: DeletePathExclusion";
        alias: "DeletePathExclusion";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodNumber;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl/path-exclusions";
        description: "Get path exclusions for specified purl. Alias: GetPathExclusionsByPurl";
        alias: "GetPathExclusionsByPurl";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                pathExclusions: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            updatedAt: zod.ZodDate;
                            pattern: zod.ZodString;
                            reason: zod.ZodString;
                            comment: zod.ZodNullable<zod.ZodString>;
                            user: zod.ZodObject<
                                {
                                    username: zod.ZodString;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    username: string;
                                },
                                {
                                    username: string;
                                }
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                        },
                        {
                            id: number;
                            updatedAt: Date;
                            comment: string | null;
                            pattern: string;
                            reason: string;
                            user: {
                                username: string;
                            };
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                }[];
            },
            {
                pathExclusions: {
                    id: number;
                    updatedAt: Date;
                    comment: string | null;
                    pattern: string;
                    reason: string;
                    user: {
                        username: string;
                    };
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl/filetrees";
        alias: "GetFileTree";
        description: "Get file tree for specified purl. Alias: GetFileTree";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                filetrees: zod.ZodArray<
                    zod.ZodObject<
                        {
                            path: zod.ZodString;
                            packageId: zod.ZodNumber;
                            fileSha256: zod.ZodString;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            path: string;
                            fileSha256: string;
                            packageId: number;
                        },
                        {
                            path: string;
                            fileSha256: string;
                            packageId: number;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                filetrees: {
                    path: string;
                    fileSha256: string;
                    packageId: number;
                }[];
            },
            {
                filetrees: {
                    path: string;
                    fileSha256: string;
                    packageId: number;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl";
        description: "Get package information by purl. Alias: GetPackage";
        alias: "GetPackage";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                declaredLicenseSPDX: zod.ZodNullable<zod.ZodString>;
            },
            "strip",
            zod.ZodTypeAny,
            {
                declaredLicenseSPDX: string | null;
            },
            {
                declaredLicenseSPDX: string | null;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl/filetrees/:path/files";
        alias: "GetFile";
        description: "Get file sha256 and S3 download url for file in path in package. Alias: GetFile";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "path";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                sha256: zod.ZodString;
                downloadUrl: zod.ZodString;
                scanner: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                sha256: string;
                downloadUrl: string;
                scanner: string;
            },
            {
                sha256: string;
                downloadUrl: string;
                scanner: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/packages/:purl/license-findings";
        alias: "GetLicenseFindingsForPackage";
        description: "Get license findings for specified package. Alias: GetLicenseFindingsForPackage";
        parameters: [
            {
                name: "purl";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                licenseFindings: zod.ZodArray<
                    zod.ZodObject<
                        {
                            licenseExpressionSPDX: zod.ZodString;
                            fileSha256: zod.ZodString;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            fileSha256: string;
                            licenseExpressionSPDX: string;
                        },
                        {
                            fileSha256: string;
                            licenseExpressionSPDX: string;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseFindings: {
                    fileSha256: string;
                    licenseExpressionSPDX: string;
                }[];
            },
            {
                licenseFindings: {
                    fileSha256: string;
                    licenseExpressionSPDX: string;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/user/files/:sha256/license-findings";
        alias: "GetLicenseFindingsForFile";
        description: "Get license findings for specified file. Alias: GetLicenseFindingsForFile";
        parameters: [
            {
                name: "sha256";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                licenseFindings: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodNumber;
                            createdAt: zod.ZodDate;
                            updatedAt: zod.ZodDate;
                            licenseExpressionSPDX: zod.ZodString;
                            scanner: zod.ZodString;
                            scannerConfig: zod.ZodString;
                            licenseFindingMatches: zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        id: zod.ZodNumber;
                                        createdAt: zod.ZodDate;
                                        updatedAt: zod.ZodDate;
                                        licenseExpression: zod.ZodNullable<zod.ZodString>;
                                        startLine: zod.ZodNumber;
                                        endLine: zod.ZodNumber;
                                        score: zod.ZodNumber;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        score: number;
                                        id: number;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        licenseExpression: string | null;
                                        startLine: number;
                                        endLine: number;
                                    },
                                    {
                                        score: number;
                                        id: number;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        licenseExpression: string | null;
                                        startLine: number;
                                        endLine: number;
                                    }
                                >,
                                "many"
                            >;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: number;
                            createdAt: Date;
                            updatedAt: Date;
                            scanner: string;
                            licenseExpressionSPDX: string;
                            scannerConfig: string;
                            licenseFindingMatches: {
                                score: number;
                                id: number;
                                createdAt: Date;
                                updatedAt: Date;
                                licenseExpression: string | null;
                                startLine: number;
                                endLine: number;
                            }[];
                        },
                        {
                            id: number;
                            createdAt: Date;
                            updatedAt: Date;
                            scanner: string;
                            licenseExpressionSPDX: string;
                            scannerConfig: string;
                            licenseFindingMatches: {
                                score: number;
                                id: number;
                                createdAt: Date;
                                updatedAt: Date;
                                licenseExpression: string | null;
                                startLine: number;
                                endLine: number;
                            }[];
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                licenseFindings: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    scanner: string;
                    licenseExpressionSPDX: string;
                    scannerConfig: string;
                    licenseFindingMatches: {
                        score: number;
                        id: number;
                        createdAt: Date;
                        updatedAt: Date;
                        licenseExpression: string | null;
                        startLine: number;
                        endLine: number;
                    }[];
                }[];
            },
            {
                licenseFindings: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    scanner: string;
                    licenseExpressionSPDX: string;
                    scannerConfig: string;
                    licenseFindingMatches: {
                        score: number;
                        id: number;
                        createdAt: Date;
                        updatedAt: Date;
                        licenseExpression: string | null;
                        startLine: number;
                        endLine: number;
                    }[];
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/admin/scan-results";
        description: "Delete scan results and other data for specified purl. Doesn't delete files and related data if files are in other packages";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        purl: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        purl: string;
                    },
                    {
                        purl: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/admin/users";
        description: "Create user";
        alias: "CreateUser";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        username: zod.ZodEffects<
                            zod.ZodEffects<
                                zod.ZodEffects<zod.ZodString, string, string>,
                                string,
                                string
                            >,
                            string,
                            string
                        >;
                        password: zod.ZodEffects<zod.ZodString, string, string>;
                        passwordIsTemporary: zod.ZodOptional<zod.ZodBoolean>;
                        role: zod.ZodOptional<zod.ZodEnum<["ADMIN", "USER"]>>;
                        firstName: zod.ZodOptional<zod.ZodString>;
                        lastName: zod.ZodOptional<zod.ZodString>;
                        email: zod.ZodOptional<zod.ZodString>;
                        emailVerified: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        username: string;
                        password: string;
                        passwordIsTemporary?: boolean | undefined;
                        role?: "ADMIN" | "USER" | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    },
                    {
                        username: string;
                        password: string;
                        passwordIsTemporary?: boolean | undefined;
                        role?: "ADMIN" | "USER" | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                id: zod.ZodString;
                username: zod.ZodString;
                realmRoles: zod.ZodArray<zod.ZodString, "many">;
                firstName: zod.ZodOptional<zod.ZodString>;
                lastName: zod.ZodOptional<zod.ZodString>;
                email: zod.ZodOptional<zod.ZodString>;
                emailVerified: zod.ZodOptional<zod.ZodBoolean>;
                requiredActions: zod.ZodOptional<
                    zod.ZodArray<zod.ZodString, "many">
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                username: string;
                id: string;
                realmRoles: string[];
                firstName?: string | undefined;
                lastName?: string | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                requiredActions?: string[] | undefined;
            },
            {
                username: string;
                id: string;
                realmRoles: string[];
                firstName?: string | undefined;
                lastName?: string | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                requiredActions?: string[] | undefined;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/admin/users/:id";
        description: "Delete user";
        alias: "DeleteUser";
        parameters: [
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/admin/purl-cleanup";
        description: "Remove old purl bookmarks. Get detailed descriptions of options by making this query with an empty body.";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        options: zod.ZodOptional<
                            zod.ZodObject<
                                {
                                    dryRun: zod.ZodOptional<zod.ZodBoolean>;
                                    pkgNameStartsWith: zod.ZodOptional<zod.ZodString>;
                                    allPhases: zod.ZodOptional<zod.ZodBoolean>;
                                    transferPathExclusions: zod.ZodOptional<zod.ZodBoolean>;
                                    transferBulkConclusions: zod.ZodOptional<zod.ZodBoolean>;
                                    changeContextPurls: zod.ZodOptional<zod.ZodBoolean>;
                                    deleteOldPurlBookmarks: zod.ZodOptional<zod.ZodBoolean>;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    dryRun?: boolean | undefined;
                                    pkgNameStartsWith?: string | undefined;
                                    allPhases?: boolean | undefined;
                                    transferPathExclusions?:
                                        | boolean
                                        | undefined;
                                    transferBulkConclusions?:
                                        | boolean
                                        | undefined;
                                    changeContextPurls?: boolean | undefined;
                                    deleteOldPurlBookmarks?:
                                        | boolean
                                        | undefined;
                                },
                                {
                                    dryRun?: boolean | undefined;
                                    pkgNameStartsWith?: string | undefined;
                                    allPhases?: boolean | undefined;
                                    transferPathExclusions?:
                                        | boolean
                                        | undefined;
                                    transferBulkConclusions?:
                                        | boolean
                                        | undefined;
                                    changeContextPurls?: boolean | undefined;
                                    deleteOldPurlBookmarks?:
                                        | boolean
                                        | undefined;
                                }
                            >
                        >;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        options?:
                            | {
                                  dryRun?: boolean | undefined;
                                  pkgNameStartsWith?: string | undefined;
                                  allPhases?: boolean | undefined;
                                  transferPathExclusions?: boolean | undefined;
                                  transferBulkConclusions?: boolean | undefined;
                                  changeContextPurls?: boolean | undefined;
                                  deleteOldPurlBookmarks?: boolean | undefined;
                              }
                            | undefined;
                    },
                    {
                        options?:
                            | {
                                  dryRun?: boolean | undefined;
                                  pkgNameStartsWith?: string | undefined;
                                  allPhases?: boolean | undefined;
                                  transferPathExclusions?: boolean | undefined;
                                  transferBulkConclusions?: boolean | undefined;
                                  changeContextPurls?: boolean | undefined;
                                  deleteOldPurlBookmarks?: boolean | undefined;
                              }
                            | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
                optionDescriptions: zod.ZodObject<
                    {
                        dryRun: zod.ZodString;
                        pkgNameStartsWith: zod.ZodString;
                        allPhases: zod.ZodString;
                        transferPathExclusions: zod.ZodString;
                        transferBulkConclusions: zod.ZodString;
                        changeContextPurls: zod.ZodString;
                        deleteOldPurlBookmarks: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        dryRun: string;
                        pkgNameStartsWith: string;
                        allPhases: string;
                        transferPathExclusions: string;
                        transferBulkConclusions: string;
                        changeContextPurls: string;
                        deleteOldPurlBookmarks: string;
                    },
                    {
                        dryRun: string;
                        pkgNameStartsWith: string;
                        allPhases: string;
                        transferPathExclusions: string;
                        transferBulkConclusions: string;
                        changeContextPurls: string;
                        deleteOldPurlBookmarks: string;
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                optionDescriptions: {
                    dryRun: string;
                    pkgNameStartsWith: string;
                    allPhases: string;
                    transferPathExclusions: string;
                    transferBulkConclusions: string;
                    changeContextPurls: string;
                    deleteOldPurlBookmarks: string;
                };
            },
            {
                message: string;
                optionDescriptions: {
                    dryRun: string;
                    pkgNameStartsWith: string;
                    allPhases: string;
                    transferPathExclusions: string;
                    transferBulkConclusions: string;
                    changeContextPurls: string;
                    deleteOldPurlBookmarks: string;
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/admin/packages";
        description: "Get packages. Alias: GetPackages";
        alias: "GetPackages";
        parameters: [
            {
                name: "pageSize";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "pageIndex";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodNumber>;
            },
            {
                name: "sortBy";
                type: "Query";
                schema: zod.ZodOptional<
                    zod.ZodEnum<
                        [
                            "purl",
                            "name",
                            "version",
                            "type",
                            "namespace",
                            "createdAt",
                            "updatedAt",
                        ]
                    >
                >;
            },
            {
                name: "sortOrder";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodEnum<["asc", "desc"]>>;
            },
            {
                name: "name";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "namespace";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "version";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "type";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                packages: zod.ZodArray<
                    zod.ZodObject<
                        {
                            purl: zod.ZodString;
                            updatedAt: zod.ZodDate;
                            name: zod.ZodString;
                            version: zod.ZodNullable<zod.ZodString>;
                            type: zod.ZodString;
                            namespace: zod.ZodNullable<zod.ZodString>;
                            qualifiers: zod.ZodNullable<zod.ZodString>;
                            subpath: zod.ZodNullable<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            type: string;
                            purl: string;
                            name: string;
                            version: string | null;
                            namespace: string | null;
                            updatedAt: Date;
                            qualifiers: string | null;
                            subpath: string | null;
                        },
                        {
                            type: string;
                            purl: string;
                            name: string;
                            version: string | null;
                            namespace: string | null;
                            updatedAt: Date;
                            qualifiers: string | null;
                            subpath: string | null;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                packages: {
                    type: string;
                    purl: string;
                    name: string;
                    version: string | null;
                    namespace: string | null;
                    updatedAt: Date;
                    qualifiers: string | null;
                    subpath: string | null;
                }[];
            },
            {
                packages: {
                    type: string;
                    purl: string;
                    name: string;
                    version: string | null;
                    namespace: string | null;
                    updatedAt: Date;
                    qualifiers: string | null;
                    subpath: string | null;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/admin/packages/count";
        description: "Get packages count. Alias: GetPackagesCount";
        alias: "GetPackagesCount";
        parameters: [
            {
                name: "name";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "namespace";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "version";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "type";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "purl";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
                description: string;
            },
            {
                name: "createdAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "createdAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtGte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
            {
                name: "updatedAtLte";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodDate>;
                description: string;
            },
        ];
        response: zod.ZodObject<
            {
                count: zod.ZodNumber;
            },
            "strip",
            zod.ZodTypeAny,
            {
                count: number;
            },
            {
                count: number;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/admin/clearance-items/distinct-users";
        description: "Get information about the distinct users that have made clearance items";
        response: zod.ZodObject<
            {
                users: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodString;
                            username: zod.ZodOptional<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: string;
                            username?: string | undefined;
                        },
                        {
                            id: string;
                            username?: string | undefined;
                        }
                    >,
                    "many"
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                users: {
                    id: string;
                    username?: string | undefined;
                }[];
            },
            {
                users: {
                    id: string;
                    username?: string | undefined;
                }[];
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/admin/clearance-items/reassign";
        description: "Reassign clearance items to a new user ID";
        parameters: [
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        userId: zod.ZodString;
                        newUserId: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        userId: string;
                        newUserId: string;
                    },
                    {
                        userId: string;
                        newUserId: string;
                    }
                >;
            },
        ];
        response: zod.ZodObject<
            {
                message: zod.ZodString;
                counts: zod.ZodObject<
                    {
                        pathExclusions: zod.ZodNumber;
                        bulkConclusions: zod.ZodNumber;
                        licenseConclusions: zod.ZodNumber;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        pathExclusions: number;
                        bulkConclusions: number;
                        licenseConclusions: number;
                    },
                    {
                        pathExclusions: number;
                        bulkConclusions: number;
                        licenseConclusions: number;
                    }
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
                counts: {
                    pathExclusions: number;
                    bulkConclusions: number;
                    licenseConclusions: number;
                };
            },
            {
                message: string;
                counts: {
                    pathExclusions: number;
                    bulkConclusions: number;
                    licenseConclusions: number;
                };
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/auth/logout";
        description: "Logout";
        alias: "PostLogout";
        response: zod.ZodObject<
            {
                message: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                message: string;
            },
            {
                message: string;
            }
        >;
        errors: [
            {
                status: 500;
                description: "Internal server error";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                        path: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                        path?: string | null | undefined;
                    },
                    {
                        message: string;
                        path?: string | null | undefined;
                    }
                >;
            },
            {
                status: 403;
                description: "Forbidden";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 401;
                description: "Unauthorized";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
            {
                status: 404;
                description: "Not found";
                schema: zod.ZodObject<
                    {
                        message: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        message: string;
                    },
                    {
                        message: string;
                    }
                >;
            },
        ];
    },
];

declare const validReasons: {
    name: string;
    description: string;
}[];

declare const getUsernameSchema: (
    required: boolean,
) => z.ZodEffects<
    z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>,
    string,
    string
>;
declare const getPasswordSchema: (
    required: boolean,
) => z.ZodEffects<z.ZodString, string, string>;

declare const keycloakAPI: [
    {
        method: "post";
        path: "/realms/:realm/protocol/openid-connect/token";
        description: "Get auth token, refresh token, or get permissions with access token";
        alias: "PostToken";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodUnion<
                    [
                        zod.ZodObject<
                            {
                                client_id: zod.ZodString;
                                grant_type: zod.ZodLiteral<"client_credentials">;
                                client_secret: zod.ZodString;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                client_id: string;
                                grant_type: "client_credentials";
                                client_secret: string;
                            },
                            {
                                client_id: string;
                                grant_type: "client_credentials";
                                client_secret: string;
                            }
                        >,
                        zod.ZodObject<
                            {
                                client_id: zod.ZodString;
                                grant_type: zod.ZodLiteral<"refresh_token">;
                                refresh_token: zod.ZodString;
                                client_secret: zod.ZodOptional<zod.ZodString>;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                client_id: string;
                                grant_type: "refresh_token";
                                refresh_token: string;
                                client_secret?: string | undefined;
                            },
                            {
                                client_id: string;
                                grant_type: "refresh_token";
                                refresh_token: string;
                                client_secret?: string | undefined;
                            }
                        >,
                        zod.ZodObject<
                            {
                                grant_type: zod.ZodLiteral<"urn:ietf:params:oauth:grant-type:uma-ticket">;
                                audience: zod.ZodString;
                                response_mode: zod.ZodEnum<
                                    ["permissions", "decision", "token"]
                                >;
                                permission: zod.ZodOptional<zod.ZodString>;
                            },
                            "strip",
                            zod.ZodTypeAny,
                            {
                                grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket";
                                audience: string;
                                response_mode:
                                    | "permissions"
                                    | "decision"
                                    | "token";
                                permission?: string | undefined;
                            },
                            {
                                grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket";
                                audience: string;
                                response_mode:
                                    | "permissions"
                                    | "decision"
                                    | "token";
                                permission?: string | undefined;
                            }
                        >,
                    ]
                >;
            },
        ];
        response: zod.ZodUnion<
            [
                zod.ZodObject<
                    {
                        access_token: zod.ZodString;
                        expires_in: zod.ZodNumber;
                        refresh_expires_in: zod.ZodNumber;
                        refresh_token: zod.ZodString;
                        token_type: zod.ZodLiteral<"Bearer">;
                        "not-before-policy": zod.ZodNumber;
                        session_state: zod.ZodString;
                        scope: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        refresh_token: string;
                        access_token: string;
                        expires_in: number;
                        refresh_expires_in: number;
                        token_type: "Bearer";
                        "not-before-policy": number;
                        session_state: string;
                        scope: string;
                    },
                    {
                        refresh_token: string;
                        access_token: string;
                        expires_in: number;
                        refresh_expires_in: number;
                        token_type: "Bearer";
                        "not-before-policy": number;
                        session_state: string;
                        scope: string;
                    }
                >,
                zod.ZodObject<
                    {
                        access_token: zod.ZodString;
                        expires_in: zod.ZodNumber;
                        refresh_expires_in: zod.ZodNumber;
                        token_type: zod.ZodLiteral<"Bearer">;
                        "not-before-policy": zod.ZodNumber;
                        scope: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        access_token: string;
                        expires_in: number;
                        refresh_expires_in: number;
                        token_type: "Bearer";
                        "not-before-policy": number;
                        scope: string;
                    },
                    {
                        access_token: string;
                        expires_in: number;
                        refresh_expires_in: number;
                        token_type: "Bearer";
                        "not-before-policy": number;
                        scope: string;
                    }
                >,
                zod.ZodArray<
                    zod.ZodObject<
                        {
                            scopes: zod.ZodArray<zod.ZodString, "many">;
                            rsid: zod.ZodString;
                            rsname: zod.ZodString;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            scopes: string[];
                            rsid: string;
                            rsname: string;
                        },
                        {
                            scopes: string[];
                            rsid: string;
                            rsname: string;
                        }
                    >,
                    "many"
                >,
            ]
        >;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/admin/realms/:realm/users/:id/logout";
        description: "Logout user";
        alias: "LogoutUser";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodUndefined;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/admin/realms/:realm/users";
        description: "Create user";
        alias: "CreateUser";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        username: zod.ZodString;
                        credentials: zod.ZodArray<
                            zod.ZodObject<
                                {
                                    type: zod.ZodString;
                                    value: zod.ZodString;
                                    temporary: zod.ZodBoolean;
                                },
                                "strip",
                                zod.ZodTypeAny,
                                {
                                    value: string;
                                    type: string;
                                    temporary: boolean;
                                },
                                {
                                    value: string;
                                    type: string;
                                    temporary: boolean;
                                }
                            >,
                            "many"
                        >;
                        enabled: zod.ZodOptional<zod.ZodBoolean>;
                        firstName: zod.ZodOptional<zod.ZodString>;
                        lastName: zod.ZodOptional<zod.ZodString>;
                        email: zod.ZodOptional<zod.ZodString>;
                        emailVerified: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        username: string;
                        credentials: {
                            value: string;
                            type: string;
                            temporary: boolean;
                        }[];
                        enabled?: boolean | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    },
                    {
                        username: string;
                        credentials: {
                            value: string;
                            type: string;
                            temporary: boolean;
                        }[];
                        enabled?: boolean | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodUndefined;
        createUserErrors: [
            {
                status: 409;
                description: "User with this username already exists";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/admin/realms/:realm/users";
        description: "Get users";
        alias: "GetUsers";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "username";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
            },
            {
                name: "exact";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodBoolean>;
            },
            {
                name: "q";
                type: "Query";
                schema: zod.ZodOptional<zod.ZodString>;
            },
        ];
        response: zod.ZodArray<
            zod.ZodObject<
                {
                    id: zod.ZodString;
                    username: zod.ZodString;
                    firstName: zod.ZodOptional<zod.ZodString>;
                    lastName: zod.ZodOptional<zod.ZodString>;
                    email: zod.ZodOptional<zod.ZodString>;
                    requiredActions: zod.ZodOptional<
                        zod.ZodArray<zod.ZodString, "many">
                    >;
                },
                "strip",
                zod.ZodTypeAny,
                {
                    username: string;
                    id: string;
                    firstName?: string | undefined;
                    lastName?: string | undefined;
                    email?: string | undefined;
                    requiredActions?: string[] | undefined;
                },
                {
                    username: string;
                    id: string;
                    firstName?: string | undefined;
                    lastName?: string | undefined;
                    email?: string | undefined;
                    requiredActions?: string[] | undefined;
                }
            >,
            "many"
        >;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "delete";
        path: "/admin/realms/:realm/users/:id";
        description: "Delete user";
        alias: "DeleteUser";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodUndefined;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/admin/realms/:realm/roles";
        description: "Get realm roles";
        alias: "GetRealmRoles";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
        ];
        response: zod.ZodArray<
            zod.ZodObject<
                {
                    id: zod.ZodString;
                    name: zod.ZodString;
                    clientRole: zod.ZodBoolean;
                    composite: zod.ZodBoolean;
                    containerId: zod.ZodString;
                    description: zod.ZodOptional<zod.ZodString>;
                },
                "strip",
                zod.ZodTypeAny,
                {
                    id: string;
                    name: string;
                    clientRole: boolean;
                    composite: boolean;
                    containerId: string;
                    description?: string | undefined;
                },
                {
                    id: string;
                    name: string;
                    clientRole: boolean;
                    composite: boolean;
                    containerId: string;
                    description?: string | undefined;
                }
            >,
            "many"
        >;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "post";
        path: "/admin/realms/:realm/users/:id/role-mappings/realm";
        description: "Add realm role to user";
        alias: "AddRealmRoleToUser";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodArray<
                    zod.ZodObject<
                        {
                            id: zod.ZodString;
                            name: zod.ZodString;
                            clientRole: zod.ZodBoolean;
                            composite: zod.ZodBoolean;
                            containerId: zod.ZodString;
                            description: zod.ZodOptional<zod.ZodString>;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            id: string;
                            name: string;
                            clientRole: boolean;
                            composite: boolean;
                            containerId: string;
                            description?: string | undefined;
                        },
                        {
                            id: string;
                            name: string;
                            clientRole: boolean;
                            composite: boolean;
                            containerId: string;
                            description?: string | undefined;
                        }
                    >,
                    "many"
                >;
            },
        ];
        response: zod.ZodUndefined;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/admin/realms/:realm/users/:id";
        description: "Update user";
        alias: "UpdateUser";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        username: zod.ZodOptional<zod.ZodString>;
                        credentials: zod.ZodOptional<
                            zod.ZodArray<
                                zod.ZodObject<
                                    {
                                        type: zod.ZodString;
                                        value: zod.ZodString;
                                        temporary: zod.ZodBoolean;
                                    },
                                    "strip",
                                    zod.ZodTypeAny,
                                    {
                                        value: string;
                                        type: string;
                                        temporary: boolean;
                                    },
                                    {
                                        value: string;
                                        type: string;
                                        temporary: boolean;
                                    }
                                >,
                                "many"
                            >
                        >;
                        realmRoles: zod.ZodOptional<
                            zod.ZodArray<zod.ZodString, "many">
                        >;
                        enabled: zod.ZodOptional<zod.ZodBoolean>;
                        firstName: zod.ZodOptional<zod.ZodString>;
                        lastName: zod.ZodOptional<zod.ZodString>;
                        email: zod.ZodOptional<zod.ZodString>;
                        emailVerified: zod.ZodOptional<zod.ZodBoolean>;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        username?: string | undefined;
                        credentials?:
                            | {
                                  value: string;
                                  type: string;
                                  temporary: boolean;
                              }[]
                            | undefined;
                        realmRoles?: string[] | undefined;
                        enabled?: boolean | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    },
                    {
                        username?: string | undefined;
                        credentials?:
                            | {
                                  value: string;
                                  type: string;
                                  temporary: boolean;
                              }[]
                            | undefined;
                        realmRoles?: string[] | undefined;
                        enabled?: boolean | undefined;
                        firstName?: string | undefined;
                        lastName?: string | undefined;
                        email?: string | undefined;
                        emailVerified?: boolean | undefined;
                    }
                >;
            },
        ];
        response: zod.ZodUndefined;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "put";
        path: "/admin/realms/:realm/users/:id/reset-password";
        description: "Reset user password";
        alias: "ResetUserPassword";
        parameters: [
            {
                name: "realm";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "id";
                type: "Path";
                schema: zod.ZodString;
            },
            {
                name: "body";
                type: "Body";
                schema: zod.ZodObject<
                    {
                        type: zod.ZodString;
                        value: zod.ZodString;
                        temporary: zod.ZodBoolean;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        value: string;
                        type: string;
                        temporary: boolean;
                    },
                    {
                        value: string;
                        type: string;
                        temporary: boolean;
                    }
                >;
            },
        ];
        response: zod.ZodUndefined;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/admin/realms/:realm/users/:id";
        description: "Get user by ID";
        alias: "GetUserById";
        response: zod.ZodObject<
            {
                id: zod.ZodString;
                username: zod.ZodString;
                firstName: zod.ZodOptional<zod.ZodString>;
                lastName: zod.ZodOptional<zod.ZodString>;
                email: zod.ZodOptional<zod.ZodString>;
                requiredActions: zod.ZodOptional<
                    zod.ZodArray<zod.ZodString, "many">
                >;
            },
            "strip",
            zod.ZodTypeAny,
            {
                username: string;
                id: string;
                firstName?: string | undefined;
                lastName?: string | undefined;
                email?: string | undefined;
                requiredActions?: string[] | undefined;
            },
            {
                username: string;
                id: string;
                firstName?: string | undefined;
                lastName?: string | undefined;
                email?: string | undefined;
                requiredActions?: string[] | undefined;
            }
        >;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
    {
        method: "get";
        path: "/realms/:realm/protocol/openid-connect/userinfo";
        description: "Get user info";
        alias: "GetUserInfo";
        response: zod.ZodObject<
            {
                sub: zod.ZodString;
                resource_access: zod.ZodRecord<
                    zod.ZodString,
                    zod.ZodObject<
                        {
                            roles: zod.ZodArray<zod.ZodString, "many">;
                        },
                        "strip",
                        zod.ZodTypeAny,
                        {
                            roles: string[];
                        },
                        {
                            roles: string[];
                        }
                    >
                >;
                email_verified: zod.ZodBoolean;
                realm_access: zod.ZodObject<
                    {
                        roles: zod.ZodArray<zod.ZodString, "many">;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        roles: string[];
                    },
                    {
                        roles: string[];
                    }
                >;
                name: zod.ZodString;
                preferred_username: zod.ZodString;
                given_name: zod.ZodString;
                family_name: zod.ZodString;
                email: zod.ZodString;
            },
            "strip",
            zod.ZodTypeAny,
            {
                email: string;
                name: string;
                sub: string;
                resource_access: Record<
                    string,
                    {
                        roles: string[];
                    }
                >;
                email_verified: boolean;
                realm_access: {
                    roles: string[];
                };
                preferred_username: string;
                given_name: string;
                family_name: string;
            },
            {
                email: string;
                name: string;
                sub: string;
                resource_access: Record<
                    string,
                    {
                        roles: string[];
                    }
                >;
                email_verified: boolean;
                realm_access: {
                    roles: string[];
                };
                preferred_username: string;
                given_name: string;
                family_name: string;
            }
        >;
        errors: [
            {
                status: 400;
                description: "Bad request";
                schema: zod.ZodObject<
                    {
                        error: zod.ZodString;
                    },
                    "strip",
                    zod.ZodTypeAny,
                    {
                        error: string;
                    },
                    {
                        error: string;
                    }
                >;
            },
        ];
    },
];

declare const TokenResponse: z.ZodObject<
    {
        access_token: z.ZodString;
        expires_in: z.ZodNumber;
        refresh_expires_in: z.ZodNumber;
        refresh_token: z.ZodString;
        token_type: z.ZodLiteral<"Bearer">;
        "not-before-policy": z.ZodNumber;
        session_state: z.ZodString;
        scope: z.ZodString;
    },
    "strip",
    z.ZodTypeAny,
    {
        refresh_token: string;
        access_token: string;
        expires_in: number;
        refresh_expires_in: number;
        token_type: "Bearer";
        "not-before-policy": number;
        session_state: string;
        scope: string;
    },
    {
        refresh_token: string;
        access_token: string;
        expires_in: number;
        refresh_expires_in: number;
        token_type: "Bearer";
        "not-before-policy": number;
        session_state: string;
        scope: string;
    }
>;
declare const ClientCredentialsTokenResponse: z.ZodObject<
    {
        access_token: z.ZodString;
        expires_in: z.ZodNumber;
        refresh_expires_in: z.ZodNumber;
        token_type: z.ZodLiteral<"Bearer">;
        "not-before-policy": z.ZodNumber;
        scope: z.ZodString;
    },
    "strip",
    z.ZodTypeAny,
    {
        access_token: string;
        expires_in: number;
        refresh_expires_in: number;
        token_type: "Bearer";
        "not-before-policy": number;
        scope: string;
    },
    {
        access_token: string;
        expires_in: number;
        refresh_expires_in: number;
        token_type: "Bearer";
        "not-before-policy": number;
        scope: string;
    }
>;
declare const PermissionResponse: z.ZodArray<
    z.ZodObject<
        {
            scopes: z.ZodArray<z.ZodString, "many">;
            rsid: z.ZodString;
            rsname: z.ZodString;
        },
        "strip",
        z.ZodTypeAny,
        {
            scopes: string[];
            rsid: string;
            rsname: string;
        },
        {
            scopes: string[];
            rsid: string;
            rsname: string;
        }
    >,
    "many"
>;
type Token = z.infer<typeof TokenResponse>;
type ClientCredentialsToken = z.infer<typeof ClientCredentialsTokenResponse>;
type Permissions = z.infer<typeof PermissionResponse>;

declare const bcPatternGlobSchema: z.ZodEffects<
    z.ZodEffects<z.ZodString, string, string>,
    string,
    string
>;
declare const pePatternGlobSchema: z.ZodEffects<
    z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>,
    string,
    string
>;

export {
    type ClientCredentialsToken,
    type Permissions,
    type ScannerJobResultType,
    type Token,
    adminAPI,
    authAPI,
    bcPatternGlobSchema,
    dosAPI,
    getPasswordSchema,
    getUsernameSchema,
    keycloakAPI,
    pePatternGlobSchema,
    scannerAPI,
    userAPI,
    validReasons,
};
