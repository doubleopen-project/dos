// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express, { Application } from 'express';
import router from './routes/router';
import { listObjects, listBuckets, uploadFile, downloadDirectory } from 's3-helpers';

const app: Application = express();

// Serve on PORT on Heroku and on localhost:5001 locally
const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 5001;

app.use('/', router);

// Test the S3 operations
(async () => {
//    console.log("Testing S3 operations");
//    console.log(await listBuckets());
//    console.log(await listObjects("doubleopen2"));
//    console.log(await uploadFile("doubleopen2", "test.txt", "Hello World!"));
//    console.log(await downloadDirectory("doubleopen2", "test1"));
})();

app.listen(PORT, () =>
  console.log(`Scanner Agent server listening on port ${PORT}`),
);