// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import helpersTestSuite from "./suites/helpers.spec";
import routerTestSuite from "./suites/router.spec";

describe("Running API tests", function () {
    describe("Testing router", routerTestSuite.bind(this));
});

describe("Running API helpers tests", function () {
    describe("Testing helpers", helpersTestSuite.bind(this));
});
