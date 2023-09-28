// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi, makeErrors } from '@zodios/core';
import * as schemas from './schemas/api_schemas';

const errors = makeErrors([
	{
		status: 500,
		description: 'Internal server error',
		schema: schemas.ErrorSchema
	},
	{
		status: 400,
		description: 'Bad request',
		schema: schemas.ErrorSchema
	},
	{
		status: 403,
		description: 'Token is invalid',
		schema: schemas.ErrorSchema
	},
	{
		status: 401,
		description: 'No token provided',
		schema: schemas.ErrorSchema
	}
]);

export const dosApi = makeApi([
	{
		method: 'post',
		path: '/scan-results',
		description: 'Get scan results for specified purl',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostScanResultsReq
			}
		],
		response: schemas.PostScanResultsRes,
		errors
	},
	{
		method: 'delete',
		path: '/scan-results',
		description: 'Delete scan results for specified purl',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.DeleteScanResultsReq
			}
		],
		response: schemas.DeleteScanResultsRes,
		errors
	},
	{
		method: 'post',
		path: '/upload-url',
		description: 'Get presigned upload URL for S3 object storage with specified object key',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostUploadUrlReq
			}
		],
		response: schemas.PostUploadUrlRes,
		errors
	},
	{
		method: 'post',
		path: '/job',
		description: 'Add scanner job for package',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostJobReq
			}
		],
		response: schemas.PostJobRes,
		errors
	},
	{
		method: 'get',
		path: '/job-state/:id',
		description: 'Get state for scanner job with given id',
		parameters: [
			{
				name: 'id',
				type: 'Path',
				schema: schemas.GetJobStateReq
			}
		],
		response: schemas.GetJobStateRes,
		errors
	},
	{
		method: 'put',
		path: '/job-state/:id',
		description: 'Edit scanner job state',
		parameters: [
			{
				name: 'id',
				type: 'Path',
				schema: schemas.PutJobStateReqPathParams
			},
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PutJobStateReq
			}
		],
		response: schemas.PutJobStateRes,
		errors
	},
	{
		method: 'post',
		path: '/job-results',
		description: 'Save scanner job results',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostJobResultsReq
			}
		],
		response: schemas.PostJobResultsRes,
		errors
	},
	{
		method: 'post',
		path: '/user',
		description: 'Add user',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostUserReq
			}
		],
		response: schemas.PostUserRes,
		errors
	},
	{
		method: 'delete',
		path: '/user',
		description: 'Delete user',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.DeleteUserReq
			}
		],
		response: schemas.DeleteUserRes,
		errors
	},
	{
		method: 'post',
		path: '/license-conclusion',
		description: 'Add a new license conclusion',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostLicenseConclusionReq
			}
		],
		response: schemas.PostLicenseConclusionRes,
		errors
	},
	{
		method: 'put',
		path: '/license-conclusion/:id',
		description: 'Update a license conclusion',
		parameters: [
			{
				name: 'id',
				type: 'Path',
				schema: schemas.PutLicenseConclusionReqPathParams
			},
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PutLicenseConclusionReq
			}
		],
		response: schemas.PutLicenseConclusionRes,
		errors
	},
	{
		method: 'delete',
		path: '/license-conclusion/:id',
		description: 'Delete a license conclusion',
		parameters: [
			{
				name: 'id',
				type: 'Path',
				schema: schemas.DeleteLicenseConclusionReqPathParams
			}
		],
		response: schemas.DeleteLicenseConclusionRes,
		errors
	},
	{
		method: 'post',
		path: '/filetree',
		alias: 'GetFileTree',
		description: 'Get file tree for specified purl',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostFileTreeReq
			}
		],
		response: schemas.PostFileTreeRes,
		errors
	},
	{
		method: 'get',
		path: '/packages',
		description: 'Get packages',
		response: schemas.GetPackagesRes,
		errors
	},
	{
		method: 'post',
		path: '/login/password',
		description: 'Login with password',
		alias: 'PostLoginPassword',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostLoginPasswordReq
			}
		],
		response: schemas.PostLoginPasswordRes,
		errors
	},
	{
		method: 'post',
		path: '/logout',
		description: 'Logout',
		response: schemas.PostLogoutRes,
		errors
	},
]);