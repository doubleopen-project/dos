// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import app from "../../src/server";

chai.use(chaiHttp);

export default function suite(): void {

    it('GET / should return 200 and respond properly', done => {

        // Define the mock response
        const mockResponse = { message: "Scanner Agent is up and listening!" };

        // Intercept the HTTP request and respond with the mock response
        nock('http://localhost:5000')
            .get("/")
            .reply(200, mockResponse);

        // Make the HTTP request using chai-http
        chai
            .request(app)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal(mockResponse);
                done();
            });
    });

    it('POST /job should add a new job to the work queue and respond properly', async () => {
            
        // Define the mock request body and response

        const mockRequestBody = {
            directory: "/home/user/test",
            opts: {
                jobId: "1234567890"
            }
        };

        const mockResponse = {
            id: "1234567890",
            data: {
                directory: "/home/user/test",
            }
        };

        // Intercept the HTTP request and respond with the mock response
        nock('http://localhost:5000')
            .post("/job", mockRequestBody)
            .reply(201, mockResponse);

        // Make the HTTP request using chai-http
        const res = await chai
            .request(app)
            .post('/job')
            .send({
                directory: "/home/user/test",
                opts: {
                    jobId: "1234567890"
                }
            });

        expect(res).to.have.status(201);
        expect(res.body).to.deep.equal(mockResponse);
    });

}