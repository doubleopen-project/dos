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
        if (!req.user) throw new Error('User not found');

        const licenseConclusion = await dbQueries.createLicenseConclusion({
            data: {
                concludedLicenseExpressionSPDX: req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX: req.body.detectedLicenseExpressionSPDX,
                comment: req.body.comment,
                fileSha256: req.body.fileSha256,
                userId: req.user.id
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
        if (!req.user) throw new Error('User not found');

        const licenseConclusionId = parseInt(req.params.id);
        const licenseConclusionUserId = await dbQueries.findLicenseConclusionUserId(licenseConclusionId);

        if (!licenseConclusionUserId) res.status(404).json({ message: 'License conclusion to update not found' });
        // Make sure that the license conclusion belongs to the user or the user is admin
        if (req.user.role === 'ADMIN' || req.user.id === licenseConclusionUserId) {
            await dbQueries.updateLicenseConclusion(
                licenseConclusionId,
                {
                    concludedLicenseExpressionSPDX: req.body.concludedLicenseExpressionSPDX,
                    detectedLicenseExpressionSPDX: req.body.detectedLicenseExpressionSPDX,
                    comment: req.body.comment
                }
            )

            res.status(200).json({ message: 'License conclusion updated' });
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error: ', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'License conclusion to update not found' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
})

userRouter.delete('/license-conclusion/:id', async (req, res) => {
    try {
        if (!req.user) throw new Error('User not found');

        const licenseConclusionId = parseInt(req.params.id);
        const licenseConclusionUserId = await dbQueries.findLicenseConclusionUserId(licenseConclusionId);

        if (!licenseConclusionUserId) res.status(404).json({ message: 'License conclusion to delete not found' });
        // Make sure that the license conclusion belongs to the user or the user is admin
        if (req.user.role === 'ADMIN' || req.user.id === licenseConclusionUserId) {
            await dbQueries.deleteLicenseConclusion(licenseConclusionId)

            res.status(200).json({ message: 'License conclusion deleted' });
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error: ', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'License conclusion with the requested id does not exist' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
})

export default userRouter;