// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/server';

chai.use(chaiHttp);

export default function suite() {
	it('1+2 should equal 3', function () {
		const result: number = 1 + 2;
		assert.strictEqual(result, 3);
	});

	it('should return status code 201 if directory is provided', done => {
		chai
		.request(app)
		.post('/api/job')
		.send({ directory: 'test1' })
		.end((err, res) => {
			expect(res).to.have.status(201);
			done();
		})
	})
}