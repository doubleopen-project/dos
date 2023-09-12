// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

//import { sendJobToQueue } from "./sa_queries";
import * as dbQueries from "./db_queries";
import { sendJobToQueue } from "./sa_queries";

export const rescanFilesWithTimeoutIssues = async () => {
    try {
        console.log('Checking for unresolved issues');

        const scanIssuesWithRelations = await dbQueries.findScanIssuesWithRelatedFileAndPackageAndFileTree();
        console.log('Found ' + scanIssuesWithRelations.length + ' unresolved issues');

        if (scanIssuesWithRelations.length > 0) {
            const timeoutErrorRegex = '(ERROR: for scanner: (?<scanner>\\w+):\n)?ERROR: Processing interrupted: timeout after (?<timeout>\\d+) seconds.';

            let counter = 0;
            for (const scanIssue of scanIssuesWithRelations) {
                const match = scanIssue.message.match(timeoutErrorRegex);
                if (match) {
                    const newTimeout = (parseInt(match.groups?.timeout as string) * 10);

                    const newScannerJob = await dbQueries.createScannerJob({
                        data: {
                            state: 'created',
                            packageId: scanIssue.file.filetrees[0].packageId
                        }
                    });
                    console.log(newScannerJob.id + ': Rescanning file with timeout issue for package ' + scanIssue.file.filetrees[0].package.purl);

                    sendJobToQueue(newScannerJob.id, [{ hash: scanIssue.fileSha256, path: scanIssue.file.filetrees[0].path }], { timeout: newTimeout.toString() });

                    await dbQueries.updateScannerJob(newScannerJob.id, { state: 'queued', timeout: newTimeout });

                    counter++;
                }
            }
            console.log('Resolved ' + counter + ' timeout issues');
            console.log('Other issues need to be resolved manually. Other issues count: ' + (scanIssuesWithRelations.length - counter));
        }
    } catch (error) {
        console.log('Error with cron job rescanFilesWithTimeoutIssues: ', error);
    }

}