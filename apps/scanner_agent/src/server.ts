// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express, { Application } from 'express';
import router from './routes/router';

const app: Application = express();

app.use('/', router);

const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 5001;

app.listen(PORT, () =>
  console.log(`Scanner Agent server listening on port ${PORT}`),
);