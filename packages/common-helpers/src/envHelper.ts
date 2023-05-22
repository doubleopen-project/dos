// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as dotenv from "dotenv";
import * as fs from "fs";

// Check if ".env" exists and load environment variables from it
// Otherwise, use the environment variables provided by cloud provider
export const loadEnv = (envPath: string): void => {    
    if (fs.existsSync(envPath)) {
        console.log("Loading environment variables from local .env file");
        dotenv.config({ path: envPath });
    } else {
        console.log("Loading environment variables from cloud provider");
    }
}