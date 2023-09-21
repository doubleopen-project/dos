// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosApp } from '@zodios/express';
import router from './routes/router';
import express from 'express';
import { loadEnv } from 'common-helpers';
import { dosApi } from 'validation-helpers';
import { serve, setup } from 'swagger-ui-express';
import { openApiBuilder } from '@zodios/openapi';
import compression from 'compression';
import cron from 'node-cron';
import { rescanFilesWithTimeoutIssues } from './helpers/cron_jobs';
import cors from 'cors';

loadEnv('../../.env');

const COMPRESSION_LIMIT: number = process.env.SIZE_LIMIT_FOR_COMPRESSION? parseInt(process.env.SIZE_LIMIT_FOR_COMPRESSION) : 0;

const opts = {
	enableJsonBodyParser: false
}
const app = zodiosApp(dosApi, opts);

app.use(express.json({ limit: '500mb' }));
app.use(compression({
    level: -1, // Default compression level
    threshold: COMPRESSION_LIMIT, // Size limit for compression
}));
app.use(cors());
app.use('/api', router);

const document = openApiBuilder({
	title: 'DOS API',
	version: '1.0.0',
	description: 'API reference for Double Open Server',
})
	.addServer({ url: '/api' })
	.addPublicApi(dosApi)
	.build();

app.use(`/docs/swagger.json`, (_, res) => res.json(document));
app.use('/docs', serve);
app.use('/docs', setup(undefined, { swaggerUrl: '/docs/swagger.json' }));

const rescanSchedule = process.env.RESCAN_SCHEDULE || '0 0 * * *';

cron.schedule(rescanSchedule, () => {
	rescanFilesWithTimeoutIssues();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.listen(PORT, () =>
	console.log(`Server listening on port ${PORT}`),
);

export default app;