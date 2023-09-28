// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from '@zodios/express';
import { authAPI } from 'validation-helpers';
import passport from 'passport';

const router = zodiosRouter(authAPI);

// ---------------------------------- AUTHENTICATION ROUTES ----------------------------------
router.post('/login/password', passport.authenticate('local'), (req, res) => {
    console.log('logged in ', req.body.username);
    res.sendStatus(200);
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {   
        if (err) {
            console.log('Error: ', err);
            return next(err);
        }
        res.send({ message: 'Logged out' });
    });
});

export default router;