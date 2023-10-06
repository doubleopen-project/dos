// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import { guestAPI } from 'validation-helpers';
import * as dbQueries from '../helpers/db_queries';
import * as s3Helpers from 's3-helpers';

const guestRouter = zodiosRouter(guestAPI);

// ----------------------------------- GUEST ROUTES -----------------------------------

guestRouter.get('/file/:sha256', async (req, res) => {
    try {
        const fileData = await dbQueries.findFileData(req.params.sha256);
        const presignedGetUrl = await s3Helpers.getPresignedGetUrl(req.params.sha256, process.env.SPACES_BUCKET as string);

        if(!presignedGetUrl) {
            throw new Error('Error: Presigned URL is undefined');
        }

        if (fileData) {
            res.status(200).json({
                downloadUrl: presignedGetUrl,
                licenseFindings: fileData.licenseFindings,
                copyrightFindings: fileData.copyrightFindings
            });
        } else {
            res.status(400).json({ message: 'Bad request: File with the requested sha256 does not exist' });
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

guestRouter.get('/packages', async (req, res) => {
    try {
        const packages = await dbQueries.findScannedPackages();
        res.status(200).json({ packages: packages });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

guestRouter.post('/filetree', async (req, res) => {
    try {
        const filetrees = await dbQueries.findFileTreesByPackagePurl(req.body.purl);

        if (filetrees) {
            res.status(200).json({filetrees: filetrees.map((filetree) => {
                return {
                    path: filetree.path,
                    packageId: filetree.packageId,
                    fileSha256: filetree.fileSha256,
                    file: {
                        licenseFindings: (filetree.file.licenseFindings).map((licenseFinding) => {
                            return {licenseExpressionSPDX: licenseFinding.licenseExpressionSPDX}
                        }),
                    }
                }
            })});
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})



export default guestRouter;