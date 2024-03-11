// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { KeycloakAdminClient } from "@dedel.alex/keycloak-admin-client-cjs";

const kcAdminClient = async () => {
    const kcAdminClient = new KeycloakAdminClient({
        baseUrl: process.env.KEYCLOAK_URL,
        realmName: process.env.KEYCLOAK_REALM,
    });

    await kcAdminClient.auth({
        username: process.env.KEYCLOAK_ADMIN_USERNAME as string,
        password: process.env.KEYCLOAK_ADMIN_PASSWORD as string,
        grantType: "password",
        clientId: "admin-cli",
        clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET as string,
    });

    return kcAdminClient;
};

export default kcAdminClient;
