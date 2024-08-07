// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { isErrorFromAlias, Zodios } from "@zodios/core";
import { isAxiosError } from "axios";
import { scannerAgentApi } from "validation-helpers";

const scannerUrl: string = process.env.SCANNER_URL
    ? process.env.SCANNER_URL
    : "http://localhost:5001/";

const scannerAgentClient = new Zodios(scannerUrl, scannerAgentApi);

const saToken = process.env.SA_API_TOKEN || "token";

export const sendJobToQueue = async (
    jobId: string,
    files: { hash: string; path: string }[],
    options: { timeout: number },
): Promise<boolean> => {
    let retries = parseInt(process.env.NEW_JOB_RETRIES as string) || 3;
    const retryInterval =
        parseInt(process.env.NEW_JOB_RETRY_INTERVAL as string) || 1000;
    let response = null;

    while (!response && retries >= 0) {
        try {
            response = await scannerAgentClient.postJob(
                {
                    jobId: jobId,
                    options: options,
                    files: files,
                },
                {
                    headers: {
                        Authorization: "Bearer " + saToken,
                    },
                },
            );
        } catch (error) {
            if (isErrorFromAlias(scannerAgentApi, "postResultState", error)) {
                console.log(
                    jobId +
                        ": Failed to add job to queue. Scanner Agent responded with status code " +
                        error.response.status,
                );
            } else if (isAxiosError(error) && error.code === "ECONNREFUSED") {
                console.log("Unable to connect Scanner Agent");
            } else {
                console.log(
                    jobId + ": Failed to report result state. Error: ",
                    error,
                );
            }
            retries--;
            if (retries >= 0) {
                console.log(jobId + ": Retrying to add job to queue");
                await new Promise((resolve) =>
                    setTimeout(resolve, retryInterval),
                );
            } else {
                return false;
            }
        }
    }

    return true;
};
