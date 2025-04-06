// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}
