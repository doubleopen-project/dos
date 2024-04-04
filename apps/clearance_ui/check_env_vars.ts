// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Bypass this check in unit test environment
if (process.env.NODE_ENV === "test") process.exit(0);

const requiredEnvVars: string[] = [
    "KEYCLOAK_URL",
    "KEYCLOAK_REALM",
    "KEYCLOAK_CLIENT_ID_UI",
    "KEYCLOAK_CLIENT_SECRET_UI",
];

const missingVars: string[] = requiredEnvVars.filter(
    (envVar) => !(envVar in process.env),
);

if (missingVars.length > 0) {
    console.error(
        `Missing required environment variables: ${missingVars.join(", ")}`,
    );
    process.exit(1);
} else {
    console.log(
        "All required environment variables are set. Proceeding with the build.",
    );
    process.exit(0);
}
