// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import fetch from 'cross-fetch';
import { dosApi } from 'validation-helpers';
import { loadEnv } from 'common-helpers';
import * as s3Helpers from 's3-helpers';
import * as dbQueries from '../helpers/db_queries';
import * as dbOperations from '../helpers/db_operations';
import * as fileHelpers from '../helpers/file_helpers';
import { authenticateORTToken, authenticateSAToken } from '../helpers/auth_helpers';

loadEnv('../../.env');

const router = zodiosRouter(dosApi);

const scannerUrl: string = process.env.SCANNER_URL ? process.env.SCANNER_URL : 'http://localhost:5001/';

// Get scan results for package with purl
router.post('/scan-results', authenticateORTToken, async (req, res) => {
    // TODO: add checking package hash
    // Reason: purl might not mean that the package has all the same files, because this can vary based on where the package has been uploaded from
    try {
        const response = await dbOperations.getPackageResults(req.body.purl);
        res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Delete scan results for a specified package purl
router.delete('/scan-results', authenticateORTToken, async (req, res) => {
    // TODO: this endpoint should only be used by specific users
    try {
        const message = await dbOperations.deletePackageDataByPurl(req.body.purl);
        res.status(200).json({ message: message });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Request presigned upload url for a file
router.post('/upload-url', authenticateORTToken, async (req, res) => {
    try {
        if (!process.env.SPACES_BUCKET) {
            throw new Error('Error: SPACES_BUCKET environment variable is not defined');
        }

        const objectExists = await s3Helpers.objectExistsCheck(req.body.key, process.env.SPACES_BUCKET);

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

        const presignedUrl: string | undefined = await s3Helpers.getPresignedPutUrl(req.body.key, process.env.SPACES_BUCKET);

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
Add a Package (includes downloading and extracting zip file, and uploading separate files to object storage)
    - takes in:
        - [PHASE 1 & 2] name of a zip file in object storage
        - [PHASE 2] package identifier (purl?)    
    - returns: 
        - [PHASE 1] the name of the folder in S3 where the zip file was extracted
        - [PHASE 2] the id of the created package
*/
router.post('/package', authenticateORTToken, async (req, res) => {
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
        const downloaded = await fileHelpers.downloadZipFile(req.body.zipFileKey, downloadPath);

        if (!downloaded) {
            console.log('Error: Zip file download failed');
            return res.status(500).json({
                message: 'Internal server error'
            })
        }

        console.log('Zip file downloaded');

        // Unzipping the file locally
        const fileNameNoExt = (req.body.zipFileKey).split('.')[0];
        const basePath = '/tmp/extracted/';
        const extractPath = basePath + fileNameNoExt + '/';

        const fileUnzipped = await fileHelpers.unzipFile(downloadPath, extractPath);

        if (!fileUnzipped) {
            console.log('Error: Unable to unzip file, fileExists returns false. This could mean that there is an issue with access to the file.');
            return res.status(500).json({
                message: 'Internal server error'
            })
        }

        console.log('Zip file unzipped');

        // Saving files in extracted folder to object storage

        // Listing file paths and the corresponding file hashes and content types
        const fileHashesAndPaths = await fileHelpers.getFileHashesMappedToPaths(extractPath);

        // Uploading files to object storage individually with the file hash as the key
        if (!process.env.SPACES_BUCKET) {
            throw new Error('Error: SPACES_BUCKET environment variable is not defined');
        }
        
        const uploadedWithHash = await s3Helpers.saveFilesWithHashKey(fileHashesAndPaths, extractPath, process.env.SPACES_BUCKET);

        if (!uploadedWithHash) {
            console.log('Error: Uploading files to object storage failed');
            return res.status(500).json({
                message: 'Internal server error'
            })
        }

        console.log('Files uploaded to object storage');
        
        // Deleting local files
        fileHelpers.deleteLocalFiles(downloadPath, extractPath);
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

        if (!newPackage) {
            console.log('Error: Creating new package failed');
            return res.status(500).json({
                message: 'Internal server error'
            })
        }

        // Adding Files and FileTrees to database
        dbOperations.saveFilesAndFileTrees(newPackage.id, fileHashesAndPaths);

        console.log('Package structure saved to database');

        res.status(200).json({
            folderName: fileNameNoExt,
            packageId: newPackage.id
        })

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add new ScannerJob
router.post('/job', authenticateORTToken, async (req, res) => {
    try {
        // Checking if there already is a ScannerJob for the package
        const existingJob = await dbQueries.findScannerJobByPackageId(req.body.packageId);

        if (existingJob) {
            console.log('ScannerJob for the package already exists');
            return res.status(200).json({
                scannerJob: existingJob,
                message: 'Job already on queue'
            })
        }
        console.log('Adding a new ScannerJob to the database');

        const newScannerJob = await dbQueries.createScannerJob({
            data: {
                state: 'created',
                packageId: req.body.packageId
            }
        });

        // Getting list of files to be scanned
        const filesToBeScanned = await dbOperations.getFilesToBeScanned(req.body.packageId);

        console.log('Sending a request to Scanner Agent to add new job to the work queue');

        console.log('filesToBeScanned: ', filesToBeScanned);
        
        const postJobUrl = scannerUrl + 'job';

        const request = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.SA_TOKEN
            },
            body: JSON.stringify({
                jobId: newScannerJob.id,
                files: filesToBeScanned
            })
        }

        const response = await fetch(postJobUrl, request);

        if (response.status === 201) {
            console.log('Updating ScannerJob state to "queued"');

            const updatedScannerJob = await dbQueries.updateScannerJob({
                id: newScannerJob.id,
                data: { state: 'queued' }
            })

            console.log('Updating Package scanStatus to "pending"')
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

// Get ScannerJob state
router.get('/job-state/:id', authenticateORTToken, async (req, res) => {
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

// Update ScannerJob state
router.put('/job-state', authenticateSAToken, async (req, res) => {
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

// Save job results to database
router.post('/job-results', authenticateSAToken, async (req, res) => {
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
