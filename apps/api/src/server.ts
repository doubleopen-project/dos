// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosApp } from "@zodios/express";
import { openApiBuilder } from "@zodios/openapi";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import cron from "node-cron";
import { serve, setup } from "swagger-ui-express";
import { dosAPI } from "validation-helpers";
import { getKeycloak, memoryStore } from "./config/keycloak";
import { cronJobs } from "./cron_jobs";
import { onStartUp } from "./helpers/on_start_up";
import { adminRouter, authRouter, scannerRouter, userRouter } from "./routes";
import QueueService from "./services/queue";

const requiredEnvVars: string[] = ["DATABASE_URL"];

if (process.env.NODE_ENV === "production") {
    requiredEnvVars.push(
        "KEYCLOAK_URL",
        "KEYCLOAK_REALM",
        "KEYCLOAK_CLIENT_ID_API",
        "KEYCLOAK_CLIENT_SECRET_API",
        "SESSION_SECRET",
        "COOKIE_SECRET",
        "TOKEN_HMAC_SECRET",
        "SPACES_ENDPOINT",
        "SPACES_REGION",
        "SPACES_KEY",
        "SPACES_SECRET",
        "SPACES_BUCKET",
        "REDIS_URL",
        "REDIS_PW",
    );
}

const missingVars: string[] = requiredEnvVars.filter(
    (envVar) => !(envVar in process.env),
);

if (missingVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`,
    );
}

const COMPRESSION_LIMIT: number = process.env.SIZE_LIMIT_FOR_COMPRESSION
    ? parseInt(process.env.SIZE_LIMIT_FOR_COMPRESSION)
    : 0;

const opts = {
    enableJsonBodyParser: false,
};
const app = zodiosApp(dosAPI, opts);

app.use(express.json({ limit: "500mb" }));
app.use(
    compression({
        level: -1, // Default compression level
        threshold: COMPRESSION_LIMIT, // Size limit for compression
    }),
);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
];

const corsOptions = {
    credentials: true,
    origin: (
        origin: string | undefined,
        callback: (error: Error | null, allowed: boolean) => void,
    ) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"), false);
        }
    },
};

app.use(cookieParser(process.env.COOKIE_SECRET || "secret"));

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

const keycloak = getKeycloak();

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    }),
);

app.use(keycloak.middleware());

app.use(
    "/api/admin",
    cors(corsOptions),
    keycloak.protect("realm:app-admin"),
    adminRouter,
);
app.use("/api/auth", cors(corsOptions), authRouter);
app.use("/api", cors(corsOptions), scannerRouter);
app.use("/api/user", cors(corsOptions), keycloak.protect(), userRouter);

const document = openApiBuilder({
    title: "DOS API",
    version: "1.0.0",
    description: "API reference for Double Open Server",
})
    .addServer({ url: "/api" })
    .addProtectedApi("api", dosAPI)
    .build();

app.use(`/docs/swagger.json`, (_, res) => res.json(document));
app.use("/docs", serve);
app.use("/docs", setup(undefined, { swaggerUrl: "/docs/swagger.json" }));

// Initialize the job queue state event listeners
QueueService.initiateJobEventListeners();

// Run jobStateQuery every 10 seconds (for testing purposes)
//cron.schedule("*/10 * * * * *", () => {
// Run jobStateQuery every 5 minutes
cron.schedule("*/5 * * * *", () => {
    cronJobs.jobStateQuery();
});

// Run cleanJobQueue once a day at midnight
cron.schedule("0 0 * * *", () => {
    cronJobs.cleanJobQueue();
});

// Run onStartUp function before starting the server
(async () => {
    // Run onStartUp function only in production
    if (process.env.NODE_ENV === "production") await onStartUp();

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})();

export default app;
