// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from '@zodios/core';
import * as schemas from '../schemas/api/user_schemas';
import { errors } from './errors';

export const userAPI = makeApi([
	{
		method: 'get',
		path: '/user',
		description: 'Get user',
		alias: 'GetUser',
		response: schemas.GetUserRes,
		errors
	},
]);