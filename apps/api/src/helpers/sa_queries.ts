// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { isErrorFromAlias, Zodios } from "@zodios/core";
import { isAxiosError } from "axios";
import { scannerAgentApi, type ScannerJobResultType } from "validation-helpers";

const scannerUrl: string = process.env.SCANNER_URL
    ? process.env.SCANNER_URL
    : "http://localhost:5001/";

const scannerAgentClient = new Zodios(scannerUrl, scannerAgentApi);

const saToken = process.env.SA_API_TOKEN || "token";

export const sendJobToQueue = async (
    jobId: string,
    files: { hash: string; path: string }[],
    options?: { timeout: string },
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
                    options: options
                        ? {
                              timeout: options.timeout,
                          }
                        : {},
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

export const reportResultState = async (
    jobId: string,
    resultState: string,
): Promise<boolean> => {
    let retries = parseInt(process.env.NEW_JOB_RETRIES as string) || 3;
    const retryInterval =
        parseInt(process.env.NEW_JOB_RETRY_INTERVAL as string) || 1000;
    let response = null;

    while (!response && retries >= 0) {
        try {
            response = await scannerAgentClient.postResultState(
                { state: resultState },
                {
                    params: { id: jobId },

                    headers: {
                        Authorization: "Bearer " + saToken,
                    },
                },
            );
        } catch (error) {
            if (isErrorFromAlias(scannerAgentApi, "postResultState", error)) {
                console.log(
                    jobId +
                        ": Failed to report result state. Scanner Agent responded with status code " +
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
            console.log(retries);
            retries--;
            if (retries >= 0) {
                console.log(jobId + ": Retrying to report result state");
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

export const queryJobDetails = async (
    jobId: string,
): Promise<{ state: string; result: ScannerJobResultType | undefined }> => {
    try {
        const jobDetails = await scannerAgentClient.getJobDetails({
            params: { id: jobId },
            headers: {
                Authorization: "Bearer " + saToken,
            },
        });

        return { state: jobDetails.state, result: jobDetails.result };
    } catch (error) {
        if (isErrorFromAlias(scannerAgentApi, "getJobDetails", error)) {
            if (error.response.status === 404) {
                return { state: "notFound", result: undefined };
            }
            console.log(error.response.status);
            console.log(error.response.data);
        } else if (isAxiosError(error) && error.code === "ECONNREFUSED") {
            console.log("Unable to connect Scanner Agent");
            return { state: "noConnectionToSA", result: undefined };
        }
        throw error;
    }
};
