// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import s3OperationsTestSuite from "./suites/s3Operations.spec";

describe("Subject", function () {
  describe("Testing router", s3OperationsTestSuite.bind(this));
});
