// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import routerTestSuite from "./suites/router.spec";

describe("Running API tests", function () {
    describe("Testing router", routerTestSuite.bind(this));
});
