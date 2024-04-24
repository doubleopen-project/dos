// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { expect } from "chai";
import superagent from "superagent";
import {
    createRequestResults,
    createRequestState,
} from "../../src/routes/router";
import app from "../../src/server";

const serverToken = process.env.SA_API_TOKEN || "token";

export default function suite(): void {
    it("GET / should return 200 and respond properly", (done) => {
        superagent
            .get(`http://localhost:${process.env.PORT || 5001}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal({
                    message: "Scanner Agent is up and listening!",
                });
                done();
            });

        app.removeAllListeners();
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
            Authorization: "Bearer " + serverToken,
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
            Authorization: "Bearer " + serverToken,
        });
        expect(requestInit.body).to.equal(
            JSON.stringify({ id, result: "scanresult" }),
        );
    });
}
