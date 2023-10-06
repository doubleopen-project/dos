// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import { userAPI } from 'validation-helpers';
import * as dbQueries from '../helpers/db_queries';

const userRouter = zodiosRouter(userAPI);

// ----------------------------------- USER ROUTES -----------------------------------

userRouter.get('/user', async (req, res) => {
    try {
        const { user } = req;
        
        if (!user) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(200).send({ username: user.username });
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).send({ message: 'Internal server error' });
    }
})

userRouter.post('/license-conclusion', async (req, res) => {
    try {
        // TODO: add user id to the license conclusion
        const licenseConclusion = await dbQueries.createLicenseConclusion({
            data: {
                concludedLicenseExpressionSPDX: req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX: req.body.detectedLicenseExpressionSPDX,
                comment: req.body.comment,
                reason: req.body.reason,
                startLine: req.body.startLine,
                endLine: req.body.endLine,
                score: 100,
                fileSha256: req.body.fileSha256,
            }
        })

        if (licenseConclusion) {

            res.status(200).json({
                licenseConclusionId: licenseConclusion.id,
                message: 'License conclusion created'
            });
        } else {
            res.status(400).json({ message: 'Bad request: License conclusion could not be created' });
        }
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

userRouter.put('/license-conclusion/:id', async (req, res) => {
    try {
        // TODO: make sure that the license conclusion belongs to the user
        await dbQueries.updateLicenseConclusion(
            parseInt(req.params.id),
            {
                concludedLicenseExpressionSPDX: req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX: req.body.detectedLicenseExpressionSPDX,
                comment: req.body.comment,
                reason: req.body.reason,
                startLine: req.body.startLine,
                endLine: req.body.endLine
            }
        )

        res.status(200).json({ message: 'License conclusion updated' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error: ', error);

        if (error.code === 'P2025') {
            return res.status(400).json({ message: 'Bad request: License conclusion to update not found' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
})

userRouter.delete('/license-conclusion/:id', async (req, res) => {
    try {
        // TODO: make sure that the license conclusion belongs to the user
        await dbQueries.deleteLicenseConclusion(parseInt(req.params.id))

        res.status(200).json({ message: 'License conclusion deleted' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error: ', error);

        if (error.code === 'P2025') {
            return res.status(400).json({ message: 'Bad request: License conclusion with the requested id does not exist' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
})

export default userRouter;