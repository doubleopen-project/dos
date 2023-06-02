// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { dosApi } from 'validation-helpers';
import fetch from 'cross-fetch';
import { getPresignedPutUrl, objectExistsCheck } from 's3-helpers';
import { addNewCopyrightFinding, addNewFile, addNewLicenseFinding, addNewScannerJob, editFile, editScannerJob, findFileWithHash } from '../helpers/db_queries';
import { loadEnv } from 'common-helpers';
import { formatDateString } from "../helpers/date_helpers";

loadEnv('../../.env');

const router = zodiosRouter(dosApi);

const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';

router.post('/scan-results', (req, res) => {
    /*
    TODO: 
        - implement fetching scan results from database based on ORT analyzer results sent by user
        - send results in response
        - error handling
    */

    res.status(200).json({
        'Message': 'Scan results'
    })
})

router.post('/upload-url', async (req, res) => {
    // Requesting presigned upload url from object storage and sending url in response
    try {
        const objectExists = await objectExistsCheck(req.body.key);

        console.log('objectExists: ', objectExists);

        if (objectExists === undefined) {
            console.log('Error: objectExists undefined');

            res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: 'Unable to get fetch resource for request. Please try again later.'
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

router.post('/job', async (req, res) => {
    /*
    TODO: implement sending job to scanner
        - send Object Key to Scanner Agent
        - response from Scanner Agent successful: save Job to database
        - error handling
    */
    try {
        // Adding a new ScannerJob to the database
        const newScannerJob = await addNewScannerJob({state: 'created'});

        // Sending a request to Scanner Agent to add new job to the work queue
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

        // Change ScannerJob state in database to addedToQueue if request was succesfull
        if (response.status === 201) {
            const editedScannerJob = await editScannerJob({
                id: newScannerJob.id, 
                data: { state: 'addedToQueue' }
            })

            res.status(201).json({
                scannerJob: editedScannerJob,
                message: 'Job added to queue'
            })
        } else {
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

router.put('/job-state', async (req, res) => {
    try {
        // Save state change to database
        const editedScannerJob = await editScannerJob({
            id: req.body.id, 
            data: { state: req.body.state }
        })

        //TODO: error handling for editedScannerJob (eg. id not in db)

        res.status(200).json({
            editedScannerJob: editedScannerJob,
            message: 'Received job with id ' + req.body.id + '. Changed state to ' + req.body.state
        })
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error: ' });
    }
})

router.post('/job-results', async (req, res) => {
    /*
    TODO: implement receiving job results from scanner agent and saving to database
    */

    try {
        //console.log(req.body.result.headers);
        //console.dir(req.body.result, {depth: null});
        
        
        if (req.body.result.headers.length === 1) {
            
            const editedScannerJob = await editScannerJob(
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
            console.log(editedScannerJob);

            
            for (let i=0; i<10; i++) {
                console.dir(req.body.result.files[i], {depth: null});
            }

            for (const file of req.body.result.files) {
                
                if(file.type === 'file') {
                    if(file.sha256) {
                        let dbFile = await findFileWithHash(file.sha256);
                        if(!dbFile) {
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

                        for (const license of file.licenses) {
                            await addNewLicenseFinding({
                                data: {
                                    scanner: req.body.result.headers[0].tool_name,
                                    licenseExpression: license.key,
                                    startLine: license.start_line,
                                    endLine: license.end_line,
                                    score: license.score,
                                    sha256: file.sha256
                                }
                            })
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
                message: 'Received results for job with with id ' + req.body.id
            })
        } else {
            console.log("Alert in job-results! More headers!!!");
            //TODO: figure out if there could be more header objects and why and what to do then
        }
        
    } catch (error) {
        
    }

    
})

export default router;
