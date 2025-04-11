// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const authConfig = {
    url: process.env.KEYCLOAK_URL || "http://localhost:8083",
    realm: process.env.KEYCLOAK_REALM || "dos-dev",
    clientIdAPI: process.env.KEYCLOAK_CLIENT_ID_API || "dos-dev-api",
    clientSecretAPI:
        process.env.KEYCLOAK_CLIENT_SECRET_API || "api-client-secret",
    clientIdUI: process.env.KEYCLOAK_CLIENT_ID_UI || "dos-dev-ui",
    clientSecretUI: process.env.KEYCLOAK_CLIENT_SECRET_UI || "ui-client-secret",
};
