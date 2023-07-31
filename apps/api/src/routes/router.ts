// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import { dosApi } from 'validation-helpers';
import { loadEnv } from 'common-helpers';
import * as s3Helpers from 's3-helpers';
import * as dbQueries from '../helpers/db_queries';
import * as dbOperations from '../helpers/db_operations';
import * as fileHelpers from '../helpers/file_helpers';
import { authenticateORTToken, authenticateSAToken } from '../helpers/auth_helpers';

loadEnv('../../.env');

const router = zodiosRouter(dosApi);

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
                message: 'Unable to determine if object with the requested key already exists'
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
                presignedUrl: presignedUrl,
                message: 'Presigned URL received'
            })
        } else {
            console.log('Error: Presigned URL is undefined');
            res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: 'Unable to get a presigned URL for the requested key'
            })
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Add new ScannerJob
router.post('/job', authenticateORTToken, async (req, res) => {
    try {
        if (!process.env.SPACES_BUCKET) {
            throw new Error('Error: SPACES_BUCKET environment variable is not defined');
        }

        // Checking if the package exists
        let jobPackage = await dbQueries.findPackageByPurl(req.body.purl);

        if (!jobPackage) {
            jobPackage = await dbQueries.createPackage({
                data: {
                    purl: req.body.purl,
                    name: 'placeHolder',
                    version: 'placeholder',
                    scanStatus: 'pending'
                }
            });
        }

        // Checking if there already is a ScannerJob for the package
        const existingJob = await dbQueries.findScannerJobByPackageId(jobPackage.id);

        if (existingJob && existingJob.state !== 'resultsDeleted' && existingJob.state !== 'failed') {
            // Deleting zip file from object storage
            await s3Helpers.deleteFile(process.env.SPACES_BUCKET, req.body.zipFileKey);

            return res.status(200).json({
                scannerJobId: existingJob.id
            })
        } else {

            jobPackage = await dbQueries.updatePackage({
                id: jobPackage.id,
                data: {
                    scanStatus: 'pending'
                }
            });

            console.log('Adding a new ScannerJob to the database');

            const newScannerJob = await dbQueries.createScannerJob({
                data: {
                    state: 'created',
                    packageId: jobPackage.id
                }
            });

            fileHelpers.processPackageAndSendToScanner(req.body.zipFileKey, newScannerJob.id, jobPackage.id);
            
            return res.status(200).json({
                scannerJobId: newScannerJob.id
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
        const scannerJob = await dbQueries.findScannerJobById(req.params.id);

        if (!scannerJob) {
            res.status(400).json({ message: 'Bad Request: Scanner Job with requested id cannot be found in the database' });
        } else {
            let results = null;
            let message = '';
            if (scannerJob.state === 'completed') {
                results = await dbOperations.getScanResults(scannerJob.packageId);
                message = 'Scan job completed';
            }
            if (scannerJob.state === 'failed') {
                message = 'Scan job failed';
            }
            if (scannerJob.state === 'queued' || scannerJob.state === 'waiting') {
                message = 'Scan job waiting on queue';
            }
            if (scannerJob.state === 'active') {
                message = 'Files are being scanned';
            }
            if (scannerJob.state === 'preparing') {
                message = 'Files are preparing for scanning';
            }


            res.status(200).json({
                state: {
                    status: scannerJob.state,
                    message: message
                },
                results: results
            })
        }
    } catch (error) {
        console.log('Problem with database query: ' + error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Update ScannerJob state
router.put('/job-state/:id', authenticateSAToken, async (req, res) => {
    try {
        const updatedScannerJob = await dbQueries.updateScannerJob({
            id: req.params.id as string,
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
            message: 'Received job with id ' + req.params.id + '. Changed state to ' + req.body.state
        })

    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
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
