// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express from 'express';
import router from './routes/router';

const app = express();

app.use('/', router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`),
);