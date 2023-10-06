// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from '@zodios/core';
import * as schemas from '../schemas/guest_schemas';
import { errors } from '../errors';

export const guestAPI = makeApi([
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
		path: '/file',
		alias: 'GetFileData',
		description: 'Get file download url and findings',
        immutable: true,
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: schemas.PostFileReq
			}
		],
		response: schemas.PostFileRes,
		errors
	}
]);