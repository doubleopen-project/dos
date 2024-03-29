// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosApp } from "@zodios/express";
import { openApiBuilder } from "@zodios/openapi";
import compression from "compression";
import genFunc from "connect-pg-simple";
import cookieParser from "cookie-parser";
import cors from "cors";
import { User as DBUser } from "database";
import express from "express";
import session from "express-session";
import cron from "node-cron";
import passport from "passport";
import { serve, setup } from "swagger-ui-express";
import { dosAPI } from "validation-helpers";
import { cronJobs } from "./cron_jobs";
import { authorizeAdmin, authorizeUser } from "./helpers/auth_helpers";
import * as dbQueries from "./helpers/db_queries";
import { localStrategy } from "./passport_strategies/local_strategy";
import { adminRouter, authRouter, scannerRouter, userRouter } from "./routes";

// These imports will be taken into use when swithcing to keycloak
// import { keycloakProtect } from "./helpers/auth_helpers";
// import { getKeycloak, memoryStore } from "./config/keycloak";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");

if (process.env.NODE_ENV === "production") {
    if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET not set");
    if (!process.env.COOKIE_SECRET) throw new Error("COOKIE_SECRET not set");
    if (!process.env.SPACES_ENDPOINT)
        throw new Error("SPACES_ENDPOINT not set");
    if (!process.env.SPACES_KEY) throw new Error("SPACES_KEY not set");
    if (!process.env.SPACES_SECRET) throw new Error("SPACES_SECRET not set");
    if (!process.env.SPACES_BUCKET) throw new Error("SPACES_BUCKET not set");
    if (!process.env.SA_API_TOKEN) throw new Error("SA_API_TOKEN not set");
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

// Use User from database package in serialization and deserialization
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface User extends DBUser {}
    }
}

const PostgresqlStore = genFunc(session);

const sessionStore = new PostgresqlStore({
    conString: process.env.DATABASE_URL,
    tableName: "Session",
});

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        proxy: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
    }),
);

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

app.use("/api/admin", cors(corsOptions), authorizeAdmin, adminRouter);
app.use("/api/auth", cors(corsOptions), authRouter);
app.use("/api", scannerRouter);
app.use("/api/user", cors(corsOptions), authorizeUser, userRouter);

// This is the setup that will be used when switching to keycloak instead of the
// passport related setup above

/*
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
    keycloak.protect(keycloakProtect(["ADMIN"])),
    adminRouter,
);
app.use("/api/auth", authRouter);
app.use("/api", cors(corsOptions), scannerRouter);
app.use(
    "/api/user",
    cors(corsOptions),
    keycloak.protect(keycloakProtect(["USER"])),
    userRouter,
);
*/

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

// Run rescanFilesWithTimeoutIssues every day at midnight or at the time specified in RESCAN_SCHEDULE
const rescanSchedule = process.env.RESCAN_SCHEDULE || "0 0 * * *";
cron.schedule(rescanSchedule, () => {
    cronJobs.rescanFilesWithTimeoutIssues();
});

// Run jobStateQuery every 10 seconds (for testing purposes)
//cron.schedule("*/10 * * * * *", () => {
// Run jobStateQuery every 5 minutes
cron.schedule("*/5 * * * *", () => {
    cronJobs.jobStateQuery();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
