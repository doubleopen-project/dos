// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import nock from "nock";
import app from "../../src/server";
import { loadEnv } from "common-helpers";
import {
    createRequestState,
    createRequestResults,
} from "../../src/routes/router";

chai.use(chaiHttp);
loadEnv("../../.env");

export default function suite(): void {
    it("GET / should return 200 and respond properly", (done) => {
        // Define the mock response
        const mockResponse = { message: "Scanner Agent is up and listening!" };

        // Intercept the HTTP request and respond with the mock response
        nock("http://localhost:5000").get("/").reply(200, mockResponse);

        // Make the HTTP request using chai-http
        chai.request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal(mockResponse);
                done();
            });
    });

    it("createRequestState() should return a valid RequestInit object", () => {
        // Define the input parameters
        const state = "completed";

        // Call the function to create the RequestInit object
        const requestInit = createRequestState(state);

        // Assert that the RequestInit object has the correct properties and values
        expect(requestInit.method).to.equal("PUT");
        expect(requestInit.headers).to.deep.equal({
            "Content-Type": "application/json",
            Charset: "utf-8",
            Authorization: "Bearer " + process.env.SERVER_TOKEN,
        });
        expect(requestInit.body).to.equal(JSON.stringify({ state }));
    });

    it("createRequestResults() should return a valid RequestInit object with a non-empty result", () => {
        // Define the input parameters
        const id = "12345";
        const result = '{"result": "scanresult"}';

        // Call the function to create the RequestInit object
        const requestInit = createRequestResults(id, result);

        // Assert that the RequestInit object has the correct properties and values
        expect(requestInit.method).to.equal("POST");
        expect(requestInit.headers).to.deep.equal({
            "Content-Type": "application/json",
            Charset: "utf-8",
            Authorization: "Bearer " + process.env.SERVER_TOKEN,
        });
        expect(requestInit.body).to.equal(
            JSON.stringify({ id, result: "scanresult" }),
        );
    });
}
