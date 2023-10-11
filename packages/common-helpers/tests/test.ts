// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import compressionHelperTestSuite from "./suites/compressionHelper.spec";

describe("Subject", function () {
    describe(
        "common-helpers/compressionHelper",
        compressionHelperTestSuite.bind(this),
    );
});
