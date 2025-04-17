// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { authConfig } from "common-helpers";

export const getAccessToken = async (username: string, password: string) => {
    const result = await fetch(
        `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: authConfig.clientIdUI,
                grant_type: "password",
                username: username,
                password: password,
                client_secret: authConfig.clientSecretUI,
            }),
        },
    );

    const body = await result.json();
    return (body as { access_token: string }).access_token;
};
