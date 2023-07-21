// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import { dosApi } from 'validation-helpers';
import fetch from 'cross-fetch';
import { getPresignedPutUrl, objectExistsCheck, saveFiles } from 's3-helpers';
import * as dbQueries from '../helpers/db_queries';
import * as dbOperations from '../helpers/db_operations';
import { loadEnv } from 'common-helpers';
import { deleteLocalFiles, downloadZipFile, getFilePaths, unzipFile } from '../helpers/file_helpers';

loadEnv('../../.env');

const router = zodiosRouter(dosApi);

const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';

//Endpoint for fetching scan results from database
router.post('/scan-results', async (req, res) => {
    try {
        const response = await dbOperations.getPackageResults(req.body.purl);
        res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }

})

// Endpoint for deleting scan results for a specified package purl
router.delete('/scan-results', async (req, res) => {
    try {
        const message = await dbOperations.deletePackageDataByPurl(req.body.purl);
        res.status(200).json({ message: message });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Endpoint for requesting presigned upload url from object storage and sending url in response
router.post('/upload-url', async (req, res) => {
    try {
        const objectExists = await objectExistsCheck(req.body.key);

        if (objectExists === undefined) {
            console.log('Error: objectExists undefined');
            return res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: 'Unable to determine if object with the requested key already exists. Please try again later.'
            })
        }
        if (objectExists) {
            console.log('Error: Object with key ' + req.body.key + ' already exists.');
            return res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: 'An object with the requested key already exists'
            })
        }

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
    - find out file hashes
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
        // Downloading zip file from object storage
        const downloadPath = '/tmp/downloads/' + req.body.zipFileKey;
        const downloaded = await downloadZipFile(req.body.zipFileKey, downloadPath);

        if (!downloaded) {
            console.log('Error: Zip file download failed');
            return res.status(500).json({
                message: 'Zip file download failed'
            })
        }

        console.log('Zip file downloaded');

        // Unzipping the file locally
        const fileNameNoExt = (req.body.zipFileKey).split('.')[0];
        const extractPath = '/tmp/extracted/' + fileNameNoExt;

        const fileUnzipped = await unzipFile(downloadPath, extractPath);

        if (!fileUnzipped) {
            console.log('Error: Unable to unzip file, fileExists returns false. This could mean that there is an issue with access to the file.');
            return res.status(500).json({
                message: 'Internal server error'
            })
        }

        console.log('Zip file unzipped');

        // Saving files in extracted folder to object storage

        // Listing files in extracted folder
        const filePaths = await getFilePaths(extractPath);

        // Uploading files to object storage
        console.log('Uploading files to object storage...');
        const uploaded = await saveFiles(filePaths, '/tmp/extracted/');

        if (!uploaded) {
            console.log('Error: Unable to upload files to the object storage');
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
        console.log('Files uploaded');
        // Deleting local files
        deleteLocalFiles(downloadPath, extractPath);
        console.log('Local files deleted');

        // Creating new Package in database
        // TODO: replace placeholders with actual data
        const newPackage = await dbQueries.createPackage({
            data: {
                purl: req.body.purl,
                name: 'placeHolder',
                version: 'placeholder',
                scanStatus: 'notStarted'
            }
        });

        res.status(200).json({
            folderName: fileNameNoExt,
            packageId: newPackage.id
        })

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint for adding a new job and sending job to Scanner Agent to be added to work queue
router.post('/job', async (req, res) => {
    try {
        console.log('Adding a new ScannerJob to the database');

        const newScannerJob = await dbQueries.createScannerJob({
            data: {
                state: 'created',
                packageId: req.body.packageId
            }
        });

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

            const updatedScannerJob = await dbQueries.updateScannerJob({
                id: newScannerJob.id,
                data: { state: 'queued' }
            })

            await dbQueries.updatePackage({
                id: req.body.packageId,
                data: { scanStatus: 'pending' }
            })

            res.status(201).json({
                scannerJob: updatedScannerJob,
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

// Endpoint for getting job state from database
router.get('/job-state/:id', async (req, res) => {
    try {
        const jobState = await dbOperations.getJobState(req.params.id);

        if (!jobState) {
            res.status(400).json({ message: 'Bad Request: Scanner Job with requested id cannot be found in the database' });
        } else {
            res.status(200).json({
                state: jobState
            })
        }
    } catch (error) {
        console.log('Problem with database query: ' + error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Endpoint for receiving job state changes from scanner agent and updating job state in database
router.put('/job-state', async (req, res) => {
    try {
        const updatedScannerJob = await dbQueries.updateScannerJob({
            id: req.body.id,
            data: { state: req.body.state }
        })

        if (req.body.state === 'completed') {
            console.log('Changing package scanStatus to "scanned"');

            await dbQueries.updatePackage({
                id: updatedScannerJob.packageId,
                data: { scanStatus: 'scanned' }
            })
        }

        res.status(200).json({
            editedScannerJob: updatedScannerJob,
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
            await dbOperations.saveJobResults(req.body.id, req.body.result)
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
