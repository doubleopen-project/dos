// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express, { Application } from 'express';
import router from './routes/router';
import Queue from 'bull';

const app: Application = express();

// Serve on PORT on Heroku and on localhost:5001 locally
const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 5001;

// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL: string = process.env.REDIS_URL? process.env.REDIS_URL :  'redis://127.0.0.1:6379';

// Create / Connect to a named work queue
const workQueue: Queue.Queue = new Queue("scanner", REDIS_URL);

app.use('/', router);

app.listen(PORT, () =>
  console.log(`Scanner Agent server listening on port ${PORT}`),
);