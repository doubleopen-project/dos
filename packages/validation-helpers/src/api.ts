// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from '@zodios/core';
import * as schemas from './schemas/api_schemas';

export const dosApi = makeApi([
  {
    method: 'post',
    path: '/scan-results',
    description: 'Get scan results',
    parameters: [
        {
            name: 'body',
            type: 'Body',
            schema: schemas.ApiPostScanResultsRequestBodySchema
        }
    ],
    response: schemas.ApiPostScanResultsResponseBodySchema,
    errors: [
      {
        status: 500,
        description: 'Internal server error',
        schema: schemas.ErrorSchema
      },
      {
        status: 400,
        description: 'Bad request',
        schema: schemas.ErrorSchema
      }
    ]
  },
  {
    method: 'post',
    path: '/upload-url',
    description: 'Get presigned upload url for S3 object storage',
    parameters: [
        {
            name: 'body',
            type: 'Body',
            schema: schemas.ApiPostUploadUrlRequestBodySchema
        }
    ],
    response: schemas.ApiPostUploadUrlResponseBodySchema,
    errors: [
      {
        status: 500,
        description: 'Internal server error',
        schema: schemas.ErrorSchema
      },
      {
        status: 400,
        description: 'Bad request',
        schema: schemas.ErrorSchema
      }
    ]
  },
  {
    method: 'post',
    path: '/job',
    description: 'Add scanner job',
    parameters: [
        {
            name: 'body',
            type: 'Body',
            schema: schemas.ApiPostJobRequestBodySchema
        }
    ],
    response: schemas.ApiPostJobResponseBodySchema,
    errors: [
      {
        status: 500,
        description: 'Internal server error',
        schema: schemas.ErrorSchema
      },
      {
        status: 400,
        description: 'Bad request',
        schema: schemas.ErrorSchema
      }
    ]
  },
  {
    method: 'put',
    path: '/job-state',
    description: 'Edit Scanner Job state',
    parameters: [
        {
            name: 'body',
            type: 'Body',
            schema: schemas.ApiPutJobStateRequestBodySchema
        }
    ],
    response: schemas.ApiPutJobStateResponseBodySchema,
    errors: [
      {
        status: 500,
        description: 'Internal server error',
        schema: schemas.ErrorSchema
      },
      {
        status: 400,
        description: 'Bad request',
        schema: schemas.ErrorSchema
      }
    ]
  },
  {
    method: 'post',
    path: '/job-results',
    description: 'Save Scanner Job results',
    parameters: [
        {
            name: 'body',
            type: 'Body',
            schema: schemas.ApiPostJobResultsRequestBodySchema
        }
    ],
    response: schemas.ApiPostJobResultsResponseBodySchema,
    errors: [
      {
        status: 500,
        description: 'Internal server error',
        schema: schemas.ErrorSchema
      },
      {
        status: 400,
        description: 'Bad request',
        schema: schemas.ErrorSchema
      }
    ]
  },
]);