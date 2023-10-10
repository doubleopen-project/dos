// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi, mergeApis } from '@zodios/core';
import { adminAPI } from './apis/admin';
import { authAPI } from './apis/auth';
import { scannerAPI } from './apis/scanner';
import { userAPI } from './apis/user';

export const dosAPI = mergeApis({
    '/admin': adminAPI,
    '/auth': authAPI,
    '': scannerAPI,
    '/user': userAPI
});