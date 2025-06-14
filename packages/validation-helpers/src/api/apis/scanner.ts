// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import { errors } from "../errors";
import * as commonSchemas from "../schemas/common_schemas";
import * as schemas from "../schemas/scanner_schemas";

export const scannerAPI = makeApi([
    {
        method: "get",
        path: "/health",
        description: "Get health status of the API",
        response: schemas.GetHealthRes,
        errors,
    },
    {
        method: "post",
        path: "/scan-results",
        description:
            "Get scan results for specified purl(s). Give multiple purls in the case where these purls are all part of the same source." +
            " If only some of the purls are found in the database, bookmarks for the remaining ones will be made pointing to the same source files.",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostScanResultsReq,
            },
        ],
        response: schemas.PostScanResultsRes,
        errors,
    },
    {
        method: "post",
        path: "/package-configuration",
        description: "Get package configuration for specified purl",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostPackageConfigurationReq,
            },
        ],
        response: schemas.PostPackageConfigurationRes,
        errors,
    },
    {
        method: "post",
        path: "/upload-url",
        description:
            "Get presigned upload URL for S3 object storage with specified object key",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostUploadUrlReq,
            },
        ],
        response: schemas.PostUploadUrlRes,
        errors,
    },
    {
        method: "post",
        path: "/job",
        description:
            "Add new scanner job for specified purl(s). Give multiple purls in the case where these purls are all part of the same source.",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: schemas.PostJobReq,
            },
        ],
        response: schemas.PostJobRes,
        errors,
    },
    {
        method: "get",
        path: "/job-state/:id",
        description: "Get state for scanner job with given id",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: schemas.GetJobStateReq,
            },
        ],
        response: schemas.GetJobStateRes,
        errors,
    },
    {
        method: "get",
        path: "/work-queue/jobs",
        description: "List all jobs in the work queue. Alias: GetWorkQueueJobs",
        alias: "GetWorkQueueJobs",
        parameters: [
            {
                name: "status",
                type: "Query",
                schema: schemas.QueryParamWorkQueueJobsStatus,
                description:
                    "Filter jobs by status. Separate multiple statuses with comma.",
            },
        ],
        response: schemas.GetWorkQueueJobsRes,
        errors,
    },
    {
        method: "get",
        path: "/work-queue/jobs/:id",
        description: "Get details for job with given id from the work queue",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: commonSchemas.PathParamUuid,
            },
        ],
        response: schemas.GetWorkQueueJobDetailsRes,
        errors,
    },
]);
