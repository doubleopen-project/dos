// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeErrors } from '@zodios/core';
import { ErrorSchema } from './schemas/error_schemas';

export const errors = makeErrors([
	{
		status: 500,
		description: 'Internal server error',
		schema: ErrorSchema
	},
	{
		status: 400,
		description: 'Bad request',
		schema: ErrorSchema
	},
	{
		status: 403,
		description: 'Token is invalid',
		schema: ErrorSchema
	},
	{
		status: 401,
		description: 'No token provided',
		schema: ErrorSchema
	}
]);