// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { assert } from "chai";
import { formatDateString } from "../../src/helpers/date_helpers";

export default function suite(): void {
  it("formatDateString function should return string in correct format", function () {
    assert.strictEqual(
      formatDateString("2023-05-30T101636.883202"),
      "2023-05-30T10:16:36.883202",
    );
  });
}
