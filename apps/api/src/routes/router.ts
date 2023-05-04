// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-misused-promises */

import express, { Request, Response, Router, RequestHandler } from 'express';
import fetch from 'cross-fetch';
import bodyParser from 'body-parser';
import { getPresignedPutUrl, s3client } from '../helpers/s3client';

const router: Router = express.Router();

router.use(bodyParser.json() as RequestHandler);

const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'https://localhost:5001/';

interface CustomRequest<T> extends Request {
    body: T
}

interface ScannerJob {
    id: string;
    name: string;
    status: string;
}

interface PresignedUrlRequest {
    key: string;
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

router.post('/requestuploadurl', async (req: CustomRequest<PresignedUrlRequest>, res: Response) => {
    // Requesting presigned upload url from object storage and sending url in response
    try {
        if (req.body.key) {
            const bucket: string | undefined = process.env.S3_BUCKET;

            if (bucket) {
                const presignedUrl: string | undefined = await getPresignedPutUrl(req.body.key, bucket, s3client());
                
                if (presignedUrl) {
                    res.status(200).json({
                        "Success": "true",
                        "PresignedUrl": presignedUrl
                    })
                } else {
                    console.log("Error: Presigned URL is undefined");
                    res.status(200).json({
                        "Success": "false",
                        "PresignedUrl": "undefined"
                    })
                }
            } else {
                console.log("Error: Missing S3_BUCKET environment variable");
                res.status(500).json({ "Message": "Internal server error" });
            }
        } else {
            res.status(400).json({
                "Message": "Bad Request"
            })
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ "Message": "Internal server error" });
    }
})

router.post('/addjob', async (req: Request, res: Response) => {
    /*
    TODO: implement sending job to scanner
        - send Object Key to Scanner Agent (does it come from user?)
        - response from Scanner Agent successful: save Job to database
        - error handling
    First implementation: request body is empty
    */
    try {
        const postJobUrl: string = scannerUrl + 'job';
        const request: RequestInit = {
            method: 'POST',
            body: JSON.stringify({})
        }

        const response: globalThis.Response = await fetch(postJobUrl, request);
        const data: unknown = await response.json();
        res.status(200).json({
            data: data
        })

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ "Message": "Internal server error" });
    }
})

router.put('/jobstatus', (req: CustomRequest<ScannerJob>, res: Response) => {
    /*
    TODO: implement receiving job status change from scanner agent
        - save job status to database so that it can be queried from the dos api by the user
        - error handling
    First implementation:
        - log job id and status to console
    */

    try {
        if (req.body.id && req.body.name && req.body.status) {
            const job: ScannerJob = {
                id: req.body.id,
                name: req.body.name,
                status: req.body.status
            }

            console.log("Received job id: " + job.id + " , name: " + job.name + ", status: " + job.status)

            res.status(200).json({
                "Message": "Received job id: " + job.id + " with status: " + job.status
            })
        } else {
            res.status(400).json({
                "Message": "Bad Request"
            })
        }


    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ "Message": "Internal server error: ", error });
    }

})

export default router;
