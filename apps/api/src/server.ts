// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosApp } from '@zodios/express';
import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import { openApiBuilder } from '@zodios/openapi';
import compression from 'compression';
import cron from 'node-cron';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import router from './routes/router';
import { adminRouter, authRouter, userRouter } from './routes';
import { loadEnv } from 'common-helpers';
import { dosApi } from 'validation-helpers';

import { rescanFilesWithTimeoutIssues } from './helpers/cron_jobs';
import { localStrategy } from './passport_strategies/local_strategy';
import * as dbQueries from './helpers/db_queries';
import { User as DBUser } from 'database';
import { authorizeAdmin, authorizeUser } from './helpers/auth_helpers';

loadEnv('../../.env');

if(!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET not set');
if(!process.env.COOKIE_SECRET) throw new Error('COOKIE_SECRET not set');
if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');

//const environment = process.env.NODE_ENV || 'development';

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

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
console.log(allowedOrigins);

const corsOptions = {
    credentials: true,
    origin: (origin: string | undefined, callback: (error: Error | null, allowed: boolean) => void) => {
        if(!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    }
};

app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Use User from database package in serialization and deserialization
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface User extends DBUser { }
    }
}

const memoryStore = new session.MemoryStore();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: memoryStore,
        cookie: {
            //secure: environment === 'production',
            httpOnly: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        }
    })
)

app.use(passport.initialize());
app.use(passport.session());

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await dbQueries.findUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

app.use('/api', router);
app.use('/api/auth', authRouter);
app.use('/api/admin', authorizeAdmin, adminRouter);
app.use('/api/user', authorizeUser, userRouter);

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