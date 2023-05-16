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

app.listen(PORT, () =>
  console.log(`Scanner Agent server listening on port ${PORT}`),
);