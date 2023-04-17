// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express, { Application } from 'express';
import router from './routes/router';

const app: Application = express();

app.use('/', router);

const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 5000;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`),
);