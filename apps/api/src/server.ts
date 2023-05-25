// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosApp } from "@zodios/express";
import router from './routes/router';

const app = zodiosApp();

app.use('/api', router);

const PORT = process.env.PORT? parseInt(process.env.PORT) : 5000;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`),
);