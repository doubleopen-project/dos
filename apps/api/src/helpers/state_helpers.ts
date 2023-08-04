// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

export const stateMap = new Map([
    ['created', 'Scan job created'],
    ['processing', 'Processing files for scanning'],
    ['queued', 'Scan job added to queue'],
    ['waiting', 'Scan job waiting on queue'],
    ['active', 'Scanning files'],
    ['savingResults', 'Saving scan results'],
    ['completed', 'Scan job completed'],
    ['failed', 'Scan job failed'],
    ['resultsDeleted', 'Scan results deleted'],
]);
                