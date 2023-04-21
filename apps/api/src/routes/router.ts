// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { Request, Response, Router } from 'express';
import fetch from 'cross-fetch';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        "Message": "Hello World"
    });
})

router.post('/scanresults', (req: Request, res: Response) => {
    // TODO: 
    // - implement fetching scan results from database based on ORT analyzer results sent by user
    // - send results in response
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
interface MyRequest {
    method: string
}
// First dummy implementation
router.post('/add-job', async (req: Request, res: Response) => {
    // TODO: implement sending job to scanner
    // Later: send Object Key (does it come from user?)
    // First implementation: no body needed for request

    const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'localhost:5001/';
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


export default router;
