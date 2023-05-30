// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosApp } from "@zodios/express";
import router from './routes/router';
import express from "express";
import { dosApi } from "validation-helpers";
import { serve, setup } from 'swagger-ui-express';
import { openApiBuilder } from "@zodios/openapi";

const opts = {
    enableJsonBodyParser : false
}
const app = zodiosApp(dosApi, opts);

app.use(express.json({limit: '50mb'}));

app.use('/api', router);

const document = openApiBuilder({
  title: "DOS API",
  version: "1.0.0",
  description: "API reference for Double Open Server",
})
  // you can declare as many security servers as you want
  .addServer({ url: "/api" })
  // you can declare as many apis as you want
  .addPublicApi(dosApi)
  .build();

app.use(`/docs/swagger.json`, (_, res) => res.json(document));
app.use("/docs", serve);
app.use("/docs", setup(undefined, { swaggerUrl: "/docs/swagger.json" }));

const PORT = process.env.PORT? parseInt(process.env.PORT) : 5000;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`),
);