// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

declare const getCurrentDateTime: () => string;

declare const authConfig: {
    url: string;
    realm: string;
    clientIdAPI: string;
    clientSecretAPI: string;
    clientIdUI: string;
    clientSecretUI: string;
};

export { authConfig, getCurrentDateTime };
