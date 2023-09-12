// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import fetch from 'cross-fetch';

export const sendJobToQueue = async (jobId: string, files: { hash: string, path: string }[], options?: { timeout: string }): Promise<boolean> => {
    const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';
    const postJobUrl = scannerUrl + 'job';

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.SA_TOKEN
        },
        body: JSON.stringify({
            jobId: jobId,
            options: options ? {
                timeout: options.timeout
            } : {},
            files: files
        })
    }
    
    let retries = parseInt(process.env.NEW_JOB_RETRIES as string) || 3;
    const retryInterval = parseInt(process.env.NEW_JOB_RETRY_INTERVAL as string) || 1000;
    let response = null;

    while ((!response || response.status !== 201) && retries > 0) {
        try {
            response = await fetch(postJobUrl, request);
            retries--;

            if (response.status !== 201 && retries > 0) {
                console.log(jobId + ': Failed to add job to queue. Scanner Agent responded with status code ' + response.status);
                console.log(jobId + ': Retrying to add job to queue');
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            }
        } catch (error) {
            console.log(jobId + ': Failed to add job to queue. Error: ', error);
            console.log(jobId + ': Retrying to add job to queue');
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            retries--;
        }
    }

    if (response && response.status === 201) {
        return true;
    } else {
        return false;
    }
}

export const reportResultState = async (jobId: string, resultState: string): Promise<boolean> => {
    const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';
    const postResultStateUrl = scannerUrl + 'result-state/'+jobId+'/';

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.SA_TOKEN
        },
        body: JSON.stringify({
            state: resultState
        })
    }

    let retries = parseInt(process.env.NEW_JOB_RETRIES as string) || 3;
    const retryInterval = parseInt(process.env.NEW_JOB_RETRY_INTERVAL as string) || 1000;
    let response = null;

    while ((!response || response.status !== 200) && retries > 0) {
        try {
            response = await fetch(postResultStateUrl, request);
            retries--;

            if (response.status !== 200 && retries > 0) {
                console.log(jobId + ': Failed to report result state. Scanner Agent responded with status code ' + response.status);
                console.log(jobId + ': Retrying to report result state');
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            }
        } catch (error) {
            console.log(jobId + ': Failed to report result state. Error: ', error);
            console.log(jobId + ': Retrying to report result state');
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            retries--;
        }
    }

    if (response && response.status === 200) {
        return true;
    } else {
        return false;
    }
}
