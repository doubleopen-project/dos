// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { Request, Response, Router, RequestHandler } from 'express';
import fetch from 'cross-fetch';
import bodyParser from 'body-parser';
import { getPresignedPutUrl, objectExistsCheck } from 's3-helpers';
import { ScannerJob } from 'database';
import { CustomRequest, NewScannerJobRequest, PresignedUrlRequest, ScannerJobInt } from '../helpers/api_interfaces';
import { addNewScannerJob, editScannerJob } from '../helpers/db_queries';
import { loadEnv } from 'common-helpers';

loadEnv('../../.env');

const router: Router = express.Router();

router.use(bodyParser.json() as RequestHandler);

const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        'Message': 'Hello World'
    });
})

router.post('/scan-results', (req: Request, res: Response) => {
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

router.post('/upload-url', async (req: CustomRequest<PresignedUrlRequest>, res: Response) => {
    // Requesting presigned upload url from object storage and sending url in response
    try {
        if (req.body.key) {
            const objectExists: boolean | undefined = await objectExistsCheck(req.body.key);

            console.log('objectExists: ', objectExists);

            if (objectExists === undefined) {
                res.status(200).json({
                    'Success': 'false',
                    'PresignedUrl': 'undefined'
                })
            }

            if (!objectExists) {
                const presignedUrl: string | undefined = await getPresignedPutUrl(req.body.key);

                if (presignedUrl) {
                    res.status(200).json({
                        'Success': 'true',
                        'PresignedUrl': presignedUrl
                    })
                } else {
                    console.log('Error: Presigned URL is undefined');
                    res.status(200).json({
                        'Success': 'false',
                        'PresignedUrl': 'undefined'
                    })
                }
            } else {
                console.log('Error: Object with key ' + req.body.key + ' already exists.');
                res.status(200).json({
                    'Success': 'false',
                    'PresignedUrl': 'undefined'
                })
            }

        } else {
            res.status(400).json({
                'Message': 'Bad Request'
            })
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ 'Message': 'Internal server error' });
    }
})

router.post('/job', async (req: CustomRequest<NewScannerJobRequest>, res: Response) => {
    /*
    TODO: implement sending job to scanner
        - send Object Key to Scanner Agent
        - response from Scanner Agent successful: save Job to database
        - error handling
    */
    try {
        if (req.body.directory && req.body.packageName && req.body.packageVersion && req.body.packageRegistry) {

            // Adding a new ScannerJob to the database
            const newScannerJob: ScannerJob = await addNewScannerJob(
                'created',
                req.body.packageName,
                req.body.packageVersion,
                req.body.packageRegistry
            );

            // Sending a request to Scanner Agent to add new job to the work queue
            const postJobUrl: string = scannerUrl + 'job';

            const request: RequestInit = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    directory: req.body.directory,
                    opts: {
                        jobId: newScannerJob.id
                    }
                })
            }

            const response: globalThis.Response = await fetch(postJobUrl, request);
            console.log(response);
            

            // Change ScannerJob state in database to addedToQueue if request was succesfull
            if(response.status === 201) {
                const editedScannerJob: ScannerJob = await editScannerJob(newScannerJob.id, {state: 'addedToQueue'})
                res.status(201).json({
                    'ScannerJob': editedScannerJob,
                    'Message': 'Job added to queue'
                })
            } else {
                res.status(202).json({
                    'ScannerJob': newScannerJob,
                    'Message': 'Adding job to queue was unsuccessful'
                })
            }
        } else {
            console.log("Error: something missing in request");
            
            res.status(400).json({
                'Message': 'Bad Request'
            })
        }

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ 'Message': 'Internal server error' });
    }
})

router.put('/job-state', async (req: CustomRequest<ScannerJobInt>, res: Response) => {
    /*
    TODO: implement receiving job state change and possible results from scanner agent
        - save job state to database so that it can be queried from the dos api by the user
        - save job results to database
        - error handling
    */

    try {
        if (req.body.id && req.body.name && req.body.state) {

            // The following is necessary because Queue.JobId type is number | string, and the
            // database column data type has to be set to one of them, so it has to be a string
            let scanJobId: string;
            if(typeof req.body.id === 'number') {
                scanJobId = (req.body.id).toString();
            } else {
                scanJobId = req.body.id
            }

            // Save state change to database
            const editedScannerJob: ScannerJob = await editScannerJob(scanJobId, {state: req.body.state})
            
            if (req.body.state === 'completed' && req.body.result) {
                //TODO: save results to database

            }

            res.status(200).json({
                'EditedJob': editedScannerJob,
                'Message': 'Received job with id '+ scanJobId + '. Changed state to ' + req.body.state
            })
        } else {
            res.status(400).json({
                'Message': 'Bad Request'
            })
        }


    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ 'Message': 'Internal server error: ', error });
    }

})

export default router;
