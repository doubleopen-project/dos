// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosApp } from "@zodios/express";
import router from './routes/router';
import express from 'express';
import { scannerAgentApi } from "validation-helpers";
import { serve, setup } from 'swagger-ui-express';
import { openApiBuilder } from "@zodios/openapi";
import compression from "compression";
import { loadEnv } from 'common-helpers';

loadEnv("../../.env");

const COMPRESSION_LIMIT: number = process.env.SIZE_LIMIT_FOR_COMPRESSION? parseInt(process.env.SIZE_LIMIT_FOR_COMPRESSION) : 0;

const opts = {
  enableJsonBodyParser: false
}

const app = zodiosApp(scannerAgentApi, opts);

app.use(express.json({limit: '50mb'}));
app.use(compression({
    level: -1, // Default compression level
    threshold: COMPRESSION_LIMIT, // Minimum size in bytes to compress
}));
app.use('/', router);

const document = openApiBuilder({
    title: "Scanner Agent API",
    version: "1.0.0",
    description: "API reference for Double Open Scanner Agent",
})
    .addServer({ url: "/"})
    .addPublicApi(scannerAgentApi)
    .build();

app.use("/docs/swagger.json", (_, res) => res.json(document));
app.use("/docs", serve);
app.use("/docs", setup(undefined, { swaggerUrl: "/docs/swagger.json" }));

// Serve on PORT on Heroku and on localhost:5001 locally
const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 5001;

app.listen(PORT, () =>
    console.log(`Scanner Agent server listening on port ${PORT}`),
);

export default app;