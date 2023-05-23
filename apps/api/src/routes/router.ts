// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { Request, Response, Router, RequestHandler } from 'express';
import fetch from 'cross-fetch';
import bodyParser from 'body-parser';
import { getPresignedPutUrl, objectExistsCheck } from 's3-helpers';
import { loadEnv } from 'common-helpers';

loadEnv('../../.env');
import { ScannerJob } from 'database';
import { CustomRequest, NewScannerJobRequest, PresignedUrlRequest, ScannerAgentJobResponse, ScannerJobInt } from '../helpers/api_interfaces';
import { addNewScannerJob } from '../helpers/db_queries';

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
    First implementation: request body is empty
    Second implementation: request body has directory parameter
    Third implementation: adding job details to database
    */
    try {
        if (req.body.directory && req.body.packageName && req.body.packageVersion && req.body.packageRegistry) {

            // Sending a request to Scanner Agent to add new job to the work queue
            const postJobUrl: string = scannerUrl + 'job';

            const request: RequestInit = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    directory: req.body.directory
                })
            }

            const response: globalThis.Response = await fetch(postJobUrl, request);
            const saRespData: ScannerAgentJobResponse = await response.json() as ScannerAgentJobResponse;
            
            // The following is necessary because Queue.JobId type is number | string, and the
            // database column data type has to be set to one of them, so it has to be a string
            let scanJobId: string;
            if(typeof saRespData.id === 'number') {
                scanJobId = (saRespData.id).toString();
            } else {
                scanJobId = saRespData.id
            }
            
            // Adding a new ScannerJob to the database
            const newScannerJob: ScannerJob = await addNewScannerJob(
                'addedToQueue',
                req.body.packageName,
                req.body.packageVersion,
                req.body.packageRegistry,
                scanJobId
            );

            res.status(200).json({
                ScannerJob: newScannerJob
            })
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

router.put('/jobstatus', (req: CustomRequest<ScannerJobInt>, res: Response) => {
    /*
    TODO: implement receiving job status change and possible results from scanner agent
        - save job state to database so that it can be queried from the dos api by the user
        - save job results to database
        - error handling
    First implementation: log job id and status to console
    Second implementation: receive results when job state changes to completed
    */

    try {
        if (req.body.id && req.body.name && req.body.state) {
            let job: ScannerJobInt;

            if (req.body.state === 'completed' && req.body.result) {
                job = {
                    id: req.body.id,
                    name: req.body.name,
                    state: req.body.state,
                    result: req.body.result
                }
                //TODO: save results to database

            } else {
                job = {
                    id: req.body.id,
                    name: req.body.name,
                    state: req.body.state
                }
            }

            console.log('Received job id: ' + job.id + ' , name: ' + job.name + ', state: ' + job.state)

            res.status(200).json({
                'Message': 'Received job id: ' + job.id + ' with state: ' + job.state
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
