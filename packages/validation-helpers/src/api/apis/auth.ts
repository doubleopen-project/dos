// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from '@zodios/core';
import * as schemas from '../schemas/auth_schemas';
import { errors } from '../errors';

export const authAPI = makeApi([
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