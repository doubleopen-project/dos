// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import routerTestSuite from './suites/router.spec';
import dateHelpersTestSuite from './suites/date_helpers.spec';
//import { loadEnv } from 'common-helpers';

//loadEnv('../../../.env');
console.log(process.env.SPACES_ENDPOINT);


describe('Running API tests', function () {
    describe('Testing router', routerTestSuite.bind(this));
    describe('Testing date_helpers', dateHelpersTestSuite.bind(this));
});