// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import { dosApi } from 'validation-helpers';
import fetch from 'cross-fetch';
import { downloadFile, getPresignedPutUrl, objectExistsCheck } from 's3-helpers';
import { addNewCopyrightFinding, addNewFile, addNewLicenseFinding, addNewScannerJob, editFile, editScannerJob, findFileWithHash } from '../helpers/db_queries';
import { loadEnv } from 'common-helpers';
import { formatDateString } from '../helpers/date_helpers';

loadEnv('../../.env');

const router = zodiosRouter(dosApi);

const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';

//Endpoint for fetching scan results from database
router.post('/scan-results', (req, res) => {
    /*
    TODO: 
        - implement fetching scan results from database based on ORT analyzer results sent by user
        - send results in response
        - error handling
    */

    res.status(200).json({
        'results': null
    })
})

// Endpoint for requesting presigned upload url from object storage and sending url in response
router.post('/upload-url', async (req, res) => {
    
    try {
        const objectExists = await objectExistsCheck(req.body.key);

        console.log('objectExists: ', objectExists);

        if (objectExists === undefined) {
            console.log('Error: objectExists undefined');

            res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: 'Unable to determine if object with the requested key already exists. Please try again later.'
            })
        } else if (!objectExists) {
            const presignedUrl: string | undefined = await getPresignedPutUrl(req.body.key);

            if (presignedUrl) {
                res.status(200).json({
                    success: true,
                    presignedUrl: presignedUrl
                })
            } else {
                console.log('Error: Presigned URL is undefined');
                res.status(200).json({
                    success: false,
                    presignedUrl: undefined
                })
            }
        } else {
            console.log('Error: Object with key ' + req.body.key + ' already exists.');
            res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: 'An object with the requested key already exists'
            })
        }

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
/*
Endpoint for adding a Package
    - takes in:
        - [PHASE 1 & 2] name of a zip file in object storage
        - [PHASE 2] package identifier (purl?)    
    - returns: 
        - [PHASE 1] the name of the folder in S3 where the zip file was extracted
        - [PHASE 2] the id of the created package
*/
router.post('/package', async (req, res) => {
    /*  
    TODO:
    - fetch zip file from object storage
    - extract zip file
    - find out file hashes
    - create new Package in database
    - go through files in zip file:
        - check if file with hash exists in database
            - if exists: add FileTree that links File to Package
            - if doesn't exist: 
                - create new File in database
                - add FileTree that links File to Package
                - upload file to object storage with hash as key (with extension)
    - send response:
        - Package id
    - error handling
    */
    try {
        // Fetching zip file from object storage
        const downloadPath = '/tmp/downloads/' + req.body.zipFileKey;

        if (!process.env.SPACES_BUCKET) {
            throw new Error("SPACES_BUCKET environment variable is missing");
        }

        if(await downloadFile(process.env.SPACES_BUCKET, req.body.zipFileKey, downloadPath)) {
            console.log('Zip file downloaded');
            // TODO: Extracting zip file

            res.status(200).json({
                folderName: 'folderName'
            })
        } else {
            console.log('Error: Zip file download failed');
            res.status(500).json({
                message: 'Zip file download failed'
            })
        }
        
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint for adding a new job and sending job to Scanner Agent to be added to work queue
router.post('/job', async (req, res) => {
    try {
        console.log('Adding a new ScannerJob to the database');
        
        const newScannerJob = await addNewScannerJob({ state: 'created' });

        console.log('Sending a request to Scanner Agent to add new job to the work queue');
        
        const postJobUrl = scannerUrl + 'job';

        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                directory: req.body.directory,
                opts: {
                    jobId: newScannerJob.id
                }
            })
        }

        const response = await fetch(postJobUrl, request);

        if (response.status === 201) {
            console.log('Changing ScannerJob state to "addedToQueue"');
            
            const editedScannerJob = await editScannerJob({
                id: newScannerJob.id,
                data: { state: 'addedToQueue' }
            })

            res.status(201).json({
                scannerJob: editedScannerJob,
                message: 'Job added to queue'
            })
        } else {
            console.log('Created ScannerJob, but adding to queue was unsuccesful');
            
            res.status(202).json({
                scannerJob: newScannerJob,
                message: 'Adding job to queue was unsuccessful'
            })
        }

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Endpoint for receiving job state changes from scanner agent and updating job state in database
router.put('/job-state', async (req, res) => {
    try {
        const editedScannerJob = await editScannerJob({
            id: req.body.id,
            data: { state: req.body.state }
        })

        res.status(200).json({
            editedScannerJob: editedScannerJob,
            message: 'Received job with id ' + req.body.id + '. Changed state to ' + req.body.state
        })

    } catch (error) {
        console.log('Error: ', error);
        res.status(400).json({ message: 'Bad Request: Scanner Job with requested id cannot be found in the database' });
    }
})

// Receiving scan job results from scanner agent and saving to database
router.post('/job-results', async (req, res) => {
    try {
        if (req.body.result.headers.length === 1) {

            console.log('Editing scanner job');
            
            await editScannerJob(
                {
                    id: req.body.id,
                    data: {
                        scannerName: req.body.result.headers[0].tool_name,
                        scannerVersion: req.body.result.headers[0].tool_version,
                        duration: req.body.result.headers[0].duration,
                        scanStartTS: new Date(formatDateString(req.body.result.headers[0].start_timestamp)),
                        scanEndTS: new Date(formatDateString(req.body.result.headers[0].end_timestamp)),
                        spdxLicenseListVersion: req.body.result.headers[0].extra_data.spdx_license_list_version
                    }
                }
            )
            
            console.log('Adding LicenseFindings and CopyrightFindings for files');
            
            for (const file of req.body.result.files) {

                if (file.type === 'file') {
                    if (file.sha256) {
                        let dbFile = await findFileWithHash(file.sha256);
                        if (!dbFile) {
                            dbFile = await addNewFile({
                                data: {
                                    sha256: file.sha256,
                                    scanned: true,
                                    scannerJobId: req.body.id
                                }
                            });
                        } else {
                            await editFile({
                                id: dbFile.id,
                                data: {
                                    scanned: true,
                                    scannerJobId: req.body.id
                                }
                            })
                        }

                        for (const license of file.license_detections) {
                            for (const match of license.matches) {
                                await addNewLicenseFinding({
                                    data: {
                                        scanner: req.body.result.headers[0].tool_name,
                                        licenseExpression: license.license_expression,
                                        startLine: match.start_line,
                                        endLine: match.end_line,
                                        score: match.score,
                                        sha256: file.sha256
                                    }
                                })
                            }
                        }

                        for (const copyright of file.copyrights) {
                            await addNewCopyrightFinding({
                                data: {
                                    startLine: copyright.start_line,
                                    endLine: copyright.end_line,
                                    copyright: copyright.copyright,
                                    sha256: file.sha256
                                }
                            })
                        }
                    }
                }
            }

            res.status(200).json({
                message: 'Received and saved results for job with with id ' + req.body.id
            })
        } else {
            console.log('Alert in job-results! More headers!!!');
            res.status(500).json({ message: 'Internal server error' });
            //TODO: figure out if there could be more header objects and why and what to do then
        }

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;
