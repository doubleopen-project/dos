// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { assert } from 'chai';

export default function suite(): void {
   it('1+2 should equal 3', function() {
     const result: number = 1 + 2;
     assert.strictEqual(result, 3);
   });

   it('1+2 should equal 3', function() {
    const result: number = 1 + 2;
    assert.strictEqual(result, 3);
  });
}