// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { Request, Response, Router, RequestHandler } from 'express';
import fetch from 'cross-fetch';
import bodyParser from 'body-parser';

const router: Router = express.Router();

router.use(bodyParser.json() as RequestHandler);

const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'localhost:5001/';

interface MyRequest {
    method: string
}

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        "Message": "Hello World"
    });
})

router.post('/scanresults', (req: Request, res: Response) => {
    /*
    TODO: 
        - implement fetching scan results from database based on ORT analyzer results sent by user
        - send results in response
        - error handling
    */

    res.status(200).json({
        "Message": "Scan results"
    })
})

router.get('/request-upload-url', (req: Request, res: Response) => {
    // TODO: implement requesting presigned upload url from object storage and send url in response
    res.status(200).json({
        "Message": "Upload url"
    })
})

router.post('/add-job', async (req: Request, res: Response) => {
    /*
    TODO: implement sending job to scanner
        - send Object Key to Scanner Agent (does it come from user?)
        - response from Scanner Agent successful: save Job to database
        - error handling
    First implementation: no body needed for request
    */

    const postJobUrl: string = scannerUrl + 'job';

    console.log(postJobUrl);

    const request: MyRequest = {
        method: 'POST'
    }

    const response: globalThis.Response = await fetch(postJobUrl, request);

    const data: unknown = await response.json();

    res.status(200).json({
        data: data
    })
})

interface CustomRequest<T> extends Request {
    body: T
}

interface ScannerJob {
    id: string;
    name: string;
    status: string;
}

router.put('/jobstatus', (req: CustomRequest<ScannerJob>, res: Response) => {
    /*
    TODO: implement receiving job status change from scanner agent
        - save job status to database so that it can be queried from the dos api by the user
        - error handling
    First implementation:
        - log job id and status to console
    */

    const job: ScannerJob = {
        id: req.body.id,
        name: req.body.name,
        status: req.body.status
    }

    console.log("Received job id: " + job.id + " , name: " + job.name + ", status: " + job.status)

    res.status(200).json({
        "Message": "Received job status"
    })
})

export default router;
