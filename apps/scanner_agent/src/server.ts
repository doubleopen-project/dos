// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express from 'express';
import router from './routes/router';
import Queue from 'bull';

const app = express();

// Serve on PORT on Heroku and on localhost:5001 locally
const PORT = process.env.PORT || 5001;

// Connect to a local redis intance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Create / Connect to a named work queue
let workQueue = new Queue('work', REDIS_URL);

app.use('/', router);

// Listen to global events to get notified when jobs are processed
workQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result}`);
});

app.listen(PORT, () =>
  console.log(`Scanner Agent server listening on port ${PORT}`),
);