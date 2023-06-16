// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

// Below causing error RangeError: Maximum call stack size exceeded 
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
}