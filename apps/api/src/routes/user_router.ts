// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import { userAPI } from 'validation-helpers';
//import * as dbQueries from '../helpers/db_queries';

const userRouter = zodiosRouter(userAPI);

// ----------------------------------- USER ROUTES -----------------------------------

userRouter.get('/user', async (req, res) => {
    try {
        const { user } = req;
        console.log(req);
        
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

export default userRouter;