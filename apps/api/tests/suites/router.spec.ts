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

/*
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/server';


export default function suite() {
	it('should return status code 201 if directory is provided', async () => {
		const res = await request(app)
			.post('/api/job')
			.send({ directory: 'test1' });

		expect(res.statusCode).to.equal(201)
	})
}*/