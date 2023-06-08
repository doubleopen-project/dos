// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import router from "../../src/routes/router";

chai.use(chaiHttp);

export default function suite(): void {
   it('1+2 should equal 3', function() {
     const result: number = 1 + 2;
     assert.strictEqual(result, 3);
   });

   it('GET / should return 200', done => {
      chai
          .request(router)
          .get('/')
          .end((err, res) => {
              expect(res).to.have.status(200);
              done();
          }
      );
  });

}